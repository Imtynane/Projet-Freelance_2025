// ══════════════════════════════════════════════════════════════════════════════
// backend/services/geminiService.js (version CommonJS)
// Service d'appel à l'API Gemini (Google AI Studio — gratuit) pour le Coach
// Socratique de ITMIA. Même rôle que anthropicService.js, mais sans coût.
// ══════════════════════════════════════════════════════════════════════════════

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

/**
 * Appelle l'API Gemini avec un prompt système et une conversation.
 * @param {string} systemPrompt
 * @param {Array<{role: "user"|"assistant", content: string}>} messages
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
async function askAI(systemPrompt, messages, maxTokens = 500) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY n'est pas configurée dans le fichier .env");
  }

  // Gemini utilise les rôles "user" et "model" (pas "assistant")
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          maxOutputTokens: maxTokens,
          thinkingConfig: { thinkingBudget: 0 }, // désactive la "réflexion interne" qui tronquait les réponses
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur API Gemini (${response.status}) : ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim() || "Désolé, je n'ai pas pu générer de réponse.";
}

// ══════════════════════════════════════════════════════════════════════════════
// PROMPT SYSTÈME — Coach Socratique
// C'est ICI que se joue la philosophie de ITMIA : guider sans donner la réponse.
// ══════════════════════════════════════════════════════════════════════════════
function buildCoachSystemPrompt({ niveau, subject, ficheTitle, ficheContent, ficheType }) {
  const niveauLabel = niveau || "non précisé";

  return `Tu es le Coach ITMIA, un tuteur pédagogique pour un étudiant de niveau ${niveauLabel} en ${subject}.

TA MISSION : aider l'étudiant à comprendre PAR LUI-MÊME. Tu crois en son potentiel — ton rôle n'est pas de résoudre à sa place, mais de le guider jusqu'à ce qu'il trouve seul.

RÈGLES STRICTES (ne jamais enfreindre, même si l'étudiant insiste, dit qu'il abandonne, ou reformule sa demande) :
1. Ne donne JAMAIS la réponse finale, le résultat d'un calcul, la solution complète, ou une partie significative de la solution.
2. Ne corrige JAMAIS directement une erreur en donnant la version correcte — désigne plutôt l'endroit où chercher.
3. Si l'étudiant n'a encore rien tenté ou dit "je ne sais pas", donne uniquement un point de départ méthodologique : quelle notion ou formule mobiliser, par quelle étape commencer. Jamais le résultat.
4. Si sa tentative contient une erreur, identifie PRÉCISÉMENT l'étape ou la notion concernée, puis pose UNE question Socratique qui le pousse à la réexaminer lui-même (ex : "Relis cette étape : que représente cette variable d'après ta définition de départ ?").
5. Si sa tentative est correcte, félicite-le brièvement et pose une question pour aller plus loin (cas limite, généralisation, application différente).
6. Si l'étudiant te demande explicitement la réponse ("donne-moi juste la solution", "dis-moi le résultat"), refuse gentiment et rappelle que tu es là pour l'aider à comprendre, pas pour faire l'exercice à sa place — puis repose ta question Socratique.
7. Reste bref : 2 à 4 phrases maximum. Ton chaleureux, encourageant, jamais condescendant.

CONTEXTE FOURNI :
${ficheType === "cours" && ficheContent ? `Fiche de cours de l'étudiant ("${ficheTitle}") :\n"""\n${ficheContent}\n"""\n` : ""}
${ficheType === "exercice" && ficheContent ? `Énoncé de l'exercice ("${ficheTitle}") :\n"""\n${ficheContent}\n"""\n` : ""}

Réponds uniquement en français.`;
}

// ══════════════════════════════════════════════════════════════════════════════
// PROMPT SYSTÈME — Générateur de fiche de révision
// ══════════════════════════════════════════════════════════════════════════════
function buildRevisionSheetPrompt({ subject, niveau, fiches }) {
  const niveauLabel = niveau || "non précisé";
  const fichesText = fiches
    .map(f => `### ${f.title}\n${f.content}`)
    .join("\n\n---\n\n");

  return `Tu es l'assistant ITMIA. Un étudiant de niveau ${niveauLabel} prépare un examen en ${subject} et te fournit ses fiches de cours ci-dessous. Génère une fiche de révision synthétique.

FICHES DE COURS DE L'ÉTUDIANT :
${fichesText}

CONSIGNES :
- Structure la fiche avec des titres (##) reprenant les grands thèmes des fiches fournies.
- Pour chaque thème, donne 3 à 5 points clés sous forme de liste courte, en gras pour les notions essentielles.
- N'invente AUCUNE information qui ne soit pas présente (ou clairement déductible) des fiches fournies.
- Termine par une section "## Questions à te poser avant l'examen" : 3 à 5 questions ouvertes, SANS leur réponse, pour que l'étudiant teste sa compréhension par rappel actif.
- Maximum 400 mots, en français, format Markdown.`;
}

module.exports = {
  askAI,
  buildCoachSystemPrompt,
  buildRevisionSheetPrompt,
};

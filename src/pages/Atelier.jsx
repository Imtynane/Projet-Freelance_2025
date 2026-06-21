import { useEffect, useState, useRef } from "react";
import api from "../services/api";

// ── Constantes ─────────────────────────────────────────────────────────────
const TYPE_LABELS = {
  cours: { label: "Fiche de cours", icon: "📘", color: "bg-blue-50 text-itmia-blue border-blue-100" },
  exercice: { label: "Exercice", icon: "✏️", color: "bg-orange-50 text-orange-600 border-orange-100" },
};

// ══════════════════════════════════════════════════════════════════════════════
// Sous-composant : Chat avec le Coach Socratique
// ══════════════════════════════════════════════════════════════════════════════
function CoachChat({ fiche, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(`/fiches/${fiche.id}/coach`, {
        message: userMsg.content,
        history: messages,
      });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "⚠️ Le coach n'a pas pu répondre. Vérifie la configuration de l'API côté serveur.",
      }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs text-itmia-blue font-medium mb-0.5">Coach Socratique · ITMIA</p>
            <p className="text-sm font-semibold text-itmia-navy">{fiche.title}</p>
            <p className="text-xs text-gray-400">{fiche.subject}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-2xl leading-none">×</button>
        </div>

        {/* Énoncé */}
        <div className="px-4 py-3 bg-orange-50 border-b border-orange-100 max-h-28 overflow-y-auto">
          <p className="text-xs font-semibold text-orange-600 mb-1">Énoncé</p>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{fiche.content}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🧭</div>
              <p className="text-sm text-gray-400">
                Écris ta tentative ou ta réponse ci-dessous.<br />
                Le coach ne te donnera pas la solution — il t'aidera à voir où tu bloques.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-itmia-navy text-white"
                  : "bg-itmia-light text-itmia-navy border border-itmia-blue/15"
              }`}>
                {m.role === "assistant" && (
                  <p className="text-[10px] font-semibold text-itmia-blue mb-1 uppercase tracking-wide">Coach ITMIA</p>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-itmia-light text-itmia-navy border border-itmia-blue/15 rounded-xl px-3 py-2 text-sm">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-itmia-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-itmia-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-itmia-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ta tentative, ta réponse, ou pose ta question…"
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-itmia-blue transition-colors"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-40 self-end"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Sous-composant : Affichage simple de Markdown (titres ##, gras **, listes -)
// ══════════════════════════════════════════════════════════════════════════════
function SimpleMarkdown({ text }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("## ")) {
          return <p key={i} className="text-sm font-bold text-itmia-navy mt-3 mb-1">{trimmed.slice(3)}</p>;
        }
        if (trimmed.startsWith("# ")) {
          return <p key={i} className="text-base font-bold text-itmia-navy mt-3 mb-1">{trimmed.slice(2)}</p>;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return <p key={i} className="ml-3 mb-1">• {renderBold(trimmed.slice(2))}</p>;
        }
        if (trimmed === "") return <div key={i} className="h-1" />;
        return <p key={i} className="mb-1">{renderBold(trimmed)}</p>;
      })}
    </div>
  );
}

function renderBold(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-itmia-navy font-semibold">{part}</strong> : part
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Composant principal
// ══════════════════════════════════════════════════════════════════════════════
export default function Atelier() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire d'ajout
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("cours");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);

  // Coach
  const [activeFiche, setActiveFiche] = useState(null);

  // Fiche de révision
  const [revisionSubject, setRevisionSubject] = useState("");
  const [revisionSheet, setRevisionSheet] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [revisionError, setRevisionError] = useState(null);

  useEffect(() => {
    api.get("/fiches")
      .then(res => setFiches(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post("/fiches", { title, subject, type, content });
      setFiches([res.data, ...fiches]);
      setTitle(""); setSubject(""); setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/fiches/${id}`);
    setFiches(prev => prev.filter(f => f.id !== id));
  };

  const handleGenerateRevision = async () => {
    if (!revisionSubject) return;
    setGenerating(true);
    setRevisionError(null);
    setRevisionSheet(null);
    try {
      const res = await api.post("/fiches/revision-sheet", { subject: revisionSubject });
      setRevisionSheet(res.data.sheet);
    } catch (err) {
      setRevisionError(err.response?.data?.error || "Erreur lors de la génération.");
    } finally {
      setGenerating(false);
    }
  };

  const subjects = [...new Set(fiches.filter(f => f.type === "cours").map(f => f.subject))];
  const exercices = fiches.filter(f => f.type === "exercice");
  const cours = fiches.filter(f => f.type === "cours");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-itmia-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chargement de l'atelier…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-itmia-blue font-medium mb-1">Algorithme NCOP · Atelier de travail</p>
          <h1 className="text-2xl font-bold text-itmia-navy">Mes fiches & Coach Socratique</h1>
          <p className="text-gray-500 text-sm mt-1 max-w-3xl">
            Ajoute tes fiches de cours et tes exercices. Quand tu travailles un exercice,
            ITMIA ne te donne jamais la réponse — il t'aide à trouver où tu bloques et te pose
            les questions qui te feront avancer par toi-même. À la fin, génère une fiche de
            révision synthétique avant un examen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Formulaire d'ajout ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Ajouter une fiche
            </p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("cours")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    type === "cours" ? "bg-itmia-navy text-white border-itmia-navy" : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  📘 Fiche de cours
                </button>
                <button
                  type="button"
                  onClick={() => setType("exercice")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    type === "exercice" ? "bg-itmia-navy text-white border-itmia-navy" : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  ✏️ Exercice
                </button>
              </div>
              <input
                placeholder={type === "cours" ? "Titre (ex: Les fonctions dérivées)" : "Titre (ex: Exercice 4 - dérivées)"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <input
                placeholder="Matière (ex: Maths, Histoire, Informatique…)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <textarea
                placeholder={type === "cours"
                  ? "Colle ici le contenu de ta fiche de cours (définitions, formules, résumé…)"
                  : "Colle ici l'énoncé complet de l'exercice"}
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-50"
              >
                {adding ? "Ajout…" : "Ajouter la fiche →"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-itmia-light rounded-xl border border-itmia-blue/20">
              <p className="text-xs font-semibold text-itmia-blue mb-2">La philosophie du Coach ITMIA</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Contrairement aux assistants qui donnent la réponse directement, le Coach ITMIA
                pose des questions pour t'aider à <strong>comprendre par toi-même</strong> — exactement
                comme un bon prof le ferait. Il identifie où tu bloques et te guide vers la solution,
                sans jamais la donner.
              </p>
            </div>
          </div>

          {/* ── Mes exercices (Coach) ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Mes exercices ({exercices.length})
            </p>
            {exercices.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✏️</div>
                <p className="text-sm text-gray-400">Ajoute un exercice pour commencer à travailler avec le coach.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {exercices.map(f => (
                  <li key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-itmia-navy truncate">{f.title}</p>
                      <p className="text-xs text-gray-400">{f.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveFiche(f)}
                        className="px-3 py-1.5 bg-itmia-navy text-white text-xs rounded-lg hover:bg-itmia-blue transition-all"
                      >
                        Travailler →
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Mes fiches de cours ── */}
        {cours.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Mes fiches de cours ({cours.length})
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cours.map(f => (
                <div key={f.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 group relative">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_LABELS.cours.color}`}>
                    {TYPE_LABELS.cours.icon} {f.subject}
                  </span>
                  <p className="text-sm font-medium text-itmia-navy mt-2 truncate">{f.title}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{f.content}</p>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fiche de révision ── */}
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Générer une fiche de révision
          </p>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-400">Ajoute au moins une fiche de cours pour pouvoir générer une fiche de révision.</p>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <select
                  value={revisionSubject}
                  onChange={e => setRevisionSubject(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
                >
                  <option value="">Choisis une matière…</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={handleGenerateRevision}
                  disabled={!revisionSubject || generating}
                  className="px-5 py-2.5 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-50"
                >
                  {generating ? "Génération…" : "Générer →"}
                </button>
              </div>

              {revisionError && (
                <p className="text-xs text-red-500 mb-3">{revisionError}</p>
              )}

              {revisionSheet && (
                <div className="p-4 bg-itmia-light rounded-xl border border-itmia-blue/20">
                  <p className="text-xs font-semibold text-itmia-blue mb-2">
                    Fiche de révision · {revisionSubject}
                  </p>
                  <SimpleMarkdown text={revisionSheet} />
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {activeFiche && (
        <CoachChat fiche={activeFiche} onClose={() => setActiveFiche(null)} />
      )}
    </div>
  );
}

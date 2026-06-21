// ══════════════════════════════════════════════════════════════════════════════
// Banque d'exercices ITMIA v2 — exercices réels par sujet, matière, niveau, méthode
// ══════════════════════════════════════════════════════════════════════════════

// ── Détection de la catégorie de matière (fallback générique) ────────────────
const CATEGORY_KEYWORDS = {
  maths: ["math", "algebr", "geometr", "analyse", "calcul", "statist", "proba", "arithm"],
  info: ["info", "program", "python", "java", "javascript", "code", "algo", "données",
         "data", " ia", "intelligence artificielle", "web", "réseau", "reseau", "sql", "base de données"],
  sciences: ["physique", "chimie", "biolog", "svt", "science", "mécanique", "mecanique", "électro", "electro"],
  langues: ["anglais", "français", "francais", "espagnol", "allemand", "langue", "littérat", "litterat"],
  geo: ["géo", "geographie", "geography", "carte", "pays", "capitale", "continent", "frontière", "frontiere", "climat", "relief"],
  shs: ["histoire", "philo", "droit", "économie", "economie", "socio", "science politique", "civilisation"],
};

function detectCategory(subject) {
  if (!subject) return "general";
  const s = subject.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => s.includes(k))) return cat;
  }
  return "general";
}

// ── Détection du palier selon le niveau scolaire du profil ────────────────────
function getTier(niveau) {
  if (niveau === "college" || niveau === "lycee") return "junior";
  return "senior"; // licence, master, doctorat, ou non renseigné
}

// ══════════════════════════════════════════════════════════════════════════════
// COUCHE 1 — Sujets connus : vrais exercices, contenu réel (façon manuel)
// La correspondance se fait sur le TITRE du concept (mots-clés, insensible à la casse)
// ══════════════════════════════════════════════════════════════════════════════
const KNOWN_CONCEPTS = [
  {
    keywords: ["première guerre mondiale", "1ère guerre mondiale", "1ere guerre mondiale", "grande guerre", "14-18", "1914"],
    exercises: {
      lecture: "Rédige en 8 à 10 lignes le récit des origines de la Première Guerre mondiale : le système des alliances (Triple Entente / Triple Alliance), les rivalités coloniales et nationalistes, et l'élément déclencheur de l'été 1914 (l'assassinat de l'archiduc François-Ferdinand à Sarajevo).",
      recall: "Sans regarder ton cours : cite les deux camps en présence avec au moins trois pays de chaque côté, donne les dates de début et de fin du conflit, et nomme deux nouvelles armes ou techniques de guerre apparues durant ce conflit.",
      interleaving: "Compare les causes de la Première Guerre mondiale avec celles de la Révolution française : trouve un point commun (tensions sociales ou économiques) et une différence majeure (déclencheur, échelle géographique).",
      feynman: "Explique à quelqu'un qui n'a jamais fait d'histoire pourquoi un assassinat survenu en Serbie a pu déclencher une guerre impliquant la quasi-totalité de l'Europe, sans utiliser le mot « alliance » sans le définir.",
    },
  },
  {
    keywords: ["seconde guerre mondiale", "2nde guerre mondiale", "2e guerre mondiale", "deuxième guerre mondiale", "deuxieme guerre mondiale", "39-45", "1939", "1945"],
    exercises: {
      lecture: "Rédige en 8 à 10 lignes le récit du déclenchement de la Seconde Guerre mondiale : l'invasion de la Pologne par l'Allemagne en septembre 1939, les deux camps en présence (Alliés / Axe), et l'entrée en guerre des États-Unis après l'attaque de Pearl Harbor en décembre 1941.",
      recall: "Sans notes, donne les dates de début et de fin de la Seconde Guerre mondiale, cite les trois principales puissances de l'Axe, et nomme deux événements majeurs du conflit (par exemple le débarquement de Normandie ou les bombardements d'Hiroshima et Nagasaki).",
      interleaving: "Compare la Première et la Seconde Guerre mondiale : trouve une cause commune aux deux conflits et une différence majeure dans leur déroulement (par exemple guerre de tranchées contre guerre de mouvement).",
      feynman: "Explique à quelqu'un qui n'a jamais fait d'histoire en quoi le traité signé à la fin de la Première Guerre mondiale est souvent présenté comme une des causes de la Seconde, sans utiliser le mot « réparations » sans le définir.",
    },
  },
  {
    keywords: ["traité de versailles", "traite de versailles", "traité de versaille", "traite de versaille", "versailles", "versaille"],
    exercises: {
      lecture: "Rédige en 6 à 8 lignes le contenu du traité de Versailles (1919) : les sanctions imposées à l'Allemagne (perte de territoires, réduction de son armée, réparations financières) et la clause de responsabilité de la guerre (article 231).",
      recall: "Sans notes, donne l'année de signature du traité de Versailles, cite deux sanctions imposées à l'Allemagne, et nomme l'organisation internationale créée à la suite de ce traité (la Société des Nations).",
      interleaving: "Étudie le traité de Versailles, puis la Seconde Guerre mondiale, et explique en une phrase comment les conditions imposées par ce traité ont pu contribuer aux tensions ayant mené au second conflit.",
      feynman: "Explique à un camarade pourquoi de nombreux Allemands ont perçu le traité de Versailles comme une humiliation, en donnant un exemple concret tiré de son contenu.",
    },
  },
  {
    keywords: ["révolution française", "revolution francaise", "1789"],
    exercises: {
      lecture: "Rédige en 8 à 10 lignes la chronologie de la Révolution française entre 1789 et 1799 : la prise de la Bastille, la Déclaration des droits de l'homme, la chute de la monarchie et la période de la Terreur.",
      recall: "Sans notes, cite trois causes de la Révolution française (économiques, sociales, politiques), donne la date de la prise de la Bastille, et nomme deux grandes réformes adoptées entre 1789 et 1791.",
      interleaving: "Étudie la Révolution française, puis la Première Guerre mondiale, et identifie un point commun entre les deux événements concernant les tensions sociales qui ont précédé chacun.",
      feynman: "Explique à un enfant de 10 ans pourquoi les Français ont voulu remplacer leur roi par une République, avec un exemple concret d'injustice de l'époque (impôts, privilèges).",
    },
  },
  {
    keywords: ["python"],
    exercises: {
      lecture: "Lis la documentation sur les listes Python (append, pop, slicing, len). Écris ensuite un programme qui crée une liste de 5 nombres et affiche le plus grand, sans utiliser la fonction max().",
      recall: "Sans documentation, écris de mémoire une boucle for qui parcourt une liste de nombres et affiche uniquement les nombres pairs. Ajoute ensuite une condition pour compter combien il y en a.",
      interleaving: "Écris un programme utilisant une liste (ex : notes d'élèves), puis un programme utilisant un dictionnaire sur le même thème, en alternant entre les deux structures de données.",
      feynman: "Explique à un débutant complet la différence entre une liste et un tuple en Python, avec un exemple concret où chacun des deux est préférable.",
    },
  },
  {
    keywords: ["programmation c", "langage c", "pointeur"],
    exercises: {
      lecture: "Lis le chapitre sur les pointeurs en C. Dessine un schéma à la main montrant une variable int, son adresse mémoire, et un pointeur qui la référence (avec les opérateurs & et *).",
      recall: "Sans notes, écris un programme C qui échange (swap) les valeurs de deux variables entières en utilisant des pointeurs, avec une fonction void swap(int *a, int *b).",
      interleaving: "Code un exercice utilisant des pointeurs, puis un exercice utilisant des tableaux, et explique en une phrase pourquoi un tableau en C est en réalité un pointeur vers son premier élément.",
      feynman: "Explique à un débutant ce qu'est un pointeur en utilisant l'analogie d'une adresse postale (le pointeur) par rapport au contenu d'une maison (la valeur).",
    },
  },
  {
    keywords: ["algorithme de tri", "tri à bulles", "tri a bulles", "bubble sort", "tri rapide", "quicksort", "tri par insertion"],
    exercises: {
      lecture: "Lis le fonctionnement du tri à bulles (bubble sort). Trace à la main, étape par étape, son exécution sur le tableau [5, 2, 4, 1, 3] jusqu'à obtenir le tableau trié.",
      recall: "Sans notes, écris le pseudocode du tri par insertion (insertion sort) et donne sa complexité dans le pire cas (notation Big-O).",
      interleaving: "Trace l'exécution du tri à bulles sur un tableau de 5 éléments, puis celle du tri rapide (quicksort) sur le même tableau. Compare le nombre d'opérations effectuées par chacun.",
      feynman: "Explique la différence entre un algorithme en O(n²) et un algorithme en O(n log n) à quelqu'un qui ne connaît pas la notation Big-O, avec l'analogie du tri d'un jeu de cartes.",
    },
  },
  {
    keywords: ["lstm", "réseau de neurones", "reseau de neurones", "rnn", "deep learning"],
    exercises: {
      lecture: "Lis le schéma d'une cellule LSTM (porte d'oubli, porte d'entrée, porte de sortie). Reproduis-le de mémoire en nommant chaque porte et en décrivant son rôle en une phrase.",
      recall: "Sans notes, explique à quoi sert chaque porte d'un LSTM (forget, input, output) et pourquoi cette architecture résout le problème de disparition du gradient des RNN classiques.",
      interleaving: "Étudie l'architecture LSTM, puis celle d'un RNN simple, et liste deux différences clés entre les deux (mémoire à long terme, nombre de portes).",
      feynman: "Explique à quelqu'un sans bagage en IA pourquoi un LSTM a une forme de « mémoire » alors qu'un réseau de neurones classique n'en a pas, sans utiliser le mot « gradient ».",
    },
  },
  {
    keywords: ["théorème de bayes", "theoreme de bayes", "bayes", "probabilité conditionnelle", "probabilite conditionnelle"],
    exercises: {
      lecture: "Lis la formule du théorème de Bayes : P(A|B) = P(B|A) × P(A) / P(B). Identifie ce que représente chacun des quatre termes dans un exemple de ton choix.",
      recall: "Sans notes, écris la formule de Bayes puis applique-la : un test médical est positif chez 95 % des malades et chez 5 % des non-malades ; la maladie touche 1 % de la population. Quelle est la probabilité d'être malade si le test est positif ?",
      interleaving: "Résous un exercice avec le théorème de Bayes, puis un exercice de probabilités conditionnelles avec un arbre de probabilité, et compare les deux méthodes de résolution.",
      feynman: "Explique le théorème de Bayes sans écrire aucune formule, en utilisant l'exemple du test médical : pourquoi un résultat positif ne signifie-t-il pas forcément qu'on est malade ?",
    },
  },
  {
    keywords: ["théorème de pythagore", "theoreme de pythagore", "pythagore"],
    exercises: {
      lecture: "Lis l'énoncé du théorème de Pythagore. Dessine un triangle rectangle, nomme ses côtés (a, b et l'hypoténuse c), puis écris la formule a² + b² = c².",
      recall: "Sans notes, énonce le théorème de Pythagore et calcule la longueur de l'hypoténuse d'un triangle rectangle dont les deux côtés mesurent 3 cm et 4 cm.",
      interleaving: "Résous un exercice utilisant le théorème de Pythagore, puis un exercice utilisant le théorème de Thalès, et note la différence entre les deux configurations de triangle utilisées.",
      feynman: "Explique pourquoi a² + b² = c² fonctionne, en t'aidant d'un dessin représentant un carré construit sur chacun des trois côtés du triangle.",
    },
  },
  {
    keywords: ["dérivée", "derivee", "dérivation", "derivation"],
    exercises: {
      lecture: "Lis les règles de dérivation de base (puissance, produit, quotient, fonction composée). Calcule la dérivée de f(x) = 3x² + 2x − 5.",
      recall: "Sans notes, calcule les dérivées des fonctions suivantes : f(x) = x³, g(x) = x·sin(x), h(x) = 1/x.",
      interleaving: "Calcule la dérivée d'une fonction, puis une primitive (intégrale) de la fonction obtenue, puis dérive à nouveau ce résultat. Vérifie que tu retombes sur la fonction de départ.",
      feynman: "Explique à un camarade ce que représente géométriquement la dérivée d'une fonction en un point (la pente de la tangente à la courbe), à l'aide d'un dessin.",
    },
  },
  {
    keywords: ["intégrale", "integrale", "intégration", "integration", "primitive"],
    exercises: {
      lecture: "Lis les formules des primitives usuelles (xⁿ, 1/x, eˣ, sin, cos). Calcule une primitive de f(x) = 2x + 3.",
      recall: "Sans notes, calcule l'intégrale définie de f(x) = x² entre 0 et 2, en détaillant chaque étape du calcul.",
      interleaving: "Calcule une intégrale, puis dérive le résultat obtenu pour vérifier que tu retrouves la fonction de départ. Refais l'exercice avec une autre fonction.",
      feynman: "Explique à un camarade ce que représente géométriquement une intégrale définie (l'aire sous la courbe), avec un dessin d'une fonction simple.",
    },
  },
  {
    keywords: ["photosynthèse", "photosynthese"],
    exercises: {
      lecture: "Lis le schéma de la photosynthèse. Reproduis-le de mémoire en indiquant les réactifs (CO₂, eau, lumière) et les produits (O₂, glucose), ainsi que le lieu où elle se déroule.",
      recall: "Sans notes, écris l'équation simplifiée de la photosynthèse et explique dans quel organite de la cellule végétale elle a lieu (chloroplaste).",
      interleaving: "Étudie la photosynthèse, puis la respiration cellulaire, et compare-les : quelles sont les entrées et sorties de chaque processus ? Que remarques-tu ?",
      feynman: "Explique à un enfant de 8 ans comment une plante « mange » la lumière du soleil pour fabriquer sa propre nourriture.",
    },
  },
  {
    keywords: ["mitose", "division cellulaire", "méiose", "meiose"],
    exercises: {
      lecture: "Lis les étapes de la mitose (prophase, métaphase, anaphase, télophase). Dessine un schéma pour chaque étape en représentant les chromosomes.",
      recall: "Sans notes, liste les 4 phases de la mitose dans l'ordre, et décris en une phrase ce qui arrive aux chromosomes à chaque étape.",
      interleaving: "Étudie la mitose, puis la méiose, et identifie la différence principale entre les deux (nombre de cellules filles produites, nombre de chromosomes dans chaque cellule).",
      feynman: "Explique la mitose à un camarade comme « une cellule qui se photocopie entièrement, puis se sépare en deux cellules identiques ».",
    },
  },
  {
    keywords: ["loi de newton", "lois de newton", "mécanique", "mecanique", "principe fondamental de la dynamique", "newton"],
    exercises: {
      lecture: "Lis l'énoncé des trois lois de Newton. Pour chacune, trouve un exemple concret de la vie quotidienne qui l'illustre.",
      recall: "Sans notes, énonce le principe d'inertie (1ère loi) et la relation fondamentale de la dynamique F = m·a (2ème loi), avec les unités de chaque grandeur.",
      interleaving: "Résous un exercice utilisant F = m·a, puis un exercice sur l'énergie cinétique (Ec = ½mv²), et explique le lien entre force et énergie dans ce contexte.",
      feynman: "Explique pourquoi tu es projeté vers l'avant quand une voiture freine brusquement, en citant la loi de Newton concernée et en évitant le mot « force » sans le définir.",
    },
  },
  {
    keywords: ["sql", "base de données", "base de donnees", "jointure", "requête sql", "requete sql"],
    exercises: {
      lecture: "Lis la syntaxe de base SELECT / WHERE / JOIN. Écris une requête SQL qui sélectionne le nom et l'email des utilisateurs ayant créé une session cette semaine.",
      recall: "Sans documentation, écris une requête SQL avec une jointure (JOIN) entre deux tables de ton choix, par exemple Users et Sessions, pour afficher le nom de l'utilisateur et le titre de chaque session.",
      interleaving: "Écris une requête SQL avec une jointure, puis écris le code Prisma (ORM) équivalent, et compare la syntaxe des deux approches pour la même opération.",
      feynman: "Explique à un débutant ce qu'est une jointure (JOIN) entre deux tables, en utilisant l'analogie d'un annuaire téléphonique relié à une liste d'adresses.",
    },
  },
];

function matchKnownConcept(title) {
  if (!title) return null;
  const t = title.toLowerCase();
  for (const concept of KNOWN_CONCEPTS) {
    if (concept.keywords.some(k => t.includes(k))) return concept;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════════════════
// COUCHE 2 — Fallback générique par catégorie / palier (si sujet non reconnu)
// Placeholder {title} remplacé par le titre du concept
// ══════════════════════════════════════════════════════════════════════════════
const EXERCISE_BANK = {
  maths: {
    junior: {
      lecture:      "Lis la leçon sur « {title} ». Cache ton cours, puis résous un exercice simple d'application en suivant la méthode vue.",
      recall:       "Cache ton cours. Résous de mémoire un exercice utilisant « {title} » (formule ou méthode), puis vérifie chaque étape avec ton cours.",
      interleaving: "Résous un exercice sur « {title} », puis un exercice d'un chapitre précédent, en alternant. Note la méthode utilisée pour chacun.",
      feynman:      "Rédige la correction de « {title} » comme si tu l'expliquais à un camarade qui a séché le cours, étape par étape.",
    },
    senior: {
      lecture:      "Lis la définition formelle de « {title} », identifie les hypothèses nécessaires, puis applique-la à un exercice simple.",
      recall:       "Sans notes, redémontre ou reconstruis le résultat de « {title} » à partir de zéro, puis résous un exercice qui l'utilise.",
      interleaving: "Résous un exercice appliquant « {title} », puis un exercice d'un chapitre différent utilisant une méthode proche. Identifie ce qui distingue les deux approches.",
      feynman:      "Rédige un paragraphe expliquant « {title} » à un étudiant de niveau inférieur, avec un exemple chiffré, sans jargon non défini.",
    },
  },
  info: {
    junior: {
      lecture:      "Lis la définition de « {title} ». Écris ensuite un petit programme (5-10 lignes) qui illustre concrètement ce concept.",
      recall:       "Sans documentation, écris le code ou le pseudocode de « {title} » sur une feuille. Exécute-le mentalement sur un exemple, puis vérifie avec tes notes.",
      interleaving: "Code un petit exercice utilisant « {title} », puis un exercice sur une autre notion vue récemment, puis reviens à « {title} ».",
      feynman:      "Explique « {title} » à voix haute comme si tu apprenais à programmer à un ami qui n'a jamais codé, avec un exemple simple.",
    },
    senior: {
      lecture:      "Lis la définition technique de « {title} », puis écris un court extrait de code qui l'illustre, en identifiant sa complexité et ses cas d'usage.",
      recall:       "Sans notes, écris le pseudocode complet de « {title} » ainsi que sa complexité temporelle et spatiale. Compare avec la documentation.",
      interleaving: "Implémente un exercice utilisant « {title} », puis un exercice utilisant une structure de données ou un algorithme différent. Compare les performances.",
      feynman:      "Explique « {title} » à un développeur junior en 3 minutes, avec un exemple de code commenté.",
    },
  },
  sciences: {
    junior: {
      lecture:      "Lis le cours sur « {title} ». Sans regarder, dessine un schéma annoté qui résume le phénomène, puis résous un exercice simple.",
      recall:       "Cache ton cours. Écris tout ce que tu sais sur « {title} » : définition, formule, unité, exemple. Résous ensuite un exercice et vérifie.",
      interleaving: "Fais un exercice sur « {title} », puis un exercice sur un autre chapitre (un calcul différent), puis reviens à « {title} ».",
      feynman:      "Explique « {title} » à un camarade en utilisant un exemple de la vie quotidienne, puis applique-le à un petit calcul.",
    },
    senior: {
      lecture:      "Lis la définition de « {title} », identifie le modèle théorique sous-jacent et ses limites de validité, puis résous un exercice d'application.",
      recall:       "Sans notes, reconstruis le raisonnement complet menant à « {title} » (hypothèses, étapes, résultat, unités), puis applique-le à un problème.",
      interleaving: "Résous un problème sur « {title} », puis un problème portant sur un autre concept du même domaine, en identifiant les liens entre les deux.",
      feynman:      "Rédige une explication de « {title} » destinée à un public non spécialiste, avec une analogie pertinente et un exemple chiffré.",
    },
  },
  langues: {
    junior: {
      lecture:      "Lis la règle ou le vocabulaire de « {title} ». Cache-le, puis écris 3 phrases en l'utilisant correctement.",
      recall:       "Sans support, écris 5 phrases utilisant « {title} » dans des contextes différents (affirmatif, négatif, interrogatif), puis vérifie et corrige.",
      interleaving: "Pratique « {title} », puis une autre règle déjà apprise, en alternant les exercices entre les deux.",
      feynman:      "Explique la règle de « {title} » à un camarade comme si c'était sa première rencontre avec cette notion, avec deux exemples.",
    },
    senior: {
      lecture:      "Lis le contenu sur « {title} », résume-le en une phrase, puis rédige un court paragraphe l'utilisant en contexte.",
      recall:       "Sans support, rédige un court paragraphe utilisant « {title} » correctement, puis vérifie la justesse grammaticale et lexicale.",
      interleaving: "Travaille « {title} », puis une autre structure ou notion, en les combinant dans un même texte ou dialogue.",
      feynman:      "Explique la nuance de « {title} » à quelqu'un qui confond souvent cette notion avec une autre proche, avec un exemple de chaque cas.",
    },
  },
  geo: {
    junior: {
      lecture:      "Lis le cours sur « {title} ». Sans regarder, dessine ou complète une carte muette en plaçant les éléments clés (pays, villes, frontières) liés à ce sujet.",
      recall:       "Cache ton cours. Liste tout ce que tu sais sur « {title} » : noms, localisations, caractéristiques principales. Vérifie ensuite sur une carte.",
      interleaving: "Étudie « {title} », puis un autre lieu ou notion de géographie déjà vu, en comparant leurs caractéristiques (climat, population, relief).",
      feynman:      "Explique « {title} » à un camarade comme si vous prépariez un voyage ensemble, en donnant les informations essentielles à connaître.",
    },
    senior: {
      lecture:      "Lis la définition et le contexte de « {title} », localise-le précisément sur une carte, puis identifie un enjeu géopolitique ou économique associé.",
      recall:       "Sans notes, présente « {title} » : localisation précise, caractéristiques principales (physiques, démographiques ou économiques selon le sujet), et un enjeu actuel associé.",
      interleaving: "Étudie « {title} », puis un territoire ou concept géographique voisin, en construisant une comparaison (atouts, contraintes, enjeux).",
      feynman:      "Explique « {title} » à un non-spécialiste en termes simples, comme si tu lui montrais une carte mentale du sujet.",
    },
  },
  shs: {
    junior: {
      lecture:      "Lis le cours sur « {title} ». Sans regarder, rédige un résumé de 5 lignes avec les dates et notions clés.",
      recall:       "Cache ton cours. Liste tout ce que tu sais sur « {title} » : définition, contexte, dates, acteurs ou exemples importants.",
      interleaving: "Étudie « {title} », puis un autre événement ou notion du programme, en cherchant un point commun ou une différence.",
      feynman:      "Raconte « {title} » comme une histoire à quelqu'un qui n'a jamais étudié ce sujet, en 5 phrases maximum.",
    },
    senior: {
      lecture:      "Lis la définition et le contexte de « {title} », puis identifie le débat ou l'enjeu central qui s'y rattache.",
      recall:       "Sans notes, rédige un plan détaillé sur « {title} » : contexte, enjeux, arguments, exemples, limites.",
      interleaving: "Travaille « {title} », puis une autre notion du programme, en construisant une comparaison argumentée entre les deux.",
      feynman:      "Explique « {title} » à un non-spécialiste en évitant le jargon académique, avec un exemple concret.",
    },
  },
  general: {
    junior: {
      lecture:      "Lis la définition de « {title} ». Cache-la, reformule-la avec tes propres mots, puis donne un exemple concret.",
      recall:       "Sans regarder ton cours, écris tout ce que tu te souviens sur « {title} », puis vérifie et complète ce qui manque.",
      interleaving: "Travaille sur « {title} », puis sur un autre sujet en cours, en alternant entre les deux.",
      feynman:      "Explique « {title} » à voix haute comme si tu parlais à quelqu'un qui n'en a jamais entendu parler, avec un exemple.",
    },
    senior: {
      lecture:      "Lis la définition de « {title} », identifie les points clés et leurs liens, puis reformule-les sans support.",
      recall:       "Sans notes, reconstruis l'essentiel de « {title} » : définition, application concrète, limites.",
      interleaving: "Alterne entre « {title} » et un autre sujet en cours d'apprentissage, en cherchant les liens entre les deux.",
      feynman:      "Rédige une explication simple de « {title} » destinée à un débutant complet, avec un exemple concret.",
    },
  },
};

// ── Métadonnées par méthode (icône, nom, théorie) ──────────────────────────────
const METHOD_META = {
  lecture:      { type: "Lecture active",          icon: "📖", method: "Active Recall" },
  recall:       { type: "Rappel actif simple",      icon: "🔄", method: "Active Recall" },
  interleaving: { type: "Entrelacement",            icon: "🔀", method: "Interleaving" },
  feynman:      { type: "Explique-le à voix haute", icon: "🗣️", method: "Technique Feynman" },
};

// ── Fonction principale : suggère un exercice réel et concret ────────────────
export function suggestExercise(concept, niveau) {
  const ef  = concept.easinessFactor;
  const rep = concept.repetitions;

  let methodKey;
  if (rep === 0)        methodKey = "lecture";
  else if (ef < 1.8)    methodKey = "recall";
  else if (ef < 2.2)    methodKey = "interleaving";
  else                  methodKey = "feynman";

  const category = detectCategory(concept.subject);
  const tier = getTier(niveau);

  // Couche 1 : sujet reconnu -> exercice réel avec contenu spécifique
  const known = matchKnownConcept(concept.title);
  let exercise;
  let isKnown = false;
  if (known) {
    exercise = known.exercises[methodKey];
    isKnown = true;
  } else {
    // Couche 2 : fallback générique par catégorie / palier
    const template = EXERCISE_BANK[category][tier][methodKey];
    exercise = template.replace(/\{title\}/g, concept.title);
  }

  return {
    ...METHOD_META[methodKey],
    exercise,
    category,
    tier,
    isKnown,
  };
}

// Labels lisibles pour affichage (debug / UI)
export const CATEGORY_LABELS = {
  maths: "Mathématiques",
  info: "Informatique",
  sciences: "Sciences",
  langues: "Langues",
  geo: "Géographie",
  shs: "Sciences humaines",
  general: "Général",
};

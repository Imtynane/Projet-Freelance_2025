import { useEffect, useState } from "react";
import api from "../services/api";
import { format, isPast, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { suggestExercise, CATEGORY_LABELS } from "./exerciseBank";

// ── Qualité de révision ───────────────────────────────────────────────────────
const QUALITY_OPTIONS = [
  { value: 0, label: "Blackout", desc: "Aucun souvenir", color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" },
  { value: 2, label: "Difficile", desc: "Souvenir flou", color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200" },
  { value: 3, label: "Correct",  desc: "Avec effort",   color: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200" },
  { value: 4, label: "Bien",     desc: "Quelques hésitations", color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" },
  { value: 5, label: "Parfait",  desc: "Réponse immédiate", color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" },
];

// ── Badge statut révision ─────────────────────────────────────────────────────
function ReviewBadge({ nextReview }) {
  const date = new Date(nextReview);
  if (isToday(date)) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium border border-orange-200">
        À réviser aujourd'hui
      </span>
    );
  }
  if (isPast(date)) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium border border-red-200">
        En retard
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium border border-green-200">
      {format(date, "dd MMM", { locale: fr })}
    </span>
  );
}

// ── Card d'un concept à réviser aujourd'hui ───────────────────────────────────
function DueConceptCard({ concept, niveau, isReviewing, onStartReview, onCancelReview, onReview }) {
  if (isReviewing) {
    return (
      <div>
        <p className="text-sm font-semibold text-itmia-navy mb-1">{concept.title}</p>
        <p className="text-xs text-gray-500 mb-3">Comment tu t'en souviens ?</p>
        <div className="grid grid-cols-2 gap-2">
          {QUALITY_OPTIONS.map(q => (
            <button
              key={q.value}
              onClick={() => onReview(concept, q.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${q.color}`}
            >
              <div className="font-semibold">{q.label}</div>
              <div className="opacity-70">{q.desc}</div>
            </button>
          ))}
        </div>
        <button
          onClick={onCancelReview}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
        >
          Annuler
        </button>
      </div>
    );
  }

  const suggestion = suggestExercise(concept, niveau);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-itmia-navy">{concept.title}</p>
          <p className="text-xs text-gray-400">
            {concept.subject && `${concept.subject} · `}
            Rép. {concept.repetitions} · EF {concept.easinessFactor.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => onStartReview(concept)}
          className="px-3 py-1.5 bg-itmia-navy text-white text-xs rounded-lg hover:bg-itmia-blue transition-all"
        >
          Réviser →
        </button>
      </div>

      {/* Exercice suggéré par NCOP — réel et concret */}
      <div className="mt-2 p-2.5 bg-white rounded-lg border border-orange-200 flex items-start gap-2">
        <span className="text-lg">{suggestion.icon}</span>
        <div>
          <p className="text-xs font-semibold text-itmia-navy">
            {suggestion.type} <span className="text-gray-400 font-normal">· {suggestion.method}</span>
            {suggestion.isKnown && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                Exercice vérifié
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{suggestion.exercise}</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Composant principal
// ══════════════════════════════════════════════════════════════════════════════
export default function Ebbinghaus() {
  const [concepts, setConcepts] = useState([]);
  const [niveau, setNiveau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [adding, setAdding] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/concepts"),
      api.get("/users/profile").catch(() => ({ data: {} })),
    ])
      .then(([conceptsRes, profileRes]) => {
        setConcepts(conceptsRes.data);
        setNiveau(profileRes.data?.niveau || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post("/concepts", { title, subject });
      setConcepts([res.data, ...concepts]);
      setTitle("");
      setSubject("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleReview = async (concept, quality) => {
    try {
      const res = await api.post(`/concepts/${concept.id}/review`, { quality });
      setConcepts(prev => prev.map(c => (c.id === concept.id ? res.data : c)));
      setReviewingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/concepts/${id}`);
    setConcepts(prev => prev.filter(c => c.id !== id));
  };

  const dueToday = concepts.filter(c => isToday(new Date(c.nextReview)) || isPast(new Date(c.nextReview)));
  const upcoming = concepts.filter(c => !isToday(new Date(c.nextReview)) && !isPast(new Date(c.nextReview)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-itmia-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chargement des révisions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-sm text-itmia-blue font-medium mb-1">Algorithme NCOP · Module Ebbinghaus</p>
          <h1 className="text-2xl font-bold text-itmia-navy">Révision Espacée</h1>
          <p className="text-gray-500 text-sm mt-1">
            ITMIA calcule automatiquement la prochaine date de révision optimale pour chaque concept
            et te propose un exercice adapté à ta matière et à ton niveau.
          </p>
          {!niveau && (
            <p className="text-xs text-orange-500 mt-1">
              ⚠️ Renseigne ton niveau scolaire dans ton profil pour des exercices encore mieux calibrés.
            </p>
          )}
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Concepts total", value: concepts.length, icon: "🧠" },
            { label: "À réviser aujourd'hui", value: dueToday.length, icon: "🔔", alert: dueToday.length > 0 },
            { label: "Maîtrisés (≥3 rép.)", value: concepts.filter(c => c.repetitions >= 3).length, icon: "✅" },
          ].map(k => (
            <div key={k.label} className={`bg-white rounded-xl p-4 border shadow-sm ${k.alert ? "border-orange-200" : "border-gray-100"}`}>
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className={`text-2xl font-bold ${k.alert ? "text-orange-600" : "text-itmia-navy"}`}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Formulaire ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Nouveau concept à mémoriser
            </p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input
                placeholder="Ex: Algorithme LSTM, Théorème de Bayes…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <input
                placeholder="Matière (ex: IA, Maths, Histoire…)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-50"
              >
                {adding ? "Ajout…" : "Ajouter le concept →"}
              </button>
            </form>

            {/* Explication NCOP */}
            <div className="mt-6 p-4 bg-itmia-light rounded-xl border border-itmia-blue/20">
              <p className="text-xs font-semibold text-itmia-blue mb-2">Comment fonctionne ITMIA ?</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                L'algorithme <strong>SM-2</strong> calcule l'intervalle optimal entre chaque révision
                selon ton score de rappel (0→5). En plus de la date, ITMIA te propose un{" "}
                <strong>exercice concret</strong>, adapté à la matière du concept et à ton niveau
                scolaire ({CATEGORY_LABELS.general} par défaut, sinon Maths, Informatique, Sciences,
                Langues ou Sciences humaines selon la matière saisie).
              </p>
            </div>
          </div>

          {/* ── Concepts à réviser aujourd'hui ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              À réviser maintenant ({dueToday.length})
            </p>

            {dueToday.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm text-gray-400">Aucune révision en attente.</p>
                <p className="text-xs text-gray-300 mt-1">ITMIA te préviendra quand c'est l'heure.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {dueToday.map(c => (
                  <li key={c.id} className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                    <DueConceptCard
                      concept={c}
                      niveau={niveau}
                      isReviewing={reviewingId === c.id}
                      onStartReview={(concept) => setReviewingId(concept.id)}
                      onCancelReview={() => setReviewingId(null)}
                      onReview={handleReview}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Tous les concepts à venir ── */}
        {upcoming.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Prochaines révisions planifiées ({upcoming.length})
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcoming.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group">
                  <div>
                    <p className="text-sm font-medium text-itmia-navy">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {c.subject && <span className="text-xs text-gray-400">{c.subject}</span>}
                      <ReviewBadge nextReview={c.nextReview} />
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Intervalle : {c.interval}j · EF : {c.easinessFactor.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


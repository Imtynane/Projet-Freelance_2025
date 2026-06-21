import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// ── Calcul du jumeau cognitif ─────────────────────────────────────────────────
function computeCognitiveTwin(profile, sessions) {
  const chronoLabel = {
    matin: { label: "Lève-tôt", icon: "🌅", creneaux: ["06h–09h", "09h–12h"], desc: "Ton cerveau est au maximum le matin. Planifie tes tâches complexes avant midi." },
    soir:  { label: "Noctambule", icon: "🌙", creneaux: ["18h–21h", "21h–00h"], desc: "Tu performes mieux en soirée. Réserve les tâches légères pour la matinée." },
    flexible: { label: "Flexible", icon: "⚡", creneaux: ["10h–12h", "15h–18h"], desc: "Tu t'adaptes bien. Profite des créneaux de mi-journée pour les tâches importantes." }
  };

  const niveauLabel = {
    college: "Collège", lycee: "Lycée", licence: "Licence", master: "Master", doctorat: "Doctorat"
  };

  const chargeOptimale = profile.chargeMax
    ? Math.round(profile.chargeMax * 0.75)
    : 45;

  const sessionsRecentes = sessions.slice(0, 10);
  const dureesMoyenne = sessionsRecentes.length
    ? Math.round(sessionsRecentes.reduce((a, s) => a + s.duration, 0) / sessionsRecentes.length)
    : 0;

  const difficulteRecommandee = dureesMoyenne > (profile.chargeMax || 60)
    ? "Réduis la durée de tes sessions — tu dépasses ta charge optimale."
    : dureesMoyenne < chargeOptimale * 0.5
    ? "Tu peux augmenter la durée de tes sessions progressivement."
    : "Ta durée de session est dans ta zone optimale. Continue !";

  return {
    chronoInfo: chronoLabel[profile.chronotype] || null,
    niveauLabel: niveauLabel[profile.niveau] || null,
    chargeOptimale,
    dureesMoyenne,
    difficulteRecommandee,
  };
}

const CHRONOTYPES = [
  { value: "matin",    label: "🌅 Lève-tôt",   desc: "Je suis au top le matin" },
  { value: "flexible", label: "⚡ Flexible",    desc: "Je m'adapte à la situation" },
  { value: "soir",     label: "🌙 Noctambule",  desc: "Je performe mieux le soir" },
];

const NIVEAUX = [
  { value: "college",  label: "Collège" },
  { value: "lycee",    label: "Lycée" },
  { value: "licence",  label: "Licence / BUT" },
  { value: "master",   label: "Master" },
  { value: "doctorat", label: "Doctorat" },
];

const OBJECTIFS = [
  { value: "notes",        label: "🎯 Améliorer mes notes" },
  { value: "organisation", label: "📅 Mieux m'organiser" },
  { value: "memoire",      label: "🧠 Mémoriser plus efficacement" },
  { value: "equilibre",    label: "⚖️ Éviter le burnout" },
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    chronotype: "", niveau: "", objectif: "", chargeMax: 60
  });

  useEffect(() => {
    Promise.all([
      api.get("/users/profile"),
      api.get("/sessions")
    ]).then(([profileRes, sessionsRes]) => {
      const p = profileRes.data;
      setProfile(p);
      setSessions(sessionsRes.data);
      setForm({
        chronotype: p.chronotype || "",
        niveau:     p.niveau     || "",
        objectif:   p.objectif   || "",
        chargeMax:  p.chargeMax  || 60,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/profile", form);
      setProfile(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const twin = profile ? computeCognitiveTwin(form, sessions) : null;
  const isComplete = form.chronotype && form.niveau && form.objectif;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-itmia-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Chargement du profil cognitif…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-sm text-itmia-blue font-medium mb-1">Jumeau Cognitif · Profil Personnel</p>
          <h1 className="text-2xl font-bold text-itmia-navy">Mon Profil ITMIA</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ces informations permettent à ITMIA de calibrer ton jumeau cognitif et d'optimiser chaque session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Formulaire profil ── */}
          <div className="flex flex-col gap-6">

            {/* Infos de base */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Identité</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-itmia-navy flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-itmia-navy text-lg">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  {form.niveau && (
                    <span className="text-xs px-2 py-0.5 bg-itmia-light text-itmia-blue rounded-full border border-itmia-blue/20 mt-1 inline-block">
                      {NIVEAUX.find(n => n.value === form.niveau)?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Chronotype */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Chronotype</p>
              <p className="text-xs text-gray-400 mb-4">À quel moment de la journée es-tu le plus efficace ?</p>
              <div className="flex flex-col gap-2">
                {CHRONOTYPES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setForm(f => ({ ...f, chronotype: c.value }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      form.chronotype === c.value
                        ? "border-itmia-blue bg-blue-50 text-itmia-navy"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{c.label.split(" ")[0]}</span>
                    <div>
                      <p className="text-sm font-medium text-itmia-navy">{c.label.split(" ").slice(1).join(" ")}</p>
                      <p className="text-xs text-gray-400">{c.desc}</p>
                    </div>
                    {form.chronotype === c.value && (
                      <span className="ml-auto text-itmia-blue text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Niveau scolaire */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Niveau scolaire</p>
              <p className="text-xs text-gray-400 mb-4">ITMIA adapte ses recommandations selon ton niveau.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {NIVEAUX.map(n => (
                  <button
                    key={n.value}
                    onClick={() => setForm(f => ({ ...f, niveau: n.value }))}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                      form.niveau === n.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objectif */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Objectif principal</p>
              <p className="text-xs text-gray-400 mb-4">Qu'est-ce que tu cherches à améliorer avec ITMIA ?</p>
              <div className="flex flex-col gap-2">
                {OBJECTIFS.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setForm(f => ({ ...f, objectif: o.value }))}
                    className={`p-3 rounded-xl border text-sm text-left font-medium transition-all ${
                      form.objectif === o.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Charge max */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Capacité de charge cognitive
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Durée maximale que tu peux étudier sans pause avant de te sentir saturé.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={15} max={180} step={15}
                  value={form.chargeMax}
                  onChange={e => setForm(f => ({ ...f, chargeMax: Number(e.target.value) }))}
                  className="flex-1 accent-itmia-blue"
                />
                <span className="text-lg font-bold text-itmia-navy w-16 text-right">
                  {form.chargeMax} min
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Charge optimale ITMIA : <strong className="text-itmia-blue">{Math.round(form.chargeMax * 0.75)} min</strong> (75 % de ta capacité max)
              </p>
            </div>

            {/* Bouton sauvegarder */}
            <button
              onClick={handleSave}
              disabled={saving || !isComplete}
              className={`w-full py-3 text-sm font-medium rounded-xl transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : isComplete
                  ? "bg-itmia-navy text-white hover:bg-itmia-blue"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saved ? "✓ Profil cognitif sauvegardé !" : saving ? "Sauvegarde…" : !isComplete ? "Complète ton profil pour sauvegarder" : "Sauvegarder mon profil cognitif →"}
            </button>
          </div>

          {/* ── Jumeau cognitif ── */}
          <div className="flex flex-col gap-6">

            {/* Jumeau header */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A2B4A', color: 'white' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs font-semibold uppercase tracking-widest mb-2">Jumeau Cognitif ITMIA</p>
              <h2 style={{ color: 'white' }} className="text-xl font-bold mb-1">{user?.name}</h2>
              {isComplete ? (
                <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">Profil calibré · Recommandations actives</p>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm">⚠️ Complète ton profil pour activer le jumeau cognitif</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {form.chronotype && <span className="text-xs px-2 py-1 bg-white/15 rounded-full">{CHRONOTYPES.find(c => c.value === form.chronotype)?.label}</span>}
                {form.niveau && <span className="text-xs px-2 py-1 bg-white/15 rounded-full">{NIVEAUX.find(n => n.value === form.niveau)?.label}</span>}
                {form.objectif && <span className="text-xs px-2 py-1 bg-white/15 rounded-full">{OBJECTIFS.find(o => o.value === form.objectif)?.label}</span>}
              </div>
            </div>

            {/* Créneaux optimaux */}
            {twin?.chronoInfo && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Créneaux d'étude optimaux
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{twin.chronoInfo.desc}</p>
                <div className="flex gap-3">
                  {twin.chronoInfo.creneaux.map(c => (
                    <div key={c} className="flex-1 bg-itmia-light rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-itmia-blue">{c}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Optimal</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charge cognitive */}
            {form.chargeMax && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Analyse de charge cognitive
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-itmia-navy">{form.chargeMax} min</p>
                    <p className="text-xs text-gray-400">Capacité maximale</p>
                  </div>
                  <div className="bg-itmia-light rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{Math.round(form.chargeMax * 0.75)} min</p>
                    <p className="text-xs text-gray-400">Zone optimale ITMIA</p>
                  </div>
                </div>
                {twin?.dureesMoyenne > 0 && (
                  <div className={`p-3 rounded-xl text-sm ${
                    twin.dureesMoyenne > form.chargeMax
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : twin.dureesMoyenne < twin.chargeOptimale * 0.5
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    {twin.difficulteRecommandee}
                  </div>
                )}
              </div>
            )}

            {/* Prédiction J+7 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Prédiction comportementale J+7
              </p>
              {sessions.length >= 2 ? (
                <div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-itmia-blue">
                      {sessions.length >= 5 ? "Élevée" : sessions.length >= 2 ? "Modérée" : "Faible"}
                    </span>
                    <span className="text-sm text-gray-400 mb-1">probabilité de succès</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Basé sur {sessions.length} sessions enregistrées. 
                    {sessions.length >= 5
                      ? " Ton rythme est excellent — continue sur cette lancée."
                      : " Augmente la fréquence de tes sessions pour améliorer la prédiction."}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">Minimum 2 sessions requises pour activer la prédiction.</p>
                  <p className="text-xs text-gray-300 mt-1">Tu as {sessions.length} session{sessions.length > 1 ? "s" : ""}.</p>
                </div>
              )}
            </div>

            {/* Ciblage niveau */}
            {form.niveau && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Recommandations par niveau
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-semibold text-itmia-navy">{NIVEAUX.find(n => n.value === form.niveau)?.label}</p>
                    <p className="text-xs text-gray-400">Profil ITMIA calibré pour ce niveau</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {({
                    college:  ["Sessions courtes (20–30 min) recommandées", "Révision espacée sur 3–5 concepts max", "Pause obligatoire toutes les 25 min"],
                    lycee:    ["Sessions de 30–45 min idéales", "Focus sur les matières à coefficient élevé", "Révision J-7 avant les examens"],
                    licence:  ["Sessions de 45–60 min recommandées", "Alternance lecture / exercices pratiques", "Groupes de révision espacée conseillés"],
                    master:   ["Sessions de 60–90 min pour la recherche", "Méthode Pomodoro adaptée (25+5 min)", "Suivi de charge cognitive critique"],
                    doctorat: ["Sessions longues possibles (90–120 min)", "Monitoring burnout renforcé par ITMIA", "Révision espacée sur la littérature"],
                  }[form.niveau] || []).map(r => (
                    <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-itmia-blue mt-0.5">→</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

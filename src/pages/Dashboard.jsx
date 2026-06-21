import { useEffect, useState } from "react";
import { getSessions, createSession, deleteSession } from "../services/sessionService";
import { useAuth } from "../context/AuthContext";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { format, subDays, parseISO, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

// ── Algorithme NCOP — Score Cognitif ─────────────────────────────────────────
function computeCognitiveScore(sessions) {
  if (!sessions.length) return 0;

  const now = new Date();
  const last7 = sessions.filter(s => differenceInDays(now, new Date(s.createdAt)) <= 7);
  const last30 = sessions.filter(s => differenceInDays(now, new Date(s.createdAt)) <= 30);

  // Fréquence (sur 7 jours) → max 40 pts
  const frequencyScore = Math.min((last7.length / 7) * 40, 40);

  // Durée moyenne → max 30 pts
  const avgDuration = last7.reduce((a, s) => a + (s.duration || 0), 0) / (last7.length || 1);
  const durationScore = Math.min((avgDuration / 60) * 30, 30);

  // Régularité (jours distincts sur 30j) → max 30 pts
  const distinctDays = new Set(last30.map(s => format(new Date(s.createdAt), "yyyy-MM-dd"))).size;
  const regularityScore = Math.min((distinctDays / 30) * 30, 30);

  return Math.round(frequencyScore + durationScore + regularityScore);
}

// ── Détection décrochage ──────────────────────────────────────────────────────
function detectDropout(sessions) {
  if (!sessions.length) return { risk: "none", message: null, daysSince: null };
  const sorted = [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const daysSince = differenceInDays(new Date(), new Date(sorted[0].createdAt));

  if (daysSince >= 5) return {
    risk: "high",
    message: `Aucune session depuis ${daysSince} jours — risque de décrochage détecté`,
    daysSince
  };
  if (daysSince >= 3) return {
    risk: "medium",
    message: `${daysSince} jours sans session — maintiens ton rythme`,
    daysSince
  };
  return { risk: "none", message: null, daysSince };
}

// ── Graphe : sessions des 14 derniers jours ───────────────────────────────────
function buildChartData(sessions) {
  return Array.from({ length: 14 }, (_, i) => {
    const day = subDays(new Date(), 13 - i);
    const label = format(day, "dd MMM", { locale: fr });
    const dayStr = format(day, "yyyy-MM-dd");
    const daySessions = sessions.filter(s =>
      format(new Date(s.createdAt), "yyyy-MM-dd") === dayStr
    );
    const totalMin = daySessions.reduce((a, s) => a + (s.duration || 0), 0);
    return { label, minutes: totalMin, sessions: daySessions.length };
  });
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  const label = score >= 70 ? "Excellent" : score >= 40 ? "En progression" : "À relancer";
  const r = 40, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E8F0FB" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="text-center -mt-16">
        <div className="text-2xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-gray-400 mt-0.5">/100</div>
      </div>
      <div className="mt-10 text-xs font-medium" style={{ color }}>{label}</div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const created = await createSession({
        title,
        duration: Number(duration),
        subject,
      });
      setSessions([created, ...sessions]);
      setTitle(""); setDuration(""); setSubject("");
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const score = computeCognitiveScore(sessions);
  const dropout = detectDropout(sessions);
  const chartData = buildChartData(sessions);
  const totalMinutes = sessions.reduce((a, s) => a + (s.duration || 0), 0);
  const avgDuration = sessions.length
    ? Math.round(totalMinutes / sessions.length)
    : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-itmia-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Chargement de ton profil cognitif…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-sm text-itmia-blue font-medium mb-1">Tableau de bord cognitif</p>
          <h1 className="text-2xl font-bold text-itmia-navy">
            Bonjour, {user?.name || user?.email} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Voici l'état de ton profil ITMIA aujourd'hui.
          </p>
        </div>

        {/* ── Alerte décrochage ── */}
        {dropout.risk !== "none" && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
            dropout.risk === "high"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-yellow-50 border-yellow-200 text-yellow-700"
          }`}>
            <span className="text-xl">{dropout.risk === "high" ? "🚨" : "⚠️"}</span>
            <div>
              <p className="font-semibold text-sm">
                {dropout.risk === "high" ? "Risque de décrochage détecté" : "Attention — rythme en baisse"}
              </p>
              <p className="text-sm opacity-80 mt-0.5">{dropout.message}</p>
            </div>
          </div>
        )}

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Sessions totales", value: sessions.length, icon: "📚" },
            { label: "Minutes d'étude", value: totalMinutes, icon: "⏱️" },
            { label: "Durée moyenne", value: `${avgDuration} min`, icon: "📊" },
            { label: "Sessions ce mois", value: sessions.filter(s =>
                differenceInDays(new Date(), new Date(s.createdAt)) <= 30
              ).length, icon: "🗓️" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className="text-2xl font-bold text-itmia-navy">{k.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* ── Score + Graphe ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          {/* Score cognitif */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Score Cognitif ITMIA
            </p>
            <ScoreRing score={score} />
            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
              Basé sur ta fréquence, durée et régularité des 7 derniers jours
            </p>
          </div>

          {/* Graphe évolution */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Activité — 14 derniers jours
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E6DB4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2E6DB4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                  formatter={(v) => [`${v} min`, "Étude"]}
                />
                <Area type="monotone" dataKey="minutes" stroke="#2E6DB4"
                  strokeWidth={2} fill="url(#grad)" dot={{ r: 3, fill: "#2E6DB4" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Formulaire + Liste ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Nouvelle session */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Nouvelle session
            </p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input
                placeholder="Titre de la session"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <input
                placeholder="Matière (ex: Maths, IA…)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <input
                type="number"
                placeholder="Durée en minutes"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                required
                min={1}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-50"
              >
                {adding ? "Enregistrement…" : "Démarrer la session →"}
              </button>
            </form>
          </div>

          {/* Historique sessions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Historique des sessions
            </p>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm text-gray-400">Aucune session pour le moment.</p>
                <p className="text-xs text-gray-300 mt-1">Lance ta première session pour activer ITMIA.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {sessions.map(s => (
                  <li key={s.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-itmia-light transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-itmia-navy">{s.title}</p>
                      <p className="text-xs text-gray-400">
                        {s.subject && `${s.subject} · `}{s.duration} min
                        {s.createdAt && ` · ${format(new Date(s.createdAt), "dd MMM", { locale: fr })}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

// ── Statistiques par matière ──────────────────────────────────────────────────
function buildSubjectStats(sessions) {
  const map = {};
  sessions.forEach(s => {
    const key = s.subject || "Autre";
    if (!map[key]) map[key] = { subject: key, total: 0, count: 0 };
    map[key].total += s.duration || 0;
    map[key].count += 1;
  });
  return Object.values(map).sort((a, b) => b.total - a.total);
}

// ── Badge matière ─────────────────────────────────────────────────────────────
const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];
function SubjectBadge({ subject, index = 0 }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORS[index % COLORS.length]}`}>
      {subject}
    </span>
  );
}

export default function SessionManager() {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [filter, setFilter]       = useState("all");
  const [title, setTitle]         = useState("");
  const [subject, setSubject]     = useState("");
  const [duration, setDuration]   = useState("");
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => {
    api.get("/sessions")
      .then(res => setSessions(res.data))
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post("/sessions", {
        title, subject, duration: Number(duration)
      });
      setSessions(prev => [res.data, ...prev]);
      setTitle(""); setSubject(""); setDuration("");
      setShowForm(false);
      toast.success("Session enregistrée ✓");
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Session supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // ── Filtres ──
  const now = new Date();
  const filtered = sessions.filter(s => {
    const days = differenceInDays(now, new Date(s.createdAt));
    if (filter === "7")  return days <= 7;
    if (filter === "30") return days <= 30;
    return true;
  });

  const subjectStats = buildSubjectStats(filtered);
  const totalMin     = filtered.reduce((a, s) => a + (s.duration || 0), 0);
  const avgDuration  = filtered.length ? Math.round(totalMin / filtered.length) : 0;
  const subjects     = [...new Set(sessions.map(s => s.subject).filter(Boolean))];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Chargement des sessions…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">Algorithme NCOP · Tracking comportemental</p>
            <h1 className="text-2xl font-bold" style={{ color: '#1A2B4A' }}>Mes Sessions d'Étude</h1>
            <p className="text-gray-500 text-sm mt-1">
              Chaque session alimente ton jumeau cognitif et affine les prédictions ITMIA.
            </p>
          </div>
          <button
            onClick={() => setShowForm(f => !f)}
            className="px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all"
            style={{ backgroundColor: '#1A2B4A' }}
          >
            {showForm ? "Annuler" : "+ Nouvelle session"}
          </button>
        </div>

        {/* ── Formulaire ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Nouvelle session
              </p>
              <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-3">
                <input
                  placeholder="Titre de la session"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
                <input
                  placeholder="Matière (ex: Maths, IA…)"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  list="subjects-list"
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
                <datalist id="subjects-list">
                  {subjects.map(s => <option key={s} value={s} />)}
                </datalist>
                <input
                  type="number"
                  placeholder="Durée en minutes"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  required min={1}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="md:col-span-3 py-2.5 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#1A2B4A' }}
                >
                  {adding ? "Enregistrement…" : "Démarrer la session →"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Sessions totales", value: sessions.length, icon: "📚" },
            { label: "Minutes d'étude", value: totalMin, icon: "⏱️" },
            { label: "Durée moyenne", value: `${avgDuration} min`, icon: "📊" },
            { label: "Matières", value: subjects.length || "—", icon: "📖" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#1A2B4A' }}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">

          {/* ── Graphe par matière ── */}
          {subjectStats.length > 0 && (
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Minutes par matière
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={subjectStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                    formatter={v => [`${v} min`, "Durée"]}
                  />
                  <Bar dataKey="total" fill="#2E6DB4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Top matières ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Répartition
            </p>
            {subjectStats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucune matière enregistrée</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {subjectStats.slice(0, 5).map((s, i) => (
                  <li key={s.subject} className="flex items-center justify-between">
                    <SubjectBadge subject={s.subject} index={i} />
                    <span className="text-sm font-medium text-gray-600">{s.total} min</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Filtres + Liste ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Historique ({filtered.length})
            </p>
            <div className="flex gap-2">
              {[
                { value: "7",   label: "7 jours" },
                { value: "30",  label: "30 jours" },
                { value: "all", label: "Tout" },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filter === f.value
                      ? "text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  style={filter === f.value ? { backgroundColor: '#1A2B4A' } : {}}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-gray-400">Aucune session sur cette période.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ backgroundColor: '#E8F0FB' }}>
                        📚
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1A2B4A' }}>{s.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {s.subject && <SubjectBadge subject={s.subject} index={subjects.indexOf(s.subject)} />}
                          <span className="text-xs text-gray-400">{s.duration} min</span>
                          {s.createdAt && (
                            <span className="text-xs text-gray-300">
                              · {format(new Date(s.createdAt), "dd MMM yyyy", { locale: fr })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xl"
                    >
                      ×
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

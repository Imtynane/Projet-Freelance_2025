import { useEffect, useState } from "react";
import { getSessions, createSession, deleteSession } from "../services/sessionService";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const created = await createSession({ title, duration: Number(duration) });
      setSessions([created, ...sessions]);
      setTitle("");
      setDuration("");
    } catch (e) {
      console.error("Erreur lors de l'ajout :", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("Erreur lors de la suppression :", e);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {user?.name} 👋
      </h1>

      <form onSubmit={handleAdd} className="mb-6">
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Durée (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button>Ajouter</button>
      </form>

      {sessions.length === 0 && (
        <p className="text-gray-500">Aucune session pour le moment.</p>
      )}

      <ul>
        {sessions.map((s) => (
          <li key={s.id}>
            {s.title} — {s.duration} min
            <button onClick={() => handleDelete(s.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

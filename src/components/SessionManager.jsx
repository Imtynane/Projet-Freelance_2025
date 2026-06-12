import { useState, useEffect } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: "", duration: "" });

  // Récupérer les sessions au chargement
  useEffect(() => {
    api.get("/sessions")
      .then(res => setSessions(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ajouter une session
  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newSession.title,
        duration: Number(newSession.duration),
      };

      const res = await api.post("/sessions", payload);
      setSessions([...sessions, res.data]);
      setNewSession({ title: "", duration: "" });
    } catch (err) {
      console.error("Erreur lors de l'ajout de la session :", err);
      toast.error("Échec de l'ajout de la session ❌");
    }
  };

  // Supprimer une session
  const handleDeleteSession = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de la session :", err);
      toast.error("Échec de la suppression de la session ❌");
    }
  };


  return (
    <motion.div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Test API : Gestion Sessions</h2>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddSession} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Titre de la session"
          value={newSession.title}
          onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="number"
          placeholder="Durée (minutes)"
          value={newSession.duration}
          onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          required
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          🎯 Ajouter Session
        </motion.button>
      </form>

      {/* Liste des sessions animées*/}
      <ul className="list-disc pl-6 text-gray-700">
        <AnimatePresence>
          {sessions.map((s) => (
          <motion.li 
            key={s.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-200 py-2"
          >
            <div>
              <span className="font-medium">{s.title}</span> — {s.duration} min
            </div>
            <motion.button
              onClick={() => handleDeleteSession(s.id)}
              whileHover={{ scale: 1.1 , color: "#e53e3e"  }}
              whileTap={{ scale: 0.9 }}
              className="text-red-500 text-lg font-bold"
              title="Supprimer"
            >
              🗑️
            </motion.button>
          </motion.li>
        ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

export default SessionManager;
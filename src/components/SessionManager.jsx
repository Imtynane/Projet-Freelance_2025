import { useState, useEffect } from "react";
import axios from "axios";

function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: "", duration: "", userId: "" });

  // Récupérer les sessions au chargement
  useEffect(() => {
    axios.get("http://localhost:3000/sessions")
      .then(res => setSessions(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ajouter une session
  const handleAddSession = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      title: newSession.title,
      duration: Number(newSession.duration), // ✅ conversion en nombre
      userId: Number(newSession.userId)      // ✅ conversion en nombre
    };

    const res = await axios.post("http://localhost:3000/sessions", payload);
    setSessions([...sessions, res.data]); 
    setNewSession({ title: "", duration: "", userId: "" }); // reset
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto mt-8">
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
        <input
          type="number"
          placeholder="ID utilisateur"
          value={newSession.userId}
          onChange={(e) => setNewSession({ ...newSession, userId: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          🎯 Ajouter Session
        </button>
      </form>

      {/* Liste des sessions */}
      <ul className="list-disc pl-6 text-gray-700">
        {sessions.map((s) => (
          <li key={s.id}>
            <span className="font-medium">{s.title}</span> — {s.duration} min  
            <span className="text-sm text-gray-500"> (User ID: {s.userId})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionManager;
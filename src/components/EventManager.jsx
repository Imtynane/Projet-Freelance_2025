import { useState, useEffect } from "react";
import axios from "axios";
import EventModal from "./EventModal";

function EventManager() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    professor: "",
    location: "",
    datetime: "",
    duration: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🔽 NOUVEAU : gestion modale de confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Erreur chargement événements :", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:3000/events/${editingId}`,
          newEvent
        );
        setEvents(events.map((ev) => (ev.id === editingId ? res.data : ev)));
        setEditingId(null);
      } else {
        const res = await axios.post("http://localhost:3000/events", newEvent);
        setEvents([...events, res.data]);
      }

      setNewEvent({
        title: "",
        professor: "",
        location: "",
        datetime: "",
        duration: "",
        notes: "",
      });
    } catch (err) {
      console.error("Erreur ajout/modification :", err);
    }
  };

  // 🔽 NOUVEAU : ouvrir la modale
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // 🔽 NOUVEAU : valider suppression
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/events/${deleteId}`);
      setEvents(events.filter((e) => e.id !== deleteId));
      setShowConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setNewEvent({
      title: event.title,
      professor: event.professor || "",
      location: event.location || "",
      datetime: new Date(event.datetime).toISOString().slice(0, 16),
      duration: event.duration,
      notes: event.notes || "",
    });
  };

  // 🔽 NOUVEAU : Charger les événements au montage
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto mt-8 relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📅 Gestion des Événements
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Titre"
          value={newEvent.title}
          onChange={(e) =>
            setNewEvent({ ...newEvent, title: e.target.value })
          }
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Professeur"
          value={newEvent.professor}
          onChange={(e) =>
            setNewEvent({ ...newEvent, professor: e.target.value })
          }
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Lieu"
          value={newEvent.location}
          onChange={(e) =>
            setNewEvent({ ...newEvent, location: e.target.value })
          }
          className="border rounded px-3 py-2"
        />
        <input
          type="datetime-local"
          value={newEvent.datetime}
          onChange={(e) =>
            setNewEvent({ ...newEvent, datetime: e.target.value })
          }
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Durée (min)"
          value={newEvent.duration}
          onChange={(e) =>
            setNewEvent({ ...newEvent, duration: e.target.value })
          }
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Notes"
          value={newEvent.notes}
          onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
        />
        <button
          type="submit"
          className={`col-span-2 ${
            editingId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded`}
        >
          {editingId ? "💾 Enregistrer les modifications" : "➕ Ajouter Événement"}
        </button>
      </form>

      <ul className="divide-y divide-gray-200">
        {events.map((e) => (
          <li key={e.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-gray-600">
                {e.professor && `${e.professor} — `}
                {e.location && `${e.location} — `}
                {new Date(e.datetime).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Durée : {e.duration} min — {e.notes || "Pas de note"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(e)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                ✏️
              </button>
              <button
                onClick={() => confirmDelete(e.id)}
                className="text-red-600 hover:text-red-800"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔽 NOUVEAU : Modale de confirmation */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-3">⚠️ Confirmation</h3>
            <p className="mb-4">
              Es-tu sûr(e) de vouloir supprimer cet événement ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          ➕ Ajouter un événement
        </button>
        <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-bold mb-3">Ajouter un nouvel événement</h3>
          {/* Le formulaire d'ajout peut être réutilisé ici */}
        </EventModal>
      </div>
    </div>
  );
}

export default EventManager;
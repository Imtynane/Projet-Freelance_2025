import React, { useState, useEffect, useRef } from "react";
import { FaStopwatch } from "react-icons/fa";
import { FaBook, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStickyNote, FaPlus, FaSave, FaTimes, FaTrash, FaEdit } from "react-icons/fa";


/**
 * Schedule.jsx (avec notifications locales)
 * Composant "Emploi du temps" : ajout / modification / suppression d'événements (cours)
 * - Stocke localement dans localStorage (clé: "studySchedule")
 *  - garde les events en localStorage (clé "studySchedule")
 * - notifications : vérification périodique toutes les 30s
 * - marque les événements déjà notifiés (clé: "studyScheduleNotified")
 * - notifications 10 min avant le début
 * - Format simple : title, professor, location, date, time, duration
 */

/* Utilité : garder tout compact et lisible. */

const NOTIFIED_KEY = "studyScheduleNotified";
const NOTIFY_ENABLED_KEY = "studyScheduleNotifyEnabled";

function loadNotifiedMap() {
    try{
        const raw = localStorage.getItem(NOTIFIED_KEY);
        if (!raw) return {};
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveNotifiedMap(map) {
    try{
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map));
    } catch {
        // ignore
    }
}

function Schedule() {
    // ---------- State ----------
   // events : tableau d'événements sauvegardés
    const [events, setEvents] = useState(() => {
        try{
            const saved = localStorage.getItem("studySchedule");
            return saved ? JSON.parse(saved) : [];
        } catch{
            return [];
        }
    });

    // formData : données du formulaire d'ajout/modification
    const [form, setForm] = useState({
        id: null, // null pour un nouvel événement, ou l'id de l'événement à modifier
        title: "",
        professor: "",
        location: "",
        date: "",
        time: "",
        duration: 60, // en minutes
        notes: "",
    });

    // isEditing : indicateur si on modifie un événement existant
    const [isEditing, setIsEditing] = useState(false);

    // error : message d'erreur de validation
    const [error, setError] = useState("");

    //Notifications
    const [notifyEnabled, setNotifyEnabled] = useState(() => {
        try {
            return localStorage.getItem(NOTIFY_ENABLED_KEY) === "true";
        } catch {
            return false;
        }
    });
    const [notificationPermission, setNotificationPermission] = useState(() => 
        typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
    );
    // minute avant le début pour notifier
    const [minutesBefore, setMinutesBefore] = useState(10);

    //intervalle de vérification
    const intervalRef = useRef(null);

    //garder la map des notifiés
    const notifiedRef = useRef(loadNotifiedMap());

    // ---------- Effets ----------
    // Sauvegarde dans localStorage à chaque changement d'events
    useEffect(() => {
        try{
            localStorage.setItem("studySchedule", JSON.stringify(events));
        } catch (e) {
            console.error("Erreur de sauvegarde dans localStorage", e);
        }
        
    }, [events]);

    //Mise à jour de la map des notifiés
    useEffect(() => {
        notifiedRef.current = loadNotifiedMap();
    }, []);

    //when notifyEnabled or permission changes
    useEffect(() => {
        //helper to stop
        function stopInterval() {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        
        //Only run if enabled and permission granted
        if (notifyEnabled && typeof window !== "undefined" && "Notification" in window && notificationPermission === "granted") {
            // immediate check once
            checkAndFireNotifications();
            // schedule periodic check every 30s
            intervalRef.current = setInterval(checkAndFireNotifications, 30_1000);
        } else {
            stopInterval();
        }

        //cleanup on unmount / re-run
        return () => stopInterval();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifyEnabled, notificationPermission, events, minutesBefore]);

    //Helpers for notifications
    function requestNotificationPermission() {
        if(typeof window === "undefined" || !("Notification" in window)) {
            alert("Les notifications ne sont pas supportées par ce navigateur.");
            return;
        }
        Notification.requestPermission().then((perm) => {
            setNotificationPermission(perm);
            if (perm !== "granted") {
                setNotifyEnabled(true);
                localStorage.setItem(NOTIFY_ENABLED_KEY, "true");
            } else {
                setNotifyEnabled(false);
                localStorage.setItem(NOTIFY_ENABLED_KEY, "false");
            }
        });
    }
    
    function showNotificationForEvent(ev) {
        //Build title/body
        const title = `Prochain cours : ${ev.title}`;
        const body = `${formatDateTime(ev.datetime)} • ${ev.location || "—"}`;
        const icon = "./favicon.ico"; //or any icon url
        //show Notification if permission granted
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try{
                new Notification(title, { body, icon });
            } catch (e) {
                console.warn("Impossible d'afficher la notification", e);
                //fallback in-page
                alert(`${title}\n${body}`);
            }
        }
    }

    function hasBeenNotified(ev) {
        const map = notifiedRef.current || {};
        return map[ev.id] && map[ev.id] === ev.datetime;        
    }

    function markAsNotified(ev) {
        const map = notifiedRef.current || {};
        map[ev.id] = ev.datetime;
        notifiedRef.current = map;
        saveNotifiedMap(map);
    }

    function checkAndFireNotifications() {
        const now = Date.now();
        const map = notifiedRef.current || {};
        // iterate events, trigger if notify time passed and not yet notified
        events.forEach((ev) => {
            if (!ev.datetime) return;
            const eventTime = new Date(ev.datetime).getTime();
            const notifyAt = eventTime - minutesBefore * 60 * 1000;
            // only consider future events
            if (notifyAt <= now && eventTime > now) {
                //compare to map: if map has ev.id with same datetime, skip
                if (!map[ev.id] || map[ev.id] !== ev.datetime) {
                    //trigger
                    showNotificationForEvent(ev);
                    //mark
                    markAsNotified(ev);
                }
            }
        });
    }

    // ---------- Handlers ----------
    // Mise à jour des données du formulaire
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Crée un objet Date à partir de date+time inputs
    function buildDateTime(date, time) {
        if (!date || !time) return null;
        const iso = `${date}T${time}`;
        const d = new Date(iso);
        // Vérifie que la date est valide
        return isNaN(d.getTime()) ? null : d;
    }

    // Soumission du formulaire (ajout/modification)
    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Validation simple
        if (!form.title.trim()) {
            setError("Le titre est requis.");
            return;
        }
        const dt = buildDateTime(form.date, form.time);
        if (!dt) {
            setError("Date et heure valides requises.");
            return;
        }

        if(isEditing && form.id){
            // Modification d'un événement existant
            setEvents((prev) =>
                prev
                    .map((ev) =>
                        ev.id === form.id
                            ? {
                                    ...ev,
                                    title: form.title.trim(),
                                    professor: form.professor.trim(),
                                    location: form.location.trim(),
                                    datetime: dt.toISOString(),
                                    duration: Number(form.duration) || 0,
                                    notes: form.notes.trim(),
                            }
                            : ev
                    )
                    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            );
            setIsEditing(false);
        } else {
            // Ajout d'un nouvel événement
            const id = (crypto && crypto.randomUUID && crypto.randomUUID()) || Date.now();
            const newEvent = {
                id,
                title: form.title.trim(),
                professor: form.professor.trim(),
                location: form.location.trim(),
                datetime: dt.toISOString(),
                duration: Number(form.duration) || 0,
                notes: form.notes.trim(),
                createdAt: new Date().toISOString(),
            };
            setEvents((prev) =>
                [...prev, newEvent].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            );
        }

        // Réinitialise le formulaire
        setForm({
            id: null,
            title: "",
            professor: "",
            location: "",
            date: "",
            time: "",
            duration: 60,
            notes: "",
        });
        setError("");
    }

    // Prépare le formulaire pour modifier un événement
    function handleEdit(id) {
        const ev = events.find((x) => x.id === id);
        if(!ev) return;
        const dt = new Date(ev.datetime);
        const isoDate = dt.toISOString().slice(0, 10);// YYYY-MM-DD
        const isoTime = dt.toISOString().slice(11, 16);// HH:MM

        setForm({
            id: ev.id,
            title: ev.title,
            professor: ev.professor || "",
            location: ev.location || "",
            date: isoDate,
            time: isoTime,
            duration: ev.duration || 60,
            notes: ev.notes || "",
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); //amène le formulaire en vue
    }

    // Supprime un événement
    function handleDelete(id) {
        if(window.confirm("Confirmer la suppression de cet événement ?")){
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
            //optionnel: retirer de la map des notifiés
            const map = notifiedRef.current || {};
            if (map[id]) {
                delete map[id];
                notifiedRef.current = map;
                saveNotifiedMap(map);
            }
        }
    }

    // Vide tous les événements
    function clearAll() {
        if(!events.length) return;
        if(window.confirm("Confirmer la suppression de tous les événements ?")){
            setEvents([]);
            //vider la map des notifiés
            notifiedRef.current = {};
            saveNotifiedMap({});
        }
    }

    // Formatte lisible pour l'affichage
    function formatDateTime(isoString) {
        const d = new Date(isoString);
        return d.toLocaleString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // ---------- Rendu ----------
    return (
        <section id="schedule" className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="max-w-5xl mx-auto px-6">
                {/* header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 shadow-sm p-4 rounded-md">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-600" /> Emploi du temps
                        </h2>
                        <p className="text-gray-600 mt-1">Ajoute, modifie et organise tes cours rapidement.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={notifyEnabled}
                                onChange={() => {
                                    //toggle, but request permission if enabling
                                    if(!notifyEnabled){
                                        if (typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted") {
                                            //request
                                            requestNotificationPermission();
                                        } else{
                                            setNotifyEnabled(true);
                                            localStorage.setItem(NOTIFY_ENABLED_KEY, "true");
                                        }
                                    } else {
                                        setNotifyEnabled(false);
                                        localStorage.setItem(NOTIFY_ENABLED_KEY, "false");
                                    }
                                }}
                            />
                            Activer notifications
                        </label>

                        <select 
                            value={minutesBefore}
                            onChange={(e) => setMinutesBefore(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            title="Notifier X minutes avant le début"
                        >
                            <option value={5}>5 min</option>
                            <option value={10}>10 min</option>
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                        >
                            <FaTrash /> Tout supprimer
                        </button>
                    </div>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-2xl shadow-lg space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaBook className="text-blue-500" /> Titre *
                            </span>
                            <input 
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ex: Mathématiques - Algèbre"
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaChalkboardTeacher className="text-green-500" /> Professeur
                            </span>
                            <input 
                                name="professor"
                                value={form.professor}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Ex: M. Dupont"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaCalendarAlt className="text-purple-500" /> Date *
                            </span>
                            <input 
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaClock className="text-orange-500" /> Heure *
                            </span>
                            <input 
                                name="time"
                                type="time"
                                value={form.time}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-pink-500" /> Lieu
                            </span>
                            <input 
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Salle 101 / En ligne" 
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaStopwatch className="text-indigo-500" /> Durée (minutes)
                            </span>
                            <input 
                                name="duration"
                                type="number"
                                min="0"
                                value={form.duration}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Ex: 90"
                            />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaStickyNote className="text-yellow-500" /> Notes
                            </span>
                            <input 
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Ex: Préparer le chapitre 3" 
                            />
                        </label>
                    </div>

                    {/* erreurs */}
                    {error && (
                        <div className="mt-2 text-sm text-red-600 font-medium">{error}</div>
                    )}

                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            {isEditing ? <><FaSave /> Enregistrer</> : <><FaPlus /> Ajouter</>}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ id: null, title: "", professor: "", location: "", date: "", time: "", duration: 60, notes: "" });
                                    setIsEditing(false);
                                    setError("");
                                }}
                                className="flex items-center gap-2 px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                <FaTimes /> Annuler
                            </button>
                        )}
                    </div>
                </form>

                {/* liste des événements */}
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <div className="text-center text-gray-500">
                            Aucun cours pour l'instant. Ajoute-en !
                        </div>
                    ) : (
                        <table className="w-full table-auto border-collapse rounded-lg shadow overflow-hidden">
                            <thead className="bg-blue-600 text-white">
                                <tr className="text-left text-sm">
                                    <th className="py-3 px-4">📅 Date & heure</th>
                                    <th className="py-3 px-4">📖 Titre</th>
                                    <th className="py-3 px-4">👨‍🏫 Professeur</th>
                                    <th className="py-3 px-4">🏫 Lieu</th>
                                    <th className="py-3 px-4">⏳ Durée</th>
                                    <th className="py-3 px-4 text-center">⚙️ Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events
                                    .slice()
                                    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                                    .map((ev, index) => (
                                        <tr
                                            key={ev.id}
                                            className={`${
                                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-blue-50 transition`}
                                        >
                                            <td className="py-2 px-4 align-top">{formatDateTime(ev.datetime)}</td>
                                            <td className="py-2 px-4 align-top font-medium">{ev.title}</td>
                                            <td className="py-2 px-4 align-top">{ev.professor}</td>
                                            <td className="py-2 px-4 align-top">{ev.location}</td>
                                            <td className="py-2 px-4 align-top">{ev.duration} min</td>
                                            <td className="py-2 px-4 align-top text-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(ev.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-yellow-400 text-white rounded shadow hover:bg-yellow-500 transition"
                                                >
                                                    ✏️ Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                                                >
                                                    🗑️ Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* bouton flottant */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-8 right-8 bg-blue-600 text-white text-2xl rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 flex items-center justify-center transition"
                aria-label="Ajouter un événement"
            >
                ➕
            </button>
        </section>
    );

}   


export default Schedule;
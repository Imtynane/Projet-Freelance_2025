// frontend/src/services/api.js
const API_URL = "http://localhost:3000";

// Récupérer tous les utilisateurs
export async function getUsers() {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
}

// Créer un nouvel utilisateur
export async function createUser(user) {
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return res.json();
}

//Récupérer toutes les sessions
export async function getSessions() {
    const res = await fetch(`${API_URL}/sessions`);
    return res.json();
}

// Créer une nouvelle session
export async function createSession(session) {
    const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
    });
    return res.json();
}
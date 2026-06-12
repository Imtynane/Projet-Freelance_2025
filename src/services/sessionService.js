import api from "./api";

// 📋 Récupérer toutes les sessions
export const getSessions = async () => {
  const res = await api.get("/sessions");
  return res.data;
};

// ➕ Créer une session
export const createSession = async (session) => {
  const res = await api.post("/sessions", session);
  return res.data;
};

// 🗑️ Supprimer une session
export const deleteSession = async (id) => {
  await api.delete(`/sessions/${id}`);
};


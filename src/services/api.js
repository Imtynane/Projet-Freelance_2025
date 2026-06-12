import axios from 'axios';
import { getToken } from './authService.js';

const api = axios.create({
    baseURL: "http://localhost:3000", // backend base URL
});

// Ajouter un intercepteur pour inclure le token d'authentification dans les requêtes
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getUsers = async () => {
    const res = await api.get("/users");
    return res.data;
};

export const createUser = async (user) => {
    const res = await api.post("/users", user);
    return res.data;
};

export default api;
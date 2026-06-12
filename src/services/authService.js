import axios from 'axios';

const API_URL = "http://localhost:3000/auth"; // backend auth route

// 🔹 Register
export const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    return res.data;
};

// 🔹 Login
export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    // Stockage du token dans le localStorage (ou autre méthode de stockage)
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
};

// 🔹 Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// 🔹 Récupérer le token
export const getToken = () => localStorage.getItem('token');

// 🔹 Récupérer l'utilisateur courant
export const getUser = () => JSON.parse(localStorage.getItem('user'));

export const saveAuth = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

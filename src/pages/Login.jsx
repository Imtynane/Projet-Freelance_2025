import { useState } from "react";
import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await loginService(email, password);
            login(data.user, data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Erreur de connexion. Vérifiez vos identifiants.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                    type="email"
                    placeholder="Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="border px-3 py-2 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Connexion
                </button>
            </form>
        </div>
    );  
}
import { useState } from "react";
import { register as registerService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await registerService(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-itmia-navy flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-itmia-navy">ITMIA</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Crée ton profil cognitif</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-itmia-navy mb-2">Inscription</h1>
          <p className="text-sm text-gray-400 mb-6">
            ITMIA initialise ton jumeau cognitif dès ta première session.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Prénom & Nom</label>
              <input
                type="text"
                placeholder="Ex: Imtynane ODJO"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Mot de passe</label>
              <input
                type="password"
                placeholder="Min. 6 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-itmia-blue transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-itmia-navy text-white text-sm font-medium rounded-lg hover:bg-itmia-blue transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Création du profil…" : "Créer mon profil cognitif →"}
            </button>
          </form>

          {/* Badges neurosciences */}
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            {["Ebbinghaus", "Csikszentmihalyi", "Sweller"].map(t => (
              <span key={t} className="text-xs px-2 py-1 bg-itmia-light text-itmia-blue rounded-full border border-itmia-blue/20">
                {t}
              </span>
            ))}
          </div>

          <p className="text-center text-xs text-gray-300 mt-3">
            Algorithme NCOP · Jumeau Cognitif · Détection Burnout
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-itmia-blue hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          ITMIA · Intelligence Cognitive Adaptative · ECPI 2024–2025
        </p>
      </div>
    </div>
  );
}

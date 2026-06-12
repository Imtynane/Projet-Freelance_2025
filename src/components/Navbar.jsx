import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({brandName = "StudyMate"}) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-50" aria-label="Navigation principale">
      <Link to="/"><h1 className="text-2xl font-bold text-blue-600">{brandName}</h1></Link>

      <ul className="flex gap-6 text-gray-700">
        <li><a href="#home" className="hover:text-blue-600">Home</a></li>
        <li><a href="#features" className="hover:text-blue-600">Features</a></li>
        <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
      </ul>

      <div className="flex items-center gap-4">
        {!isAuthenticated && (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-600">Accueil</Link>
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Connexion</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>  
  );
  
}

export default Navbar
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo ITMIA */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-itmia-navy flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-bold text-itmia-navy tracking-tight">ITMIA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-itmia-navy transition-colors">Accueil</Link>
            {user && (
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-itmia-navy transition-colors">Dashboard</Link>
            )}
            <a href="#fonctionnalites" className="text-sm text-gray-600 hover:text-itmia-navy transition-colors">Fonctionnalités</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500">Bonjour, <strong className="text-itmia-navy">{user.name || user.email}</strong></span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-itmia-blue hover:text-itmia-blue transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-itmia-navy border border-itmia-navy rounded-lg hover:bg-itmia-light transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm text-white bg-itmia-navy rounded-lg hover:bg-itmia-blue transition-all"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/" className="text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Accueil</Link>
            {user && <Link to="/dashboard" className="text-sm text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {user ? (
              <button onClick={handleLogout} className="text-sm text-left text-red-500 py-2">Déconnexion</button>
            ) : (
              <>
                <Link to="/login" className="text-sm text-itmia-navy py-2" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link to="/register" className="text-sm text-white bg-itmia-navy px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Commencer</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}


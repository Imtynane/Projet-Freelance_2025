import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex">

      {/* ── Sidebar ITMIA ── */}
      <aside className="w-64 bg-itmia-navy text-white flex flex-col shadow-xl">

        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="text-lg font-bold tracking-tight">ITMIA</span>
        </div>

        {/* User info */}
        {user && (
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Profil cognitif</p>
            <p className="text-sm font-medium text-white truncate">
              {user.name || user.email}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex flex-col px-3 py-4 gap-1 flex-1">
          {[
            { to: "/dashboard", label: "Dashboard", icon: "📊", end: true },
            { to: "/dashboard/sessions", label: "Sessions", icon: "🕒" },
            { to: "/dashboard/profile", label: "Profil", icon: "👤" },
            { to: "/dashboard/ebbinghaus", label: "Révisions", icon: "🔁" },
            { to: "/dashboard/atelier", label: "Atelier", icon: "🛠️" },
          ].map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all text-left flex items-center gap-2"
          >
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}


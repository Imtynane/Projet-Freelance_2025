import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <h2 className="text-xl font-bold p-4">StudyMate</h2>

        <nav className="flex flex-col p-4 space-y-2">
          <NavLink to="/dashboard" end>📊 Dashboard</NavLink>
          <NavLink to="/dashboard/sessions">🕒 Sessions</NavLink>
          <NavLink to="/dashboard/profile">👤 Profil</NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-auto mb-4 mx-4 px-4 py-2 bg-red-500 rounded"
        >
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

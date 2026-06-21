import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";        
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SessionManager from "./components/SessionManager";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import Ebbinghaus from "./pages/Ebbinghaus"; // ← import de la page Ebbinghaus
import Atelier from "./pages/Atelier"; // ← import de la page Atelier

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* 🌍 Pages publiques */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
                <Footer />
              </>
            }
          />

          <Route
            path="/login"
            element={<Login />}             // ← plus besoin de Navbar/Footer, Login a son propre layout
          />

          <Route
            path="/register"
            element={<Register />}          // ← sorti du dashboard, c'est une route publique
          />

          {/* 🔒 Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="sessions" element={<SessionManager />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ebbinghaus" element={<Ebbinghaus />} />
            <Route path="atelier" element={<Atelier />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
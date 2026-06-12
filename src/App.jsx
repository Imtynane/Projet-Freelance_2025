import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SessionManager from "./components/SessionManager";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";

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
                <Navbar brandName="StudyMate" />
                <LandingPage />
                <Footer />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar brandName="StudyMate" />
                <Login />
                <Footer />
              </>
            }
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
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
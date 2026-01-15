import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";

import Dashboard from "./components/pages/Dashboard";
import CreateTimetable from "./components/pages/CreateTimetable";
import Subject from "./components/pages/Subject";
import Profile from "./components/pages/Profile";
import Faculty from "./components/pages/Faculty";
import Classroom from "./components/pages/Classroom";
import StudentBatches from "./components/pages/StudentBatches";
import Reports from "./components/pages/Reports";
import Settings from "./components/pages/Settings";
import Suggestions from "./components/pages/Suggestions";
import Contact from "./components/pages/Contact";

import ProtectedRoute from "./components/pages/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🔹 Navbar always visible */}
      <Navbar />

      <div className="flex-grow p-4">
        <Routes>
          {/* 🔹 HOME / LANDING PAGE */}
          <Route path="/" element={<Home />} />

          {/* 🔹 AUTH ROUTES */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* 🔹 PASSWORD ROUTES */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 🔹 PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-timetable"
            element={
              <ProtectedRoute>
                <CreateTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject"
            element={
              <ProtectedRoute>
                <Subject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <Faculty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classrooms"
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studentBatches"
            element={
              <ProtectedRoute>
                <StudentBatches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <ProtectedRoute>
                <Suggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* 🔹 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* 🔹 Footer always visible */}
      <Footer />
    </div>
  );
}

export default App;

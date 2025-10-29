import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./index.css";
// Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// User UI Pages
import Home from "./userUI/pages/Home";
import NewsDetail from "./userUI/pages/NewsDetail";
import TopicNews from "./userUI/pages/TopicNews";

// Unified Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin UI Pages
import AdminDashboard from "./adminUI/pages/AdminDashboard";
import NewsManagement from "./adminUI/pages/NewsManagement";
import CreateNews from "./adminUI/pages/CreateNews";
import EditNews from "./adminUI/pages/EditNews";

function App() {
  const { user, admin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/topic/:topic" element={<TopicNews />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : admin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" />
            ) : admin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/news"
          element={
            <ProtectedRoute requireAdmin>
              <NewsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/news/create"
          element={
            <ProtectedRoute requireAdmin>
              <CreateNews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/news/edit/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EditNews />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NewsDetail from "../userUI/pages/NewsDetail";
import TopicNews from "../userUI/pages/TopicNews";
import AdminDashboard from "../adminUI/pages/AdminDashboard";
import CreateNews from "../adminUI/pages/CreateNews";
import EditNews from "../adminUI/pages/EditNews";
import NotFound from "../pages/NotFound";

// Protected Route Components
const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UserRoute = ({ children }) => {
  const { isUser, isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isUser()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/topic/:topic" element={<TopicNews />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/news/create"
          element={
            <AdminRoute>
              <CreateNews />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/news/edit/:id"
          element={
            <AdminRoute>
              <EditNews />
            </AdminRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

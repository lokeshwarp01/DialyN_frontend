import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute Component
 * Wrapper component that protects routes requiring authentication
 * Redirects to login if not authenticated
 * Supports both user and admin protection
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, admin, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  // Admin route protection
  if (requireAdmin) {
    if (!admin) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  // User route protection
  if (!user && !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

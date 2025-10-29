import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUser,
  getAdmin,
  getToken,
  saveUser,
  saveAdmin,
  saveToken,
  clearAuth,
} from "../utils/authHelper";

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/**
 * AuthProvider Component
 * Manages authentication state for both users and admins
 * Provides login, logout, and auth state to all child components
 */
export const AuthProvider = ({ children }) => {
  // State for current user (regular user)
  const [user, setUser] = useState(null);

  // State for current admin
  const [admin, setAdmin] = useState(null);

  // State for auth token
  const [token, setToken] = useState(null);

  // Loading state for initial auth check
  const [loading, setLoading] = useState(true);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();
      const storedAdmin = getAdmin();

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(storedUser);
      }

      if (storedAdmin) {
        setAdmin(storedAdmin);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user
   * @param {Object} userData - User object from API response
   * @param {string} authToken - JWT token from API
   */
  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setAdmin(null); // Clear admin if logging in as user

    saveUser(userData);
    saveToken(authToken);
  };

  /**
   * Login admin
   * @param {Object} adminData - Admin object from API response
   * @param {string} authToken - JWT token from API
   */
  const loginAdmin = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    setUser(null); // Clear user if logging in as admin

    saveAdmin(adminData);
    saveToken(authToken);
  };

  /**
   * Logout (works for both user and admin)
   */
  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    clearAuth();
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!(token && (user || admin));
  };

  /**
   * Check if current user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return !!(token && admin);
  };

  /**
   * Check if current user is regular user
   * @returns {boolean}
   */
  const isUser = () => {
    return !!(token && user);
  };

  // Context value to be provided to children
  const value = {
    user,
    admin,
    token,
    loading,
    loginUser,
    loginAdmin,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
  };

  // Don't render children until initial auth check is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

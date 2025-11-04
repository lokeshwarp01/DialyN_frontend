import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getUser, 
  getAdmin, 
  getToken, 
  saveUser, 
  saveAdmin, 
  saveToken, 
  clearAuth 
} from "../utils/authHelper";

// Import new profile API functions
import { 
  getUserProfile, 
  updateUserProfile, 
  updateUserPreferences, 
  subscribeToNewsletter, 
  unsubscribeFromNewsletter 
} from "../utils/api";

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
  
  // State for user profile data
  const [profile, setProfile] = useState(null);
  
  // State for user preferences
  const [preferences, setPreferences] = useState(null);
  
  // Loading state for initial auth check
  const [loading, setLoading] = useState(true);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();
      const storedAdmin = getAdmin();

      if (storedToken) {
        setToken(storedToken);
      }
      
      if (storedUser) {
        setUser(storedUser);
        // Try to fetch profile if user exists
        try {
          const profileData = await getUserProfile();
          setProfile(profileData.user.profile);
          setPreferences(profileData.user.preferences);
        } catch (error) {
          console.error('Failed to fetch profile on init:', error);
        }
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
  const loginUser = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setAdmin(null); // Clear admin if logging in as user
    saveUser(userData);
    saveToken(authToken);
    
    // Fetch full profile after successful login
    try {
      const profileData = await getUserProfile();
      setProfile(profileData.user.profile);
      setPreferences(profileData.user.preferences);
    } catch (error) {
      console.error('Failed to fetch profile after login:', error);
      // Set basic profile from user data if profile fetch fails
      setProfile({
        bio: '',
        avatar: null,
        location: '',
        website: ''
      });
      setPreferences({
        subscribeToNewsletter: false,
        emailNotifications: false,
        topics: []
      });
    }
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
    setProfile(null);
    setPreferences(null);
    saveAdmin(adminData);
    saveToken(authToken);
  };

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   */
  const updateProfile = async (profileData) => {
    try {
      const response = await updateUserProfile(profileData);
      // Update user object with new name if changed
      setUser(prevUser => ({ ...prevUser, name: response.user.name }));
      setProfile(response.user.profile);
      setPreferences(response.user.preferences);
      saveUser({ ...user, ...response.user });
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  /**
   * Update user preferences
   * @param {Object} preferencesData - Preferences update data
   */
  const updatePreferences = async (preferencesData) => {
    try {
      const response = await updateUserPreferences(preferencesData);
      setPreferences(response.user.preferences);
      return response;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  /**
   * Subscribe to newsletter
   */
  const subscribeNewsletter = async () => {
    try {
      const response = await subscribeToNewsletter();
      setPreferences(prev => ({ ...prev, subscribeToNewsletter: true }));
      return response;
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
      throw error;
    }
  };

  /**
   * Unsubscribe from newsletter
   */
  const unsubscribeNewsletter = async () => {
    try {
      const response = await unsubscribeFromNewsletter();
      setPreferences(prev => ({ ...prev, subscribeToNewsletter: false }));
      return response;
    } catch (error) {
      console.error('Failed to unsubscribe from newsletter:', error);
      throw error;
    }
  };

  /**
   * Logout (works for both user and admin)
   */
  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    setProfile(null);
    setPreferences(null);
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
    profile,
    preferences,
    loading,
    loginUser,
    loginAdmin,
    logout,
    updateProfile,
    updatePreferences,
    subscribeNewsletter,
    unsubscribeNewsletter,
    isAuthenticated,
    isAdmin,
    isUser,
  };

  // Don't render children until initial auth check is complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaNewspaper,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

/**
 * Navbar Component
 * Main navigation for both user and admin interfaces
 * Shows different options based on authentication state
 */
const Navbar = ({ isAdmin = false }) => {
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate(isAdmin ? "/login" : "/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Admin Navbar
  if (isAdmin) {
    return (
      <nav className="bg-gray-900 text-white shadow-2xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <FaNewspaper className="text-2xl text-purple-500" />
              <span className="text-xl font-bold">
                Daily<span className="text-purple-500">N</span> Admin
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/admin/dashboard"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/news"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Manage News
              </Link>

              {admin && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">
                    <FaUser className="inline mr-1" />
                    {admin.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-2xl text-gray-400 hover:text-purple-400"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-700">
              <Link
                to="/admin/dashboard"
                className="block text-gray-300 hover:text-purple-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/news"
                className="block text-gray-300 hover:text-purple-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Manage News
              </Link>
              {admin && (
                <>
                  <div className="text-gray-400 pt-2 border-t border-gray-700">
                    <FaUser className="inline mr-1" />
                    {admin.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }

  // User Navbar
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-2xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaNewspaper className="text-2xl text-purple-500" />
            <span className="text-xl font-bold text-white">
              Daily<span className="text-purple-500">N</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/topic/World"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              World
            </Link>
            <Link
              to="/topic/Technology"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Technology
            </Link>
            <Link
              to="/topic/Sports"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Sports
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  {user?.profile?.avatar?.url? (
                    <img 
                      src={user.profile.avatar.url} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-2xl text-gray-400 hover:text-purple-400"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-700">
            <Link
              to="/"
              className="block text-gray-300 hover:text-purple-400 transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/topic/World"
              className="block text-gray-300 hover:text-purple-400 transition-colors"
              onClick={closeMobileMenu}
            >
              World
            </Link>
            <Link
              to="/topic/Technology"
              className="block text-gray-300 hover:text-purple-400 transition-colors"
              onClick={closeMobileMenu}
            >
              Technology
            </Link>
            <Link
              to="/topic/Sports"
              className="block text-gray-300 hover:text-purple-400 transition-colors"
              onClick={closeMobileMenu}
            >
              Sports
            </Link>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 pt-2 border-t border-gray-700 text-gray-300 hover:text-purple-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  {user.profile?.avatar?.url ? (
                    <img 
                      src={user.profile.avatar.url} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-700">
                <Link
                  to="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white w-full py-2 rounded-lg transition-colors block text-center"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg transition-colors block text-center"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
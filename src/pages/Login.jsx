import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginAdmin } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FaEnvelope, FaLock, FaNewspaper } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser: authLoginUser, loginAdmin: authLoginAdmin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Try admin login first
      try {
        const adminResponse = await loginAdmin(formData);
        authLoginAdmin(adminResponse.admin, adminResponse.token);
        navigate("/admin/dashboard");
        return;
      } catch (adminErr) {
        console.log("Admin login failed, trying user login...");
        // If admin login fails, try user login
        try {
          const userResponse = await loginUser(formData);
          authLoginUser(userResponse.user, userResponse.token);
          navigate("/");
        } catch (userErr) {
          console.log("User login failed");
          // If both fail, show error
          throw new Error("Invalid email or password");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <FaNewspaper className="text-5xl text-purple-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Sign in to Daily<span className="text-purple-500">N</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Or{" "}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                create a new account
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {/* Login Form */}
          <form
            className="mt-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

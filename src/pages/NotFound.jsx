import React from "react";
import { Link } from "react-router-dom";
import { FaNewspaper, FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  let route = "/login"; // default

  if (localStorage.getItem("user")) {
    route = "/";
  } else if (localStorage.getItem("admin")) {
    route = "/admin/dashboard";
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <FaNewspaper className="text-4xl text-purple-500" />
            <span className="text-3xl font-bold text-gray-900">
              Daily<span className="text-purple-500">N</span>
            </span>
          </Link>
        </div>

        {/* 404 Illustration/Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <FaSearch className="text-6xl text-purple-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or you entered an incorrect URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={route}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to{" "}
            {route === "/"
              ? "Home"
              : route === "/admin/dashboard"
              ? "Admin Dashboard"
              : "Login"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="text-sm text-gray-600">
            If you believe this is an error, please{" "}
            <a
              href="/contact"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

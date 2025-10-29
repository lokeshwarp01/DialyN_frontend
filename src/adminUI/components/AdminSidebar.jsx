import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaNewspaper, FaPlus } from "react-icons/fa";

/**
 * AdminSidebar Component
 * Sidebar navigation for admin routes
 */
const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0 min-h-screen p-6 hidden md:flex flex-col">
      <h2 className="text-xl font-bold mb-10 text-purple-400">Admin Panel</h2>

      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 ${
              isActive ? "bg-purple-600 shadow-lg" : ""
            }`
          }
        >
          <FaTachometerAlt className="text-purple-400" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/news"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 ${
              isActive ? "bg-purple-600 shadow-lg" : ""
            }`
          }
        >
          <FaNewspaper className="text-purple-400" />
          <span>Manage News</span>
        </NavLink>

        <NavLink
          to="/admin/news/create"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 ${
              isActive ? "bg-purple-600 shadow-lg" : ""
            }`
          }
        >
          <FaPlus className="text-purple-400" />
          <span>Create News</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

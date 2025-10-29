import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

/**
 * SearchBar Component
 * Search news by title, content, or topic
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-96">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-24"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white px-2 transition-colors"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

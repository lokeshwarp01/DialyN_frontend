import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminNews, deleteNews } from "../../utils/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

/**
 * NewsManagement Page Component
 * Page for viewing, editing, and deleting all news articles (admin)
 */
const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminNews();
      // Sort news newest first
      const sortedNews = response.news.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNews(sortedNews);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?"))
      return;

    try {
      setDeletingId(id);
      await deleteNews(id);
      setNews((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError(err.response?.data?.message || "Failed to delete news");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar isAdmin />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Manage News
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Create, edit, and manage news articles
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/news/create")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FaPlus className="text-sm" />
                <span>Create New</span>
              </button>
            </div>

            {/* Stats Cards - Mobile First */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {news.length}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  Total Articles
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {news.filter((item) => item.topic === "Technology").length}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  Technology
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {news.filter((item) => item.topic === "Politics").length}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Politics</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {
                    news.filter(
                      (item) =>
                        new Date(item.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  Last 7 Days
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <ErrorMessage
                  message={error}
                  onDismiss={() => setError(null)}
                />
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingSpinner size="lg" message="Loading news..." />}

            {/* Empty State */}
            {!loading && news.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-gray-800 rounded-xl border border-gray-700">
                <div className="text-4xl sm:text-5xl mb-3">📰</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  No news articles found
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md mx-auto px-4">
                  Get started by creating your first news article.
                </p>
                <button
                  onClick={() => navigate("/admin/news/create")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors inline-flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Create First Article</span>
                </button>
              </div>
            )}

            {/* News List - Mobile Cards & Desktop Table */}
            {!loading && news.length > 0 && (
              <>
                {/* Mobile View - Cards */}
                <div className="block lg:hidden space-y-3 sm:space-y-4">
                  {news.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 flex-1 pr-2">
                          {item.title}
                        </h3>
                        <div className="flex space-x-2 flex-shrink-0">
                          <button
                            title="Edit news article"
                            onClick={() =>
                              navigate(`/admin/news/edit/${item._id}`)
                            }
                            className="text-purple-400 hover:text-purple-300 transition-colors duration-200 p-1"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            title="Delete news article"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                          >
                            {deletingId === item._id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <FaTag className="text-purple-400" size={10} />
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                            {item.topic}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <FaCalendarAlt size={10} />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Preview on larger mobile screens */}
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block bg-gray-800 rounded-xl shadow-2xl overflow-x-auto border border-gray-700">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Topic
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {news.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-750 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white max-w-md truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-lg">
                              {item.content.substring(0, 100)}...
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                              {item.topic}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <FaCalendarAlt size={12} />
                              <span>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              title="Edit news article"
                              onClick={() =>
                                navigate(`/admin/news/edit/${item._id}`)
                              }
                              className="text-purple-400 hover:text-purple-300 transition-colors duration-200 p-1"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              title="Delete news article"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                            >
                              {deletingId === item._id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaTrash size={16} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination/Summary */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-gray-400 text-sm">
                    Showing {news.length} of {news.length} articles
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">Sort by:</span>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-purple-500">
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Title A-Z</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsManagement;

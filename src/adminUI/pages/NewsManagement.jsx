import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminNews, deleteNews } from "../../utils/api";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Manage News</h1>
              <button
                onClick={() => navigate("/admin/news/create")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create New</span>
              </button>
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

            {/* News Table */}
            {!loading && news.length === 0 && (
              <p className="text-center text-gray-400 py-10">
                No news articles found.
              </p>
            )}

            {!loading && news.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-2xl overflow-x-auto border border-gray-700">
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
                  <tbody>
                    {news.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {item.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            title="Edit news article"
                            onClick={() =>
                              navigate(`/admin/news/edit/${item._id}`)
                            }
                            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            title="Delete news article"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            {deletingId === item._id ? "..." : <FaTrash />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsManagement;

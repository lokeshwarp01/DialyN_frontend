import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminNews } from "../../utils/api";
import Navbar from "../../components/common/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { FaNewspaper, FaPlus, FaEye, FaTags } from "react-icons/fa";

/**
 * AdminDashboard Page Component
 * Main admin dashboard with statistics and quick actions
 */
const AdminDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalNews: 0,
    topics: {},
    recentNews: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminNews();
      setNews(response.news);

      // Calculate statistics
      calculateStats(response.news);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (newsData) => {
    // Count topics
    const topicCount = {};
    newsData.forEach((item) => {
      topicCount[item.topic] = (topicCount[item.topic] || 0) + 1;
    });

    // Get 5 most recent news
    const sortedNews = [...newsData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const recentNews = sortedNews.slice(0, 5);

    setStats({
      totalNews: newsData.length,
      topics: topicCount,
      recentNews,
    });
  };

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar isAdmin />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome to the admin panel</p>
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

            {/* Loading State */}
            {loading && (
              <LoadingSpinner size="lg" message="Loading dashboard..." />
            )}

            {/* Dashboard Content */}
            {!loading && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Total News */}
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">
                          Total News
                        </p>
                        <p className="text-3xl font-bold mt-2 text-white">
                          {stats.totalNews}
                        </p>
                      </div>
                      <div className="bg-purple-600 rounded-full p-4 shadow-lg">
                        <FaNewspaper className="text-white text-2xl" />
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">
                          Topics
                        </p>
                        <p className="text-3xl font-bold mt-2 text-white">
                          {Object.keys(stats.topics).length}
                        </p>
                      </div>
                      <div className="bg-purple-500 rounded-full p-4 shadow-lg">
                        <FaTags className="text-white text-2xl" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Action */}
                  <Link
                    to="/admin/news/create"
                    className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-2xl p-6 text-white hover:shadow-xl transition-all duration-200 border border-purple-500"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm font-medium">
                          Quick Action
                        </p>
                        <p className="text-xl font-bold mt-2">Create News</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-full p-4 shadow-lg">
                        <FaPlus className="text-2xl" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent News */}
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">
                        Recent News
                      </h2>
                      <Link
                        to="/admin/news"
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
                      >
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {stats.recentNews.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                          No news articles yet
                        </p>
                      ) : (
                        stats.recentNews.map((item) => (
                          <Link
                            key={item._id}
                            to={`/admin/news/edit/${item._id}`}
                            className="block p-4 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600 hover:border-purple-500 hover:shadow-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-white line-clamp-1">
                                  {item.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                                    {item.topic}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatDate(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Topic Distribution */}
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-white">
                      Topic Distribution
                    </h2>

                    <div className="space-y-4">
                      {Object.keys(stats.topics).length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                          No topics yet
                        </p>
                      ) : (
                        Object.entries(stats.topics)
                          .sort((a, b) => b[1] - a[1])
                          .map(([topic, count]) => (
                            <div
                              key={topic}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <span className="font-medium text-white">
                                  {topic}
                                </span>
                                <div className="flex-1 bg-gray-700 rounded-full h-2 shadow-inner">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full shadow-lg"
                                    style={{
                                      width: `${
                                        (count / stats.totalNews) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-gray-300 font-medium ml-4">
                                {count}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/admin/news"
                    className="bg-gray-800 rounded-xl shadow-2xl p-4 hover:bg-gray-700 hover:shadow-xl transition-all duration-200 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="flex items-center space-x-3">
                      <FaEye className="text-purple-400 text-xl" />
                      <span className="font-medium text-white">
                        Manage All News
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/admin/news/create"
                    className="bg-gray-800 rounded-xl shadow-2xl p-4 hover:bg-gray-700 hover:shadow-xl transition-all duration-200 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="flex items-center space-x-3">
                      <FaPlus className="text-purple-400 text-xl" />
                      <span className="font-medium text-white">
                        Create New Article
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/"
                    className="bg-gray-800 rounded-xl shadow-2xl p-4 hover:bg-gray-700 hover:shadow-xl transition-all duration-200 border border-gray-700 hover:border-purple-500"
                  >
                    <div className="flex items-center space-x-3">
                      <FaNewspaper className="text-purple-400 text-xl" />
                      <span className="font-medium text-white">
                        View Public Site
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

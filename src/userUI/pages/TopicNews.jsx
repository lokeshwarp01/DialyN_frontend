import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsByTopic } from "../../utils/api";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import NewsCard from "../components/NewsCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { FaArrowLeft } from "react-icons/fa";

/**
 * TopicNews Page Component
 * Displays all news articles for a specific topic
 */
const TopicNews = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopicNews();
  }, [topic]);

  const fetchTopicNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNewsByTopic(topic);
      // Sort by most recent first
      const sortedNews = response.news.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNews(sortedNews);
    } catch (err) {
      console.error("Error fetching topic news:", err);
      setError(err.response?.data?.message || `Failed to load ${topic} news.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Topic Header */}
        <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-12 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {topic} News
            </h1>
            <p className="text-xl text-gray-400">
              Latest updates and articles about {topic.toLowerCase()}
            </p>
          </div>
        </section>

        {/* News Content */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <LoadingSpinner size="lg" message={`Loading ${topic} news...`} />
          )}

          {/* No Results */}
          {!loading && news.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No {topic} news available at the moment.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mt-4 transition-colors"
              >
                Browse all news
              </button>
            </div>
          )}

          {/* News Grid */}
          {!loading && news.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {news.length} {news.length === 1 ? "Article" : "Articles"}{" "}
                  Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => (
                  <NewsCard key={newsItem._id} news={newsItem} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TopicNews;

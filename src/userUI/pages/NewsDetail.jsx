import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById } from "../../utils/api";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { FaCalendar, FaTag, FaArrowLeft } from "react-icons/fa";

/**
 * NewsDetail Page Component
 * Displays full details of a single news article
 */
const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNewsById(id);
      setNews(response.news);
    } catch (err) {
      console.error("Error fetching news detail:", err);
      setError(err.response?.data?.message || "Failed to load news article.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to News</span>
          </button>

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} onDismiss={() => navigate("/")} />
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner size="lg" message="Loading article..." />}

          {/* News Article */}
          {!loading && news && (
            <article className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Featured Image */}
              {news.image?.url && (
                <div className="w-full h-96 overflow-hidden">
                  <img
                    src={news.image.url}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Topic Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <FaTag className="text-xs" />
                    <span>{news.topic}</span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {news.title}
                </h1>

                {/* Date */}
                <div className="flex items-center text-gray-400 text-sm mb-8">
                  <FaCalendar className="mr-2" />
                  <span>{formatDate(news.createdAt)}</span>
                  {news.updatedAt !== news.createdAt && (
                    <span className="ml-4">
                      (Updated: {formatDate(news.updatedAt)})
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                    {news.content}
                  </p>
                </div>

                {/* Related Topics */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    More from {news.topic}
                  </h3>
                  <button
                    onClick={() => navigate(`/topic/${news.topic}`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    View all {news.topic} articles
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;

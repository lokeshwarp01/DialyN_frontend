import React, { useState, useEffect } from "react";
import { getAllNews } from "../../utils/api";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import NewsCard from "../components/NewsCard";
import TopicFilter from "../components/TopicFilter";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

/**
 * Home Page Component
 * Main landing page showing all news with filtering and search capabilities
 */
const Home = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Filter news when topic or search query changes
  useEffect(() => {
    filterNews();
  }, [selectedTopic, searchQuery, news]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNews();
      // Sort by most recent first
      const sortedNews = response.news.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNews(sortedNews);
      setFilteredNews(sortedNews);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(
        err.response?.data?.message || "Failed to load news. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    // Filter by topic
    if (selectedTopic !== "All") {
      filtered = filtered.filter(
        (item) => item.topic.toLowerCase() === selectedTopic.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.topic.toLowerCase().includes(query)
      );
    }

    setFilteredNews(filtered);
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-16 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Daily<span className="text-purple-500">N</span>
            </h1>
            <p className="text-xl text-gray-400">
              Stay informed with the latest news from around the world
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <TopicFilter
                selectedTopic={selectedTopic}
                onTopicChange={handleTopicChange}
              />
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* News Grid Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <LoadingSpinner size="lg" message="Loading latest news..." />
          )}

          {/* No Results */}
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {searchQuery || selectedTopic !== "All"
                  ? "No news found matching your criteria."
                  : "No news available at the moment."}
              </p>
            </div>
          )}

          {/* News Grid */}
          {!loading && filteredNews.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedTopic === "All"
                    ? "Latest News"
                    : `${selectedTopic} News`}
                  <span className="text-gray-400 text-lg ml-2">
                    ({filteredNews.length}{" "}
                    {filteredNews.length === 1 ? "article" : "articles"})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((newsItem) => (
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

export default Home;

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
 * Modern Home Page Component
 * Enhanced landing page with modern design elements
 */
const Home = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredNews, setFeaturedNews] = useState(null);

  // Fetch all news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Filter news when topic or search query changes
  useEffect(() => {
    filterNews();
  }, [selectedTopic, searchQuery, news]);

  // Set featured news when news data loads
  useEffect(() => {
    if (news.length > 0) {
      setFeaturedNews(news[0]); // First news item as featured
    }
  }, [news]);

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
        {/* Modern Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-20 lg:py-28 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 mb-6 border border-gray-700">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Live Breaking News</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Daily<span className="text-white">N</span>
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your gateway to the world's most important stories.
              <span className="text-purple-400">
                {" "}
                Stay informed, stay ahead.
              </span>
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {news.length}+
                </div>
                <div className="text-gray-400 text-sm">Live Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Global</div>
                <div className="text-gray-400 text-sm">Coverage</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Section */}
        {featuredNews && !loading && (
          <section className="bg-gray-800 border-y border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">
                  Featured Story
                </h2>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {featuredNews.topic}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                      {featuredNews.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                      {featuredNews.content.substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>
                        {new Date(featuredNews.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-96 h-48 lg:h-64 bg-gradient-to-br from-purple-500/20 to-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">📰</div>
                      <div className="text-sm">Featured Image</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className="bg-gray-800/50 backdrop-blur-sm sticky top-16 z-40 py-6 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm font-medium">
                  Filter by:
                </span>
                <TopicFilter
                  selectedTopic={selectedTopic}
                  onTopicChange={handleTopicChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* News Grid Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* Error Message */}
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16">
              <LoadingSpinner size="lg" message="Loading latest news..." />
            </div>
          )}

          {/* No Results */}
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No news found
              </h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                {searchQuery || selectedTopic !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back later for the latest updates"}
              </p>
            </div>
          )}

          {/* News Grid */}
          {!loading && filteredNews.length > 0 && (
            <div className="space-y-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    {selectedTopic === "All"
                      ? "Latest News"
                      : `${selectedTopic} News`}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-medium">
                    {filteredNews.length}{" "}
                    {filteredNews.length === 1 ? "article" : "articles"}
                  </span>
                  <div className="h-6 w-px bg-gray-600"></div>
                  <span className="text-purple-400 text-sm font-medium">
                    Sorted by latest
                  </span>
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredNews.map((newsItem, index) => (
                  <NewsCard
                    key={newsItem._id}
                    news={newsItem}
                    featured={index === 0 && selectedTopic === "All"} // First card gets featured styling
                  />
                ))}
              </div>

              {/* Load More Button (Optional) */}
              {filteredNews.length >= 9 && (
                <div className="text-center pt-8">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-all duration-300 font-medium">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Newsletter CTA Section */}
        {!loading && (
          <section className="bg-gradient-to-r from-gray-800 to-gray-900 border-y border-gray-700">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Never Miss a Story
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Get the most important news delivered directly to your inbox.
                Join thousands of informed readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;

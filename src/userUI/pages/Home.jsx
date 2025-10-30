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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Close dropdown when clicking outside (for desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest(".filter-dropdown")) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

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
        <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-12 md:py-16 lg:py-20 xl:py-28 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1 md:px-4 md:py-2 mb-4 md:mb-6 border border-gray-700">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-xs md:text-sm text-gray-300">
                Live Breaking News
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-2">
                Daily<span className="text-white">N</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Your gateway to the world's most important stories.
              <span className="text-purple-400">
                {" "}
                Stay informed, stay ahead.
              </span>
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 flex-wrap">
              <div className="text-center px-2">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {news.length}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  Live Articles
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  24/7
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Updates</div>
              </div>
              <div className="text-center px-2">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  Global
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Coverage</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Section */}
        {featuredNews && !loading && (
          <section className="bg-gray-800 border-y border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-1 h-6 md:h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Featured Story
                </h2>
              </div>

              <div className="bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
                  <div className="flex-1 w-full">
                    <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                      {featuredNews.topic}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight group-hover:text-purple-400 transition-colors">
                      {featuredNews.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base lg:text-lg mb-4 md:mb-6 line-clamp-3">
                      {featuredNews.content.substring(
                        0,
                        window.innerWidth < 768 ? 120 : 200
                      )}
                      ...
                    </p>
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                      <span>
                        {new Date(featuredNews.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>5 min read</span>
                    </div>
                  </div>

                  {/* Image Section - Updated with actual image handling */}
                  <div className="w-full lg:w-80 xl:w-96 h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 mt-4 lg:mt-0">
                    {featuredNews.imageUrl ? (
                      // If image URL exists in the news data
                      <img
                        src={featuredNews.imageUrl}
                        alt={featuredNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback when no image or image fails to load */}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-purple-500/20 to-gray-800 flex items-center justify-center ${
                        featuredNews.imageUrl ? "hidden" : "flex"
                      }`}
                    >
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl mb-1 md:mb-2">
                          {featuredNews.topic === "Technology"
                            ? "💻"
                            : featuredNews.topic === "Sports"
                            ? "⚽"
                            : featuredNews.topic === "Politics"
                            ? "🏛️"
                            : featuredNews.topic === "Entertainment"
                            ? "🎬"
                            : featuredNews.topic === "Business"
                            ? "💼"
                            : featuredNews.topic === "Health"
                            ? "🏥"
                            : "📰"}
                        </div>
                        <div className="text-xs md:text-sm">
                          {featuredNews.imageUrl
                            ? "Image not available"
                            : "Featured Story"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="flex justify-end mt-4 md:mt-6">
                  <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm md:text-base group/btn">
                    <span>Read Full Story</span>
                    <svg
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Filter Section with Dropdown */}
        <section className="bg-gray-800/50 backdrop-blur-sm sticky top-16 z-40 py-4 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              {/* Main Controls Row */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="flex-1 min-w-0">
                  <SearchBar onSearch={handleSearch} />
                </div>

                {/* Dropdown Trigger Button */}
                <div className="relative filter-dropdown">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-all duration-200 min-w-[80px] justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="hidden xs:inline text-sm">Filters</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isFilterOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsFilterOpen(false)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700 md:hidden">
                          <h3 className="text-white font-semibold">Filters</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Filter Content */}
                        <div className="p-4 space-y-6">
                          {/* Topic Filter */}
                          <div className="space-y-3">
                            <label className="text-white font-medium text-sm flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                              Category
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                "All",
                                "Politics",
                                "Technology",
                                "Sports",
                                "Entertainment",
                                "Business",
                                "Health",
                              ].map((topic) => (
                                <button
                                  key={topic}
                                  onClick={() => {
                                    setSelectedTopic(topic);
                                    // Auto-close on mobile after selection
                                    if (window.innerWidth < 768) {
                                      setIsFilterOpen(false);
                                    }
                                  }}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedTopic === topic
                                      ? "bg-purple-600 text-white shadow-lg"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                                  }`}
                                >
                                  {topic}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sort Options */}
                          <div className="space-y-3">
                            <label className="text-white font-medium text-sm flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                                />
                              </svg>
                              Sort By
                            </label>
                            <div className="space-y-2">
                              {[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "popular", label: "Most Popular" },
                              ].map((sortOption) => (
                                <label
                                  key={sortOption.value}
                                  className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group"
                                >
                                  <input
                                    type="radio"
                                    name="sort"
                                    value={sortOption.value}
                                    checked={sortOption.value === "newest"}
                                    onChange={() => {}}
                                    className="text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-sm group-hover:text-white">
                                    {sortOption.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="space-y-3">
                            <label className="text-white font-medium text-sm">
                              Quick Actions
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTopic("All");
                                  setSearchQuery("");
                                  setIsFilterOpen(false);
                                }}
                                className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                              >
                                Clear All
                              </button>
                              <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Results Summary */}
                        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
                          <div className="text-center text-gray-400 text-sm">
                            Showing {filteredNews.length} of {news.length}{" "}
                            articles
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Active Filters Bar */}
              {(selectedTopic !== "All" || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-600/50">
                  <span className="text-gray-400 text-xs font-medium">
                    Active:
                  </span>

                  {selectedTopic !== "All" && (
                    <div className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                      <span>{selectedTopic}</span>
                      <button
                        onClick={() => setSelectedTopic("All")}
                        className="hover:text-white ml-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {searchQuery && (
                    <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                      <span>"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-white ml-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {(selectedTopic !== "All" || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedTopic("All");
                        setSearchQuery("");
                      }}
                      className="text-gray-400 hover:text-white text-xs ml-2 underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* News Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Error Message */}
          {error && (
            <div className="mb-6 md:mb-8">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12 md:py-16">
              <LoadingSpinner size="lg" message="Loading latest news..." />
            </div>
          )}

          {/* No Results */}
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4">
                🔍
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                No news found
              </h3>
              <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto px-4">
                {searchQuery || selectedTopic !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back later for the latest updates"}
              </p>
            </div>
          )}

          {/* News Grid */}
          {!loading && filteredNews.length > 0 && (
            <div className="space-y-6 md:space-y-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 md:h-8 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {selectedTopic === "All"
                      ? "Latest News"
                      : `${selectedTopic} News`}
                  </h2>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-gray-400 text-xs md:text-sm font-medium">
                    {filteredNews.length}{" "}
                    {filteredNews.length === 1 ? "article" : "articles"}
                  </span>
                  <div className="h-4 md:h-6 w-px bg-gray-600"></div>
                  <span className="text-purple-400 text-xs md:text-sm font-medium">
                    Sorted by latest
                  </span>
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {filteredNews.map((newsItem, index) => (
                  <NewsCard
                    key={newsItem._id}
                    news={newsItem}
                    featured={
                      index === 0 &&
                      selectedTopic === "All" &&
                      window.innerWidth >= 768
                    }
                  />
                ))}
              </div>

              {/* Load More Button (Optional) */}
              {filteredNews.length >= 6 && (
                <div className="text-center pt-6 md:pt-8">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-all duration-300 font-medium text-sm md:text-base">
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 md:mb-4">
                Never Miss a Story
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Get the most important news delivered directly to your inbox.
                Join thousands of informed readers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 md:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm md:text-base"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base">
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

import React from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaTag } from "react-icons/fa";

/**
 * NewsCard Component
 * Displays a news item in card format
 */
const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Truncate content to preview length
  const getPreview = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Link
      to={`/news/${news._id}`}
      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden group flex flex-col h-full hover:shadow-xl hover:border-purple-500 transition-all duration-300"
    >
      {/* Image */}
      {news.image?.url && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={news.image.url}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Topic Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            <FaTag className="text-xs" />
            <span>{news.topic}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {news.title}
        </h3>

        {/* Preview */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {getPreview(news.content)}
        </p>

        {/* Date */}
        <div className="flex items-center text-gray-500 text-xs mt-auto">
          <FaCalendar className="mr-2" />
          <span>{formatDate(news.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

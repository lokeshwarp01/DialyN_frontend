import React from "react";

/**
 * TopicFilter Component
 * Filter news by topic category
 */
const TopicFilter = ({ selectedTopic, onTopicChange }) => {
  const topics = [
    "All",
    "World",
    "Technology",
    "Sports",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Local",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onTopicChange(topic)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
            selectedTopic === topic
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicFilter;

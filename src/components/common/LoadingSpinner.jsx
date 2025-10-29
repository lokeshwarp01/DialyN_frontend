import React from "react";

/**
 * LoadingSpinner Component
 * Reusable loading indicator with customizable size and color
 */
const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
  message = "Loading...",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin border-4 border-gray-700 border-t-purple-500`}
      />
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );

  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80">
        {spinnerElement}
      </div>
    );
  }

  // Inline loading
  return (
    <div className="flex items-center justify-center py-8">
      {spinnerElement}
    </div>
  );
};

export default LoadingSpinner;

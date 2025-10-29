import React from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

/**
 * ErrorMessage Component
 * Displays error messages with optional dismiss functionality
 */
const ErrorMessage = ({ message, onDismiss, type = "error" }) => {
  if (!message) return null;

  // Type-based styling
  const typeStyles = {
    error: "bg-red-900 border-red-500 text-red-200",
    warning: "bg-yellow-900 border-yellow-500 text-yellow-200",
    info: "bg-purple-900 border-purple-500 text-purple-200",
  };

  return (
    <div
      className={`${typeStyles[type]} border-l-4 p-4 rounded-r-lg shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <FaExclamationCircle className="text-xl mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {type === "error" && "Error"}
              {type === "warning" && "Warning"}
              {type === "info" && "Information"}
            </p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-current hover:opacity-70 transition-opacity ml-4"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

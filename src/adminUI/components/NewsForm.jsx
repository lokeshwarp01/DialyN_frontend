import React, { useState, useEffect } from "react";
import { createNews, updateNews } from "../../utils/api";
import { fileToBase64, validateImage } from "../../utils/imageHelper";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const initialFormState = {
  title: "",
  content: "",
  topic: "",
  imageFile: null,
  imageBase64: "",
  imageUrl: "",
};

/**
 * NewsForm Component
 * Form for both creating and editing news articles
 */
const NewsForm = ({ news, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        content: news.content || "",
        topic: news.topic || "",
        imageFile: null,
        imageBase64: news.image?.public_id ? "" : news.image?.url || "",
        imageUrl: news.image?.public_id ? "" : news.image?.url || "",
      });
      setPreviewUrl(news.image?.url || "");
    }
  }, [news]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);

    try {
      setLoading(true);
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageBase64: base64,
        imageUrl: "",
      }));
      setPreviewUrl(base64);
    } catch (err) {
      setError("Failed to process selected image");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imageBase64: "",
      imageUrl: "",
    }));
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.topic.trim()
    ) {
      setError("Title, content, and topic are required");
      return;
    }

    let payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      topic: formData.topic.trim(),
    };

    if (formData.imageBase64) {
      payload.image = formData.imageBase64;
    } else if (formData.imageUrl) {
      payload.imageUrl = formData.imageUrl.trim();
    }

    try {
      setLoading(true);
      let response = null;
      if (news && news._id) {
        response = await updateNews(news._id, payload);
      } else {
        response = await createNews(payload);
      }
      if (response) {
        if (onSuccess) onSuccess(response.news);
      }
    } catch (err) {
      console.error("Error submitting news:", err);
      setError(err.response?.data?.message || "Failed to submit news article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700"
      noValidate
    >
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter news title"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
          value={formData.content}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter full news content"
        />
      </div>

      <div>
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Topic <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="topic"
          name="topic"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
          value={formData.topic}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="e.g. World, Technology, Sports"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Image (optional)
        </label>
        {previewUrl && (
          <div className="mb-4 relative max-w-xs">
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg border-2 border-gray-700 max-h-48 object-cover shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-lg"
              title="Remove image"
            >
              &times;
            </button>
          </div>
        )}
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
        />
        <p className="text-xs text-gray-400 mt-2">
          Upload image as file. Supported formats: JPEG, PNG, GIF. Max size:
          5MB.
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : news ? (
            "Update News"
          ) : (
            "Create News"
          )}
        </button>
      </div>
    </form>
  );
};

export default NewsForm;

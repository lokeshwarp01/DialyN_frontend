import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../../components/common/Navbar";
import NewsForm from "../components/NewsForm";
import { getAdminNews } from "../../utils/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

/**
 * EditNews Page Component
 * Form for editing existing news article
 */
const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSingleNews();
  }, [id]);

  // Fetch one news article by filtering admin news list (API lacks single admin news fetch)
  const fetchSingleNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminNews();
      const found = response.news.find((item) => item._id === id);
      if (!found) throw new Error("News article not found");
      setNews(found);
    } catch (err) {
      setError(err.message || "Failed to load news article");
    } finally {
      setLoading(false);
    }
  };

  const handleNewsUpdate = () => {
    navigate("/admin/news");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Navbar isAdmin />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading news article..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Navbar isAdmin />
        <main className="flex-grow flex items-center justify-center">
          <ErrorMessage
            message={error}
            onDismiss={() => navigate("/admin/news")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar isAdmin />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Edit News Article
          </h1>
          <NewsForm news={news} onSuccess={handleNewsUpdate} />
        </main>
      </div>
    </div>
  );
};

export default EditNews;

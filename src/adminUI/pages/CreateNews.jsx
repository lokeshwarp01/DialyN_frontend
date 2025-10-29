import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../../components/common/Navbar";
import NewsForm from "../components/NewsForm";

/**
 * CreateNews Page Component
 * Form for creating new news article
 */
const CreateNews = () => {
  const navigate = useNavigate();

  const handleNewsSubmit = (createdNews) => {
    // Redirect to news management
    navigate("/admin/news");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar isAdmin />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Create News Article
          </h1>
          <NewsForm onSuccess={handleNewsSubmit} />
        </main>
      </div>
    </div>
  );
};

export default CreateNews;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const {
    user,
    profile,
    preferences,
    updateProfile,
    updatePreferences,
    subscribeNewsletter,
    unsubscribeNewsletter,
    logout,
  } = useAuth();

  // 🔹 Edit modes
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [preferencesEditMode, setPreferencesEditMode] = useState(false);

  // 🔹 Form data
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    subscribeToNewsletter: false,
    emailNotifications: false,
    topics: [],
  });
  const [topicsInput, setTopicsInput] = useState("");

  // 🔹 Avatar & subscription state
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 🔹 Feedback and loading
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Initialize form data when profile or preferences change
  useEffect(() => {
    if (user && profile && preferences) {
      setFormData({
        name: user.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        subscribeToNewsletter: preferences.subscribeToNewsletter || false,
        emailNotifications: preferences.emailNotifications || false,
        topics: preferences.topics || [],
      });
      setTopicsInput((preferences.topics || []).join(", "));
      setIsSubscribed(preferences.subscribeToNewsletter || false);
    }
  }, [user, profile, preferences]);

  // 🔹 Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "topics") {
      setTopicsInput(value);
      const newTopics = value
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, topics: newTopics }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // 🔹 Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAvatarFile(null);
        setMessage("Please select a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAvatarFile(null);
        setMessage("Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(reader.result);
        setMessage(
          "Avatar selected. It will be uploaded when you save changes."
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Save profile and preferences
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const profileUpdate = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      };
      if (avatarFile) profileUpdate.avatar = avatarFile;

      const preferencesUpdate = {
        subscribeToNewsletter: formData.subscribeToNewsletter,
        emailNotifications: formData.emailNotifications,
        topics: formData.topics,
      };

      await updateProfile(profileUpdate);
      await updatePreferences(preferencesUpdate);

      setMessage("Profile updated successfully!");
      setProfileEditMode(false);
      setPreferencesEditMode(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage(
        `Error updating profile: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
      if (!message.toLowerCase().includes("error")) {
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  // 🔹 Newsletter subscription toggle
  const handleSubscriptionToggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (isSubscribed) {
        await unsubscribeNewsletter();
        setIsSubscribed(false);
        setMessage("Successfully unsubscribed from the newsletter.");
      } else {
        await subscribeNewsletter();
        setIsSubscribed(true);
        setMessage("Successfully subscribed to the newsletter.");
      }
    } catch (error) {
      console.error("Subscription toggle error:", error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      if (!message.toLowerCase().includes("error")) {
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  // 🔹 Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800 shadow-2xl border-b border-gray-700 p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-300 mt-1">
              Manage your account and preferences
            </p>
          </div>
          <Link
            to="/"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* PROFILE SECTION */}
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Profile Information
              </h2>
              <button
                onClick={() => setProfileEditMode(!profileEditMode)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  profileEditMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                } disabled:opacity-50`}
              >
                {profileEditMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {profileEditMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        avatarFile ||
                        profile?.avatar?.url ||
                        "https://via.placeholder.com/100x100/4B5563/FFFFFF?text=No+Image"
                      }
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-600/30"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.bio.length}/500
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    placeholder="City, Country"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileEditMode(false);
                      setAvatarFile(null);
                      setMessage("");
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      profile?.avatar?.url ||
                      "https://via.placeholder.com/80x80/4B5563/FFFFFF?text=No+Image"
                    }
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Profile Picture</p>
                    {profile?.avatar ? (
                      <button
                        onClick={() => setProfileEditMode(true)}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Change Photo
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No avatar set
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-lg text-white font-semibold">
                    {user.name}
                  </p>
                  {profile?.bio && (
                    <p className="text-gray-300">{profile.bio}</p>
                  )}
                  {profile?.location && (
                    <p className="text-gray-400 text-sm">
                      📍 {profile.location}
                    </p>
                  )}
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      🌐 {profile.website}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* PREFERENCES SECTION */}
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Preferences</h2>
              <button
                onClick={() => setPreferencesEditMode(!preferencesEditMode)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  preferencesEditMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                } disabled:opacity-50`}
              >
                {preferencesEditMode ? "Cancel" : "Edit"}
              </button>
            </div>

            {!preferencesEditMode ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div>
                    <h3 className="font-medium text-white">Newsletter</h3>
                    <p className="text-sm text-gray-400">
                      {isSubscribed
                        ? "Subscribed to weekly newsletter"
                        : "Not subscribed"}
                    </p>
                  </div>
                  <button
                    onClick={handleSubscriptionToggle}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isSubscribed
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {loading
                      ? "Updating..."
                      : isSubscribed
                      ? "Unsubscribe"
                      : "Subscribe"}
                  </button>
                </div>

                <div className="border-b border-gray-700 pb-3">
                  <h3 className="font-medium text-white mb-1">
                    Email Notifications
                  </h3>
                  <p
                    className={`text-sm ${
                      preferences?.emailNotifications
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {preferences?.emailNotifications ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-1">
                    Preferred Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(preferences?.topics || []).length > 0 ? (
                      preferences.topics.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">
                        No topics selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="subscribeToNewsletter"
                    checked={formData.subscribeToNewsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <span className="text-white text-sm">
                    Subscribe to Newsletter
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <span className="text-white text-sm">
                    Email Notifications
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="topics"
                    value={topicsInput}
                    onChange={handleInputChange}
                    placeholder="technology, sports, politics"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Email:{" "}
              <span className="font-medium text-white">{user.email}</span>
            </p>
            <p className="text-xs text-gray-500">
              Joined on{" "}
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm font-medium text-center ${
              message.toLowerCase().includes("error")
                ? "bg-red-900/50 text-red-300 border border-red-700/50"
                : "bg-green-900/50 text-green-300 border border-green-700/50"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

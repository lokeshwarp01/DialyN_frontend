import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';


const Profile = () => {
  const { user, profile, preferences, updateProfile, updatePreferences, subscribeNewsletter, unsubscribeNewsletter, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    subscribeToNewsletter: false,
    emailNotifications: false,
    topics: []
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [topicsInput, setTopicsInput] = useState('');


  // Initialize form data when profile data changes
  useEffect(() => {
    if (user && profile && preferences) {
      setFormData({
        name: user.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        subscribeToNewsletter: preferences.subscribeToNewsletter || false,
        emailNotifications: preferences.emailNotifications || false,
        topics: preferences.topics || []
      });
      setTopicsInput((preferences.topics || []).join(', '));
    }
  }, [user, profile, preferences]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'topics') {
      setTopicsInput(value);
      const newTopics = value.split(',').map(t => t.trim()).filter(t => t);
      setFormData(prev => ({ ...prev, topics: newTopics }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Image size must be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(reader.result); // base64
        setMessage('Avatar selected. It will be uploaded when you save changes.');
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {
      // Prepare profile update data
      const profileUpdate = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      };
      
      // Add avatar if selected
      if (avatarFile) {
        profileUpdate.avatar = avatarFile;
      }
      
      // Prepare preferences update data
      const preferencesUpdate = {
        subscribeToNewsletter: formData.subscribeToNewsletter,
        emailNotifications: formData.emailNotifications,
        topics: formData.topics
      };


      // Update profile
      await updateProfile(profileUpdate);
      
      // Update preferences
      await updatePreferences(preferencesUpdate);
      
      setMessage('Profile updated successfully!');
      setEditMode(false);
      setAvatarFile(null); // Clear avatar file after successful upload
      
      // Show success message briefly then clear
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(`Error updating profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleNewsletterToggle = async () => {
    try {
      if (formData.subscribeToNewsletter) {
        await subscribeNewsletter();
      } else {
        await unsubscribeNewsletter();
      }
      setMessage(formData.subscribeToNewsletter ? 'Subscribed to newsletter!' : 'Unsubscribed from newsletter!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Newsletter toggle error:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };


  // Show loading or redirect if no user
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
        <div className="bg-gray-800 shadow-2xl border-b border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-gray-300 mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>


        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  editMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } disabled:opacity-50`}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>


            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={avatarFile || profile?.avatar?.url || 'https://via.placeholder.com/100x100/4B5563/FFFFFF?text=No+Image'}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                      />
                      {avatarFile && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-gray-800">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-600/30"
                      />
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    placeholder="Enter your full name"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none shadow-sm"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.bio.length}/500 characters
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    placeholder="https://yourwebsite.com"
                  />
                </div>


                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setAvatarFile(null);
                      setMessage('');
                    }}
                    disabled={loading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Avatar Display */}
                <div className="flex items-center space-x-4">
                  <img
                    src={profile?.avatar?.url || 'https://via.placeholder.com/80x80/4B5563/FFFFFF?text=No+Image'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Profile Picture</p>
                    {profile?.avatar ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        Change Photo
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">No avatar set</span>
                    )}
                  </div>
                </div>


                {/* Profile Details */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Name</label>
                    <p className="text-lg font-semibold text-white">{user.name}</p>
                  </div>
                  
                  {profile?.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Bio</label>
                      <p className="text-gray-300">{profile.bio}</p>
                    </div>
                  )}
                  
                  {profile?.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Location</label>
                      <p className="text-gray-300">{profile.location}</p>
                    </div>
                  )}
                  
                  {profile?.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Website</label>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* Preferences Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
            
            {!editMode && (
              <div className="space-y-4">
                {/* Newsletter */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Newsletter</h3>
                      <p className="text-sm text-gray-400">
                        Receive weekly updates and news highlights
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        preferences?.subscribeToNewsletter 
                          ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-900/20 text-red-400 border border-red-500/30'
                      }`}>
                        {preferences?.subscribeToNewsletter ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>


                {/* Email Notifications */}
                {preferences?.emailNotifications !== undefined && (
                  <div className="border-b border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-400">
                          Get notified about new content and updates
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          preferences.emailNotifications 
                            ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-900/20 text-red-400 border border-red-500/30'
                        }`}>
                          {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {/* Topics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-white">Preferred Topics</h3>
                      <p className="text-sm text-gray-400">
                        Get personalized content recommendations
                      </p>
                    </div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(preferences?.topics || []).length > 0 ? (
                      preferences.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                        >
                          {topic}
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
            )}


            {editMode && (
              <div className="space-y-4">
                {/* Newsletter Toggle */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="subscribeToNewsletter"
                      checked={formData.subscribeToNewsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded"
                    />
                    <div>
                      <h3 className="font-medium text-white">Subscribe to Newsletter</h3>
                      <p className="text-sm text-gray-400">Receive weekly news updates</p>
                    </div>
                  </label>
                </div>


                {/* Email Notifications */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded"
                    />
                    <div>
                      <h3 className="font-medium text-white">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Get notified about new content</p>
                    </div>
                  </label>
                </div>


                {/* Topics */}
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
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Add topics you're interested in for personalized recommendations
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Danger Zone */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Email: <span className="font-medium text-white">{user.email}</span>
              </p>
              <p className="text-xs text-gray-500">
                Joined on {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>


        {/* Messages */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl ${
            message.includes('Error') || message.includes('Failed')
              ? 'bg-red-900/20 border border-red-500/30 text-red-300'
              : 'bg-green-900/20 border border-green-500/30 text-green-300'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};


export default Profile;

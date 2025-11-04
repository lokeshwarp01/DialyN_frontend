import axios from 'axios'

// Base API URL from environment variable or default to localhost
const API_BASE_URL =  import.meta.env.VITE_RENDER_API_BASE_URL || 'http://localhost:3000';
//import.meta.env.VITE_RENDER_API_BASE_URL ||

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============ AUTH API ===========

/**
 * Register a new admin (should only be done once)
 * @param {Object} data - { name, email, password }
 */
export const registerAdmin = async (data) => {
  const response = await api.post('/api/auth/admin/register', data)
  return response.data
}

/**
 * Login admin
 * @param {Object} credentials - { email, password }
 */
export const loginAdmin = async (credentials) => {
  const response = await api.post('/api/auth/admin/login', credentials)
  return response.data
}

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 */
export const registerUser = async (data) => {
  const response = await api.post('/api/auth/user/register', data)
  return response.data
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/user/login', credentials)
  return response.data
}

// ============ PUBLIC USER API ===========

/**
 * Get all news (public)
 */
export const getAllNews = async () => {
  const response = await api.get('/api/user/news')
  return response.data
}

/**
 * Get news by topic (public)
 * @param {string} topic - Topic name
 */
export const getNewsByTopic = async (topic) => {
  const response = await api.get(`/api/user/news/topic/${encodeURIComponent(topic)}`)
  return response.data
}

/**
 * Get single news by ID (public)
 * @param {string} id - News ID
 */
export const getNewsById = async (id) => {
  const response = await api.get(`/api/user/news/${id}`)
  return response.data
}

// ============ ADMIN API ===========

/**
 * Get all news (admin view)
 * Requires admin authentication
 */
export const getAdminNews = async () => {
  const response = await api.get('/api/admin/news')
  return response.data
}

/**
 * Create new news (admin only)
 * @param {Object} newsData - { title, content, topic, image (base64/dataURL), imageUrl }
 * Note: Either image (base64) or imageUrl can be provided, not both
 */
export const createNews = async (newsData) => {
  const response = await api.post('/api/admin/news', newsData)
  return response.data
}

/**
 * Update existing news (admin only)
 * @param {string} id - News ID
 * @param {Object} newsData - { title, content, topic, image, imageUrl }
 */
export const updateNews = async (id, newsData) => {
  const response = await api.put(`/api/admin/news/${id}`, newsData)
  return response.data
}

/**
 * Delete news (admin only)
 * @param {string} id - News ID
 */
export const deleteNews = async (id) => {
  const response = await api.delete(`/api/admin/news/${id}`)
  return response.data
}

// ============ USER PROFILE API ===========

/**
 * Get user profile
 * Requires authentication
 */
export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile')
  return response.data
}

/**
 * Update user profile
 * @param {Object} profileData - { name, bio, location, website, avatar (base64 optional) }
 */
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/api/user/profile', profileData)
  return response.data
}

/**
 * Subscribe to newsletter
 * Requires authentication
 */
export const subscribeToNewsletter = async () => {
  const response = await api.post('/api/user/subscribe')
  return response.data
}

/**
 * Unsubscribe from newsletter
 * Requires authentication
 */
export const unsubscribeFromNewsletter = async () => {
  const response = await api.post('/api/user/unsubscribe')
  return response.data
}

/**
 * Update user preferences
 * @param {Object} preferencesData - { subscribeToNewsletter, emailNotifications, topics (array) }
 */
export const updateUserPreferences = async (preferencesData) => {
  const response = await api.put('/api/user/preferences', preferencesData)
  return response.data
}

// ============ HEALTH CHECK ===========

/**
 * Check if API is running
 */
export const healthCheck = async () => {
  const response = await api.get('/')
  return response.data
}

export default api

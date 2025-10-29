/**
 * Authentication helper functions for managing user/admin sessions
 */

// ============ TOKEN MANAGEMENT ============

/**
 * Save authentication token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
    localStorage.setItem('token', token)
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
    return localStorage.getItem('token')
}

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('token')
}

// ============ USER MANAGEMENT ============

/**
 * Save user data to localStorage
 * @param {Object} user - User object { id, name, email }
 */
export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Get user data from localStorage
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

/**
 * Remove user data from localStorage
 */
export const removeUser = () => {
    localStorage.removeItem('user')
}

// ============ ADMIN MANAGEMENT ============

/**
 * Save admin data to localStorage
 * @param {Object} admin - Admin object { id, name, email }
 */
export const saveAdmin = (admin) => {
    localStorage.setItem('admin', JSON.stringify(admin))
}

/**
 * Get admin data from localStorage
 * @returns {Object|null} Admin object or null
 */
export const getAdmin = () => {
    const admin = localStorage.getItem('admin')
    return admin ? JSON.parse(admin) : null
}

/**
 * Remove admin data from localStorage
 */
export const removeAdmin = () => {
    localStorage.removeItem('admin')
}

// ============ SESSION MANAGEMENT ============

/**
 * Clear all authentication data (logout)
 */
export const clearAuth = () => {
    removeToken()
    removeUser()
    removeAdmin()
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isUserAuthenticated = () => {
    return !!(getToken() && getUser())
}

/**
 * Check if admin is authenticated
 * @returns {boolean}
 */
export const isAdminAuthenticated = () => {
    return !!(getToken() && getAdmin())
}

/**
 * Decode JWT token to get payload
 * Note: This is basic decoding for client-side use only
 * Server always validates the token properly
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (error) {
        console.error('Error decoding token:', error)
        return null
    }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now()
}

/**
 * Get current authenticated user role
 * @returns {'admin'|'user'|null}
 */
export const getUserRole = () => {
    const token = getToken()
    if (!token) return null

    const decoded = decodeToken(token)
    return decoded?.role || null
}

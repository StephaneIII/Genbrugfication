// User Controller - Frontend
class UserController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'
  }

  /**
   * Generate a random friend code (6-digit number)
   */
  generateFriendCode() {
    return Math.floor(100000 + Math.random() * 900000)
  }

  /**
   * Create a new user account
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} API response
   */
  async createUser(userData) {
    try {
      // Generate friend code if not provided
      const userDataWithFriendCode = {
        ...userData,
        FriendCode: userData.FriendCode || this.generateFriendCode(),
      }

      // Remove confirmPassword and map field names for API
      const { confirmPassword, password, ...otherData } = userDataWithFriendCode

      // Map frontend field names to API field names
      const apiData = {
        ...otherData,
        Password: password, // Map lowercase 'password' to uppercase 'Password'
      }

      const response = await fetch(`${this.apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Registration failed',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Login user
   * @param {Object} loginData - Email and password
   * @returns {Promise<Object>} API response
   */
  async loginUser(loginData) {
    try {
      // Map field names for API (password -> Password)
      const apiData = {
        Email: loginData.Email,
        Password: loginData.password, // Map lowercase 'password' to uppercase 'Password'
      }

      const response = await fetch(`${this.apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Invalid email or password',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Get all users (admin function)
   * @returns {Promise<Object>} API response
   */
  async getAllUsers() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users`)
      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Failed to fetch users',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} API response
   */
  async getUserById(userId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${userId}`)
      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Failed to fetch user',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   */
  async updateUser(userId, updateData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Failed to update user',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   */
  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${userId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Failed to delete user',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Verify user password
   * @param {string} userId - User ID
   * @param {string} password - Password to verify
   * @returns {Promise<Object>} API response
   */
  async verifyPassword(userId, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${userId}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Password: password }),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        error: response.ok ? null : data.error || 'Password verification failed',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Unable to connect to server. Please try again.',
      }
    }
  }

  /**
   * Store user session in localStorage
   * @param {Object} userData - User data from login response
   */
  storeUserSession(userData) {
    localStorage.setItem('userId', userData.UID)
    localStorage.setItem('username', userData.Username)
    localStorage.setItem('isAdmin', userData.isAdmin)

    // Dispatch a custom event to notify components of auth state change
    window.dispatchEvent(
      new CustomEvent('authStateChange', {
        detail: { loggedIn: true, user: userData },
      }),
    )
  }

  /**
   * Get stored user session from localStorage
   * @returns {Object|null} User session data or null if not found
   */
  getUserSession() {
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')

    if (userId) {
      return { userId, username }
    }
    return null
  }

  /**
   * Clear user session from localStorage
   */
  clearUserSession() {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')

    // Dispatch a custom event to notify components of auth state change
    window.dispatchEvent(
      new CustomEvent('authStateChange', {
        detail: { loggedIn: false, user: null },
      }),
    )
  }

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return localStorage.getItem('userId') !== null
  }

  /**
   * Check if logged-in user is admin
   */
  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true'
  }
}

// Export instance of UserController
export default new UserController()

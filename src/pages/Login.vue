<script>
import UserController from '@/Controller/User.controller.js'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        Email: '',
        password: '',
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      isLoading: false,
    }
  },
  mounted() {
    // Check if user is already logged in
    if (UserController.isLoggedIn()) {
      this.$router.push('/')
      return
    }
  },
  methods: {
    async handleLogin() {
      this.clearMessages()
      this.errors = {}

      // Validate form
      if (!this.validateForm()) {
        this.errorMessage = 'Please fix the validation errors below'
        return
      }

      this.isLoading = true

      try {
        // Call UserController to login user
        const result = await UserController.loginUser(this.formData)

        if (result.success) {
          // Store user session in localStorage
          UserController.storeUserSession(result.data.user)

          this.successMessage = 'Login successful! Redirecting...'

          // Redirect to home page after successful login
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Login error:', error)
        this.errorMessage = 'Unable to connect to server. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    validateForm() {
      let isValid = true

      // Email validation
      if (!this.formData.Email) {
        this.errors.Email = 'Email is required'
        isValid = false
      } else if (!this.validateEmail(this.formData.Email)) {
        this.errors.Email = 'Please enter a valid email address'
        isValid = false
      }

      // Password validation
      if (!this.formData.password) {
        this.errors.password = 'Password is required'
        isValid = false
      }

      return isValid
    },

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    resetForm() {
      this.formData = {
        Email: '',
        password: '',
      }
    },

    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },
  },
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="header">
          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">log in to your account</p>
        </div>

        <!-- Error Display -->
        <div v-if="errorMessage" class="error-alert">
          <i class="error-icon">⚠</i>
          {{ errorMessage }}
        </div>

        <!-- Success Display -->
        <div v-if="successMessage" class="success-alert">
          <i class="success-icon">✓</i>
          {{ successMessage }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="formData.Email"
              type="email"
              name="Email"
              placeholder="Enter your email address"
              :class="{ error: errors.Email }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.Email" class="error-text">{{ errors.Email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              name="password"
              placeholder="Enter your password"
              :class="{ error: errors.password }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner">⟳</span>
            {{ isLoading ? ' Logging In...' : ' Log In' }}
          </button>
        </form>

        <!-- Signup Link -->
        <div class="signup-link">
          <p>
            Don't have an account?
            <router-link to="/signup" class="link">Sign up here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 40px;
  box-shadow: var(--shadow);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.login-subtitle {
  color: #718096;
  font-size: 1rem;
}

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  margin-bottom: 20px;
  font-weight: 500;
}

.error-alert {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.success-alert {
  background-color: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.error-icon,
.success-icon {
  margin-right: 8px;
  font-weight: bold;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--white-text);
  color: var(--dark-text);
}

.form-group input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.1);
}

.form-group input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-text {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 4px;
  font-weight: 500;
}

.login-button {
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  color: var(--white-text);
  border: none;
  padding: 14px 24px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
  margin-top: var(--gap-med);
  font-family: var(--font-heading);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(47, 107, 95, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 1.2rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid #e2e8f0;
}

.signup-link p {
  color: #718096;
  margin: 0;
}

.link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-page {
    padding: 10px;
  }

  .login-card {
    padding: 24px;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>

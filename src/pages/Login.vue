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
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow-card);
}

.header {
  text-align: center;
  margin-bottom: var(--gap-large);
}

.login-title {
  margin: 0 0 var(--gap-small);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
}

.login-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.5;
}

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  gap: var(--gap-small);
  padding: var(--gap-med);
  border-radius: var(--border-radius-med);
  margin-bottom: var(--gap-med);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
}

.error-alert {
  background: #fff5f5;
  color: #9f1c2e;
  border: 1px solid #f5c2c7;
}

.success-alert {
  background: #edf7f1;
  color: var(--color-primary);
  border: 1px solid var(--color-secondary);
}

.error-icon,
.success-icon {
  font-weight: var(--font-weight-bold);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.form-group label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.form-group input {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.form-group input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.18);
}

.form-group input:disabled {
  background: #edf1ee;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group input.error {
  border-color: #9f1c2e;
  box-shadow: 0 0 0 3px rgba(159, 28, 46, 0.14);
}

.error-text {
  color: #9f1c2e;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.login-button {
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-med);
  background: var(--color-accent);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  margin-top: var(--gap-small);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.login-button:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.login-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.login-button:disabled {
  opacity: 0.65;
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
  border-top: 1px solid var(--color-border);
}

.signup-link p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
}

.link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--border-radius-small);
}

/* Tablet */
@media (min-width: 768px) {
  .login-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .login-card {
    padding: var(--gap-xl);
  }
}

/* Small mobile */
@media (max-width: 430px) {
  .login-card {
    padding: var(--gap-large);
  }

  .login-title {
    font-size: var(--font-size-h2);
  }
}
</style>
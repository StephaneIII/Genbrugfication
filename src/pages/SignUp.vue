<script>
import UserController from '@/Controller/User.controller.js'

export default {
  name: 'SignUp',
  data() {
    return {
      formData: {
        Username: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        password: '',
        confirmPassword: '',
        Tlf: '',
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
    async handleSignup() {
      this.clearMessages()
      this.errors = {}

      // Validate form
      if (!this.validateForm()) {
        this.errorMessage = 'Please fix the validation errors below'
        return
      }

      // Check if passwords match
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
        this.errorMessage = 'Please fix the validation errors below'
        return
      }

      this.isLoading = true

      try {
        // Call UserController to create user (will generate friend code automatically)
        const result = await UserController.createUser(this.formData)

        if (result.success) {
          this.successMessage = 'Account created successfully! You can now login.'
          this.resetForm()

          // Redirect to login page after successful signup
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Signup error:', error)
        this.errorMessage = 'Unable to connect to server. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    validateForm() {
      let isValid = true

      // Username validation
      if (!this.formData.Username) {
        this.errors.Username = 'Username is required'
        isValid = false
      } else if (this.formData.Username.length < 3) {
        this.errors.Username = 'Username must be at least 3 characters'
        isValid = false
      }

      // First name validation
      if (!this.formData.Firstname) {
        this.errors.Firstname = 'First name is required'
        isValid = false
      }

      // Last name validation
      if (!this.formData.Lastname) {
        this.errors.Lastname = 'Last name is required'
        isValid = false
      }

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
      } else if (!this.validatePassword(this.formData.password)) {
        this.errors.password =
          'Password must be at least 8 characters with uppercase, lowercase, and number'
        isValid = false
      }

      // Confirm password validation
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
        isValid = false
      }

      // Phone validation
      if (!this.formData.Tlf) {
        this.errors.Tlf = 'Phone number is required'
        isValid = false
      }

      return isValid
    },

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    validatePassword(password) {
      const minLength = 8
      const hasUppercase = /[A-Z]/.test(password)
      const hasLowercase = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)

      return password.length >= minLength && hasUppercase && hasLowercase && hasNumber
    },

    resetForm() {
      this.formData = {
        Username: '',
        Firstname: '',
        Lastname: '',
        Email: '',
        password: '',
        confirmPassword: '',
        Tlf: '',
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
  <main class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <header class="header">
          <h1 class="signup-title">Create Your Account</h1>
          <p class="signup-subtitle">Join us and start your journey</p>
        </header>

        <!-- Error Display -->
        <section v-if="errorMessage" class="error-alert" role="alert" aria-live="polite">
          <i class="error-icon">⚠</i>
          {{ errorMessage }}
        </section>

        <!-- Success Display -->
        <section v-if="successMessage" class="success-alert" role="status" aria-live="polite">
          <i class="success-icon">✓</i>
          {{ successMessage }}
        </section>

        <!-- Signup Form -->
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-row">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="formData.Username"
                type="text"
                name="Username"
                placeholder="Choose a username"
                :class="{ error: errors.Username }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Username" class="error-text">{{ errors.Username }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input
                id="firstname"
                v-model="formData.Firstname"
                type="text"
                name="Firstname"
                placeholder="Enter your first name"
                :class="{ error: errors.Firstname }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Firstname" class="error-text">{{ errors.Firstname }}</span>
            </div>

            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input
                id="lastname"
                v-model="formData.Lastname"
                type="text"
                name="Lastname"
                placeholder="Enter your last name"
                :class="{ error: errors.Lastname }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Lastname" class="error-text">{{ errors.Lastname }}</span>
            </div>
          </div>

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
              placeholder="Create a strong password"
              :class="{ error: errors.password }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            <div class="password-requirements">
              At least 8 characters with uppercase, lowercase, and number
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              :class="{ error: errors.confirmPassword }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.confirmPassword" class="error-text">{{
              errors.confirmPassword
            }}</span>
          </div>

          <div class="form-group">
            <label for="tlf">Phone Number</label>
            <input
              id="tlf"
              v-model="formData.Tlf"
              type="tel"
              name="Tlf"
              placeholder="Enter your phone number"
              :class="{ error: errors.Tlf }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.Tlf" class="error-text">{{ errors.Tlf }}</span>
          </div>

          <button type="submit" class="signup-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner">⟳</span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <footer class="login-link">
          <p>
            Already have an account?
            <router-link to="/login" class="link">Sign in here</router-link>
          </p>
        </footer>
      </div>
    </div>
  </main>
</template>

<style scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}

.signup-container {
  width: 100%;
  max-width: 450px;
}

.signup-card {
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

.signup-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.signup-subtitle {
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
}

.form-row {
  display: flex;
  gap: var(--gap-med);
}

.form-row .form-group {
  flex: 1;
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

.password-requirements {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 4px;
}

.signup-button {
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

.signup-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(47, 107, 95, 0.3);
}

.signup-button:disabled {
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

.login-link {
  text-align: center;
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid #e2e8f0;
}

.login-link p {
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
  .signup-page {
    padding: 10px;
  }

  .signup-card {
    padding: 24px;
  }

  .form-row {
    flex-direction: column;
    gap: var(--gap-large);
  }

  .signup-title {
    font-size: 1.5rem;
  }
}
</style>

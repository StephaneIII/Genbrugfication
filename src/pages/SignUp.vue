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
        isAdmin: false,
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      isLoading: false,
    }
  },

  mounted() {
    if (UserController.isLoggedIn()) {
      this.$router.push('/')
      return
    }
  },

  methods: {
    async handleSignup() {
      this.clearMessages()
      this.errors = {}

      if (!this.validateForm()) {
        this.errorMessage = 'Ret venligst fejlene nedenfor'
        return
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'De to passwords er ikke ens'
        this.errorMessage = 'Ret venligst fejlene nedenfor'
        return
      }

      this.isLoading = true

      try {
        const result = await UserController.createUser(this.formData)

        if (result.success) {
          this.successMessage = 'Profil oprettet! Du kan nu logge ind.'
          this.resetForm()

          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Signup error:', error)
        this.errorMessage = 'Kunne ikke oprette forbindelse til serveren. Prøv venligst igen.'
      } finally {
        this.isLoading = false
      }
    },

    validateForm() {
      let isValid = true

      if (!this.formData.Username) {
        this.errors.Username = 'Brugernavn mangler'
        isValid = false
      } else if (this.formData.Username.length < 3) {
        this.errors.Username = 'Brugernavn skal være mindst 3 tegn langt'
        isValid = false
      }

      if (!this.formData.Firstname) {
        this.errors.Firstname = 'Fornavn mangler'
        isValid = false
      }

      if (!this.formData.Lastname) {
        this.errors.Lastname = 'Efternavn mangler'
        isValid = false
      }

      if (!this.formData.Email) {
        this.errors.Email = 'Emailadresse mangler'
        isValid = false
      } else if (!this.validateEmail(this.formData.Email)) {
        this.errors.Email = 'Indtast venligst en gyldig emailadresse'
        isValid = false
      }

      if (!this.formData.password) {
        this.errors.password = 'Password mangler'
        isValid = false
      } else if (!this.validatePassword(this.formData.password)) {
        this.errors.password =
          'Password skal være mindst 8 tegn langt og inkludere tal samt store og små bogstaver'
        isValid = false
      }

      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Bekræft dit password'
        isValid = false
      }

      if (!this.formData.Tlf) {
        this.errors.Tlf = 'Telefonnummer mangler'
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
        isAdmin: false,
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
          <h1 class="signup-title">Opret din profil</h1>
          <p class="signup-subtitle">
            Tilmeld dig og kom i gang med at sortere affald og optjene point
          </p>
        </header>

        <section v-if="errorMessage" class="error-alert" role="alert" aria-live="polite">
          <i class="error-icon">⚠</i>
          {{ errorMessage }}
        </section>

        <section v-if="successMessage" class="success-alert" role="status" aria-live="polite">
          <i class="success-icon">✓</i>
          {{ successMessage }}
        </section>

        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-row">
            <div class="form-group">
              <label for="username">Brugernavn</label>
              <input
                id="username"
                v-model="formData.Username"
                type="text"
                name="Username"
                placeholder="Vælg et brugernavn"
                :class="{ error: errors.Username }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Username" class="error-text">{{ errors.Username }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstname">Fornavn</label>
              <input
                id="firstname"
                v-model="formData.Firstname"
                type="text"
                name="Firstname"
                placeholder="Indtast dit fornavn"
                :class="{ error: errors.Firstname }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Firstname" class="error-text">{{ errors.Firstname }}</span>
            </div>

            <div class="form-group">
              <label for="lastname">Efternavn</label>
              <input
                id="lastname"
                v-model="formData.Lastname"
                type="text"
                name="Lastname"
                placeholder="Indtast dit efternavn"
                :class="{ error: errors.Lastname }"
                :disabled="isLoading"
                required
              />
              <span v-if="errors.Lastname" class="error-text">{{ errors.Lastname }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Emailadresse</label>
            <input
              id="email"
              v-model="formData.Email"
              type="email"
              name="Email"
              placeholder="Indtast din emailadresse"
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
              placeholder="Lav et stærkt password"
              :class="{ error: errors.password }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>

            <div class="password-requirements">
              Password skal være mindst 8 tegn langt og inkludere tal samt store og små bogstaver
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Bekræft password</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Gentag dit password"
              :class="{ error: errors.confirmPassword }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.confirmPassword" class="error-text">
              {{ errors.confirmPassword }}
            </span>
          </div>

          <div class="form-group">
            <label for="tlf">Telefonnummer</label>
            <input
              id="tlf"
              v-model="formData.Tlf"
              type="tel"
              name="Tlf"
              placeholder="Indtast dit telefonnummer"
              :class="{ error: errors.Tlf }"
              :disabled="isLoading"
              required
            />
            <span v-if="errors.Tlf" class="error-text">{{ errors.Tlf }}</span>
          </div>

          <button type="submit" class="signup-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner">⟳</span>
            {{ isLoading ? 'Opretter profil...' : 'Opret profil' }}
          </button>
        </form>

        <footer class="login-link">
          <p>
            Har du allerede en profil?
            <router-link to="/login" class="link">Log ind</router-link>
          </p>
        </footer>
      </div>
    </div>
  </main>
</template>

<style scoped>
.signup-page {
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

.signup-container {
  width: 100%;
  max-width: 520px;
}

.signup-card {
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

.signup-title {
  margin: 0 0 var(--gap-small);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
}

.signup-subtitle {
  max-width: 38ch;
  margin: 0 auto;
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
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
  box-sizing: border-box;
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
  line-height: 1.4;
}

.password-requirements {
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.4;
}

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.signup-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.signup-button:disabled {
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

.login-link {
  text-align: center;
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid var(--color-border);
}

.login-link p {
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
  .signup-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .signup-container {
    max-width: 680px;
  }

  .signup-card {
    padding: var(--gap-xl);
  }

  .form-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form-row:first-of-type {
    grid-template-columns: 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .signup-container {
    max-width: 720px;
  }
}

/* Small mobile */
@media (max-width: 430px) {
  .signup-page {
    padding: var(--gap-med);
  }

  .signup-card {
    padding: var(--gap-large);
  }

  .signup-title {
    font-size: var(--font-size-h2);
  }

  .signup-subtitle,
  .form-group input {
    font-size: var(--font-size-small);
  }
}
</style>
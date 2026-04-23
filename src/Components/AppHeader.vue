<template>
  <div class="header-wrapper">
    <header class="app-header">
      <button class="header-button" aria-label="Gå tilbage" @click="goBack">
        <span class="arrow-icon">←</span>
      </button>

      <RouterLink to="/" class="logo-wrapper" aria-label="Gå til landing page">
        <v-icon class="logo-icon">mdi-recycle</v-icon>
      </RouterLink>

      <button class="header-button" aria-label="Åbn menu" @click="isMenuOpen = !isMenuOpen">
        <span class="menu-icon">☰</span>
      </button>
    </header>

    <nav v-if="isMenuOpen" class="burger-menu">
      <a href="/" class="menu-link">Hjem</a>
      <a href="/PostcodePage" class="menu-link">Rutevejledning</a>
      <a href="/Cart" class="menu-link">Checkout</a>

      <!-- Show profile and logout buttons when user is logged in -->
      <template v-if="isUserLoggedIn">
        <button @click="goToProfile" class="menu-link auth-button">Profil</button>
        <button @click="handleLogout" class="menu-link logout-button">Log ud</button>
      </template>

      <!-- Show login/signup buttons when user is not logged in -->
      <template v-else>
        <button @click="goToLogin" class="menu-link auth-button">Log ind</button>
        <button @click="goToSignup" class="menu-link auth-button">Tilmeld dig</button>
      </template>
    </nav>
  </div>
</template>

<script>
import UserController from '@/Controller/User.controller.js'

export default {
  data() {
    return {
      isMenuOpen: false,
      userLoggedIn: false, // Reactive state for authentication
    }
  },

  computed: {
    isUserLoggedIn() {
      return this.userLoggedIn
    },
  },

  mounted() {
    // Check login state when component mounts
    this.updateLoginState()

    // Listen for custom auth state change events
    window.addEventListener('authStateChange', this.handleAuthStateChange)

    // Also listen for storage events to detect login/logout from other tabs
    window.addEventListener('storage', this.handleStorageChange)
  },

  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('authStateChange', this.handleAuthStateChange)
    window.removeEventListener('storage', this.handleStorageChange)
  },

  methods: {
    updateLoginState() {
      this.userLoggedIn = UserController.isLoggedIn()
    },

    handleAuthStateChange(event) {
      // Update login state when auth state changes
      this.userLoggedIn = event.detail.loggedIn
      if (event.key === 'userId' || event.key === 'username') {
        this.updateLoginState()
      }
    },

    goBack() {
      this.$router.back()
    },

    handleLogout() {
      // Clear user session from localStorage
      UserController.clearUserSession()

      // Update the reactive login state
      this.updateLoginState()

      // Close the menu
      this.isMenuOpen = false

      // Redirect to login page
      this.$router.push('/login')
    },

    goToLogin() {
      // Close the menu
      this.isMenuOpen = false

      // Navigate to login page
      this.$router.push('/login')
    },

    goToSignup() {
      // Close the menu
      this.isMenuOpen = false

      // Navigate to signup page
      this.$router.push('/signup')
    },

    goToProfile() {
      // Close the menu
      this.isMenuOpen = false

      // Navigate to profile page
      this.$router.push('/profile')
    },
  },
}
</script>

<style scoped>
.header-wrapper {
  position: relative;
  width: 100%;
  z-index: 1000;
}

.app-header {
  width: 100%;
  height: 64px;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gap-med);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 2;
}

.header-button {
  background: transparent;
  border: none;
  color: var(--white-text);
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-med);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.arrow-icon,
.menu-icon {
  font-size: 1.8rem;
  line-height: 1;
  font-family: var(--font-body);
  color: var(--white-text);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  color: var(--accent-color);
  font-size: 1.8rem;
}

.burger-menu {
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  background-color: var(--secondary-color);
  border-radius: 0 0 var(--border-radius-large) var(--border-radius-large);
  padding: var(--gap-large);
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
  box-shadow: var(--shadow);
  z-index: 1;
  animation: slideDown 0.25s ease;
}

.menu-link {
  color: var(--white-text);
  text-decoration: none;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
  font-family: var(--font-heading);
}

.logout-button {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logout-button:hover {
  opacity: 0.8;
}

.auth-button {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.auth-button:hover {
  opacity: 0.8;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

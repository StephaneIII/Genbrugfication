<script>
import UserController from '@/Controller/User.controller.js'

export default {
  data() {
    return {
      isMenuOpen: false,
      userLoggedIn: false,
    }
  },

  computed: {
    isUserLoggedIn() {
      return this.userLoggedIn
    },
    isAdmin() {
      return UserController.isAdmin()
    }
  },

  mounted() {
    this.updateLoginState()
    window.addEventListener('authStateChange', this.handleAuthStateChange)
    window.addEventListener('storage', this.handleStorageChange)
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    window.removeEventListener('authStateChange', this.handleAuthStateChange)
    window.removeEventListener('storage', this.handleStorageChange)
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    updateLoginState() {
      this.userLoggedIn = UserController.isLoggedIn()
    },

    handleAuthStateChange(event) {
      this.userLoggedIn = event.detail.loggedIn
    },

    handleStorageChange(event) {
      if (event.key === 'UID' || event.key === 'username') {
        this.updateLoginState()
      }
    },

    goBack() {
      this.$router.back()
    },

    handleLogout() {
      UserController.clearUserSession()
      this.updateLoginState()
      this.isMenuOpen = false
      this.$router.push('/login')
    },

    goToLogin() {
      this.isMenuOpen = false
      this.$router.push('/login')
    },

    goToSignup() {
      this.isMenuOpen = false
      this.$router.push('/signup')
    },

    goToProfile() {
      this.isMenuOpen = false
      this.$router.push('/profile')
    },

    handleClickOutside(event) {
      const headerWrapper = this.$el

      if (this.isMenuOpen && !headerWrapper.contains(event.target)) {
        this.isMenuOpen = false
      }
    }
  },
}
</script>

<template>
  <div class="header-wrapper">
    <header class="app-header">
      <button class="header-button" aria-label="Gå tilbage" @click="goBack">
        <span class="arrow-icon">←</span>
      </button>

      <RouterLink to="/" class="logo-wrapper" aria-label="Gå til landing page">
        <img src="/images/logo/logo.png" alt="Zealand logo" class="logo-img" />
        <span class="logo-text">Zealand</span>
      </RouterLink>

      <button class="header-button" aria-label="Åbn menu" @click="isMenuOpen = !isMenuOpen">
        <span class="menu-icon">☰</span>
      </button>
    </header>

    <nav v-if="isMenuOpen" class="burger-menu">
      <RouterLink to="/" class="menu-link" @click="isMenuOpen = false">Hjem</RouterLink>
      <RouterLink to="/PostcodePage" class="menu-link" @click="isMenuOpen = false">
        Rutevejledning
      </RouterLink>
      <RouterLink to="/Cart" class="menu-link" @click="isMenuOpen = false">
        Checkout
      </RouterLink>

      <template v-if="isUserLoggedIn">
        <button @click="goToProfile" class="menu-link auth-button">Profil</button>
        <button @click="handleLogout" class="menu-link logout-button">Log ud</button>

        <RouterLink to="/carpoolings" class="menu-link" @click="isMenuOpen = false">
          Samkørsel
        </RouterLink>

        <RouterLink to="/MyPoints" class="menu-link" @click="isMenuOpen = false">
          Mine Point
        </RouterLink>

        <RouterLink v-if="isAdmin" to="/TrashList" class="menu-link" @click="isMenuOpen = false">
          Admin funktion: opret skrald
        </RouterLink>
      </template>

      <template v-else>
        <button @click="goToLogin" class="menu-link auth-button">Log ind</button>
        <button @click="goToSignup" class="menu-link auth-button">Tilmeld dig</button>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.header-wrapper {
  position: relative;
  width: 100%;
  z-index: 1000;
}

.app-header {
  width: 100%;
  height: 64px;
  background-color: var(--color-primary);
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  padding: 0 var(--gap-small);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 2;
}

.header-button {
  background: transparent;
  border: none;
  color: var(--color-text-light);
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-med);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.header-button:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.arrow-icon,
.menu-icon {
  font-family: var(--font-body);
  font-size: 1.6rem;
  line-height: 1;
  color: var(--color-text-light);
}

.logo-wrapper {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: var(--gap-small);
  color: var(--color-text-light);
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
}

.logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  display: block;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-round);
}

.logo-text {
  display: none;
  font-size: var(--font-size-small);
  color: var(--color-text-light);
}

.burger-menu {
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  background-color: var(--color-primary);
  border-radius: 0 0 var(--border-radius-large) var(--border-radius-large);
  padding: var(--gap-large);
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
  box-shadow: var(--shadow-card);
  z-index: 1;
  animation: slideDown var(--transition-med);
}

.menu-link {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  font-family: var(--font-heading);
}

.auth-button,
.logout-button {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.menu-link:hover {
  opacity: 0.85;
}

@media (min-width: 768px) {
  .app-header {
    height: 72px;
    padding: 0 var(--gap-med);
    grid-template-columns: 1fr 40px;
  }

  .header-button:first-child {
    display: none;
  }

  .logo-wrapper {
    justify-self: start;
  }

  .logo-text {
    display: inline;
  }

  .burger-menu {
    top: 72px;
  }
}

@media (min-width: 1024px) {
  .app-header {
    height: 80px;
    padding: 0 var(--gap-large);
  }

  .logo-text {
    font-size: var(--font-size-body);
  }

  .menu-icon {
    font-size: 2rem;
  }

  .burger-menu {
    top: 80px;
  }
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
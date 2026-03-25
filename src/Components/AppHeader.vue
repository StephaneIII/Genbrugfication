<template>
  <div class="header-wrapper">
    <header class="app-header">
      <button class="header-button" aria-label="Gå tilbage" @click="goBack">
        <span class="arrow-icon">←</span>
      </button>

      <RouterLink to="/" class="logo-wrapper" aria-label="Gå til landing page">
        <v-icon class="logo-icon">mdi-recycle</v-icon>
      </RouterLink>

      <button
        class="header-button"
        aria-label="Åbn menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="menu-icon">☰</span>
      </button>
    </header>

    <nav v-if="isMenuOpen" class="burger-menu">
      <a href="/" class="menu-link">Hjem</a>
      <a href="/PostcodePage" class="menu-link">Rutevejledning</a>
      <a href="/Cart" class="menu-link">Checkout</a>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    }
  },

  methods: {
    goBack() {
      this.$router.back()
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
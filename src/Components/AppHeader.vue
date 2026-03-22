<template>
  <header class="app-header">
    <button class="header-button" aria-label="Gå tilbage">
      <span class="arrow-icon">←</span>
    </button>

    <div class="logo-wrapper" aria-label="Genbrugfication logo">
    <v-icon class="logo-icon">mdi-recycle</v-icon>
    </div>

    <button class="header-button" aria-label="Åbn menu">
      <span class="menu-icon">☰</span>
    </button>
  </header>
</template>

<script setup>
</script>

<style scoped>

.app-header {
  width: 100%;
  height: 64px;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gap-med);
  box-shadow: var(--shadow);
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
  font-size: 1.6rem;
  line-height: 1;
  font-family: var(--font-body);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  color: var(--accent-color);
  font-size: 1.6rem;
}
</style>
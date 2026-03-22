<template>
  <v-main class="postcode-page">
    <AppHeader />

    <section class="postcode-content">
      <h1 class="postcode-title">Indtast postnummer</h1>
      <p class="postcode-subtitle">Se affaldsinfo i dit område</p>

      <input
        v-model="postcode"
        type="text"
        placeholder="Prøv: 4000, 2500, 2000"
        class="postcode-input"
      />

      <v-btn class="find-route-btn" @click="handleFindRoute">
        Vis kort
      </v-btn>
    </section>

    <AppFooter />
  </v-main>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'PostcodePage',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      postcode: ''
    }
  },
  methods: {
    handleFindRoute() {
      console.log('Postnummer:', this.postcode)
    }
  }
}
</script>

<style scoped>
.postcode-page {
  min-height: 100vh;
  background-color: var(--primary-bg-color);
  display: flex;
  flex-direction: column;
}

.postcode-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 1.5rem 1.5rem;
  text-align: center;
}

.postcode-title {
  font-family: var(--font-heading);
  color: var(--white-text);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--gap-med);
}

.postcode-subtitle {
  font-family: var(--font-body);
  color: var(--white-text);
  font-size: 1.1rem;
  margin-bottom: var(--gap-large);
}

.postcode-input {
  width: 100%;
  max-width: 260px;
  height: 44px;
  padding: 0 12px;
  border: none;
  border-radius: var(--border-radius-med);
  background-color: #f1f1f1;
  color: var(--dark-text);
  font-family: var(--font-body);
  margin-bottom: var(--gap-large);
}

.find-route-btn {
  background-color: var(--accent-color) !important;
  color: var(--dark-text) !important;
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: none;
  border-radius: 999px !important;
  padding-inline: 1.5rem;
}

.page-footer {
  background-color: #4a4a4a;
  color: var(--white-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem;
}
</style>
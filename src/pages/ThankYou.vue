<script>
import appleJuice from '@/Components/Images/applejuice.png'
import BaseButton from '@/Components/BaseButton.vue';
export default {
  components: {
    BaseButton,
  },
  data() {
    return {
    }
  },

  methods: {
    goToHome() {
      this.$router.push(`/`)
    },
  },
}
</script>

<template>
  <main class="page">
    <article class="content">
      <p class="takBesked">Tak for at gøre en forskel!</p>

      <hr>

      <p class="optjentBesked">
        Du har optjent
        <span class="points-number">{{ trashCount * 10 }}</span>
        point ved denne sortering!
      </p>

      <hr>

      <p>
        Du har nu
        <span class="points-number">{{ totalPoints * 10 }}</span>
        point i alt!
      </p>

      <BaseButton class="baseButton" @click="goToHome">
        Hjem
      </BaseButton>
    </article>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--primary-bg-color);
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  gap: 1.5rem;
  width: min(90%, 600px);
}

.takBesked {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
}

.optjentBesked {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
}

.points-number {
  font-weight: bold;
  color: var(--accent-color);
}

hr {
  width: 100%;
  border: 1px solid var(--white-text);
}

.baseButton {
  margin-top: 1rem;
}
</style>
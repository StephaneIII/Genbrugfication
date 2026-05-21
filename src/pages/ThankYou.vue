<script>
import BaseButton from '@/Components/BaseButton.vue'

export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      earnedPoints: 0,
      totalPoints: 0,
    }
  },

  mounted() {
    this.applyScoresFromRouteOrStorage()
  },

  watch: {
    '$route.query': {
      deep: true,
      handler() {
        this.applyScoresFromRouteOrStorage()
      },
    },
  },

  methods: {
    toQueryValue(value) {
      if (Array.isArray(value)) {
        return value[0]
      }

      return value
    },
    toSafeNumber(value) {
      const parsed = Number(value)
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
    },
    applyScoresFromRouteOrStorage() {
      const earnedQuery = this.toQueryValue(this.$route.query.earned)
      const totalQuery = this.toQueryValue(this.$route.query.total)

      const earnedFromQuery = this.toSafeNumber(earnedQuery)
      const totalFromQuery = this.toSafeNumber(totalQuery)

      const earnedFromStorage = this.toSafeNumber(sessionStorage.getItem('lastEarnedPoints'))
      const totalFromStorage = this.toSafeNumber(sessionStorage.getItem('lastTotalPoints'))

      const earned = earnedFromQuery > 0 ? earnedFromQuery : earnedFromStorage
      const totalCandidate = totalFromQuery > 0 ? totalFromQuery : totalFromStorage

      this.earnedPoints = earned
      this.totalPoints = totalCandidate >= earned ? totalCandidate : earned
    },
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

      <hr />

      <p class="optjentBesked">
        Du har optjent
        <span class="points-number">{{ earnedPoints }}</span>
        point ved denne sortering!
      </p>

      <hr />

      <p>
        Du har nu
        <span class="points-number">{{ totalPoints }}</span>
        point i alt!
      </p>

      <BaseButton class="baseButton" @click="goToHome"> Hjem </BaseButton>
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

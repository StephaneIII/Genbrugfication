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
  width: 100%;
  min-height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--gap-large) var(--gap-med);
}

.content {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  padding: var(--gap-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--gap-large);
}

.takBesked {
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.optjentBesked,
.content p:not(.takBesked) {
  font-family: var(--font-body);
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.5;
}

.points-number {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid var(--color-border);
}

.baseButton {
  width: 100%;
  margin-top: var(--gap-small);
}

.baseButton :deep(button) {
  width: 100%;
  border-radius: var(--border-radius-round);
}

@media (min-width: 768px) {
  .page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .content {
    max-width: 520px;
    padding: var(--gap-xl);
  }

  .takBesked {
    font-size: var(--font-size-h1);
  }

  .optjentBesked,
  .content p:not(.takBesked) {
    font-size: var(--font-size-h3);
  }
}

@media (min-width: 1024px) {
  .content {
    max-width: 560px;
  }
}
</style>
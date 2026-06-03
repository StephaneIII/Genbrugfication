<script>
import UserController from '@/Controller/User.controller.js'
import PointController from '@/Controller/Point.controller.js'

export default {
  name: 'MyPoint',
  data() {
    return {
      scoreToCo2Rates: 5,
      UID: null,
      currentMonthScore: null,
      previousMonthScore: null,
      allTimeScore: null,
      historyMonthScore: null,
      historyError: '',
      isHistoryLoading: false,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      isLoading: true,
      errorMessage: '',
    }
  },
  computed: {
    yearOptions() {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 6 }, (_, index) => currentYear - index)
    },
    monthOptions() {
      return [
        { value: 1, label: 'Januar' },
        { value: 2, label: 'Februar' },
        { value: 3, label: 'Marts' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Maj' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
      ]
    },
    selectedMonthLabel() {
      const month = this.monthOptions.find((item) => item.value === Number(this.selectedMonth))
      return month ? month.label : ''
    },
    progressPercent() {
      if (this.previousMonthScore === null || this.currentMonthScore === null) {
        return 0
      }

      if (this.previousMonthScore <= 0) {
        return this.currentMonthScore > 0 ? 120 : 0
      }

      return Math.round((this.currentMonthScore / this.previousMonthScore) * 100)
    },
    progressBarPercent() {
      return Math.min(this.progressPercent, 120)
    },
    progressClass() {
      if (this.progressPercent >= 120) return 'milestone-120'
      if (this.progressPercent >= 100) return 'milestone-100'
      if (this.progressPercent >= 75) return 'milestone-75'
      if (this.progressPercent >= 50) return 'milestone-50'
      if (this.progressPercent >= 25) return 'milestone-25'
      return 'milestone-low'
    },
    progressText() {
      if (this.previousMonthScore <= 0) {
        return this.currentMonthScore > 0
          ? 'Du har allerede overgået sidste måned'
          : 'Ingen point i sidste måned at sammenligne med'
      }

      if (this.progressPercent >= 120) return 'Fantastisk! Du er over 120% af sidste måned'
      if (this.progressPercent >= 100) return 'Du har nået sidste måneds niveau'

      const remaining = Math.max(0, 100 - this.progressPercent)
      return `Du mangler ${remaining}% for at nå sidste måned`
    },
    currentMonthCo2SavedGrams() {
      return (this.currentMonthScore ?? 0) * this.scoreToCo2Rates
    },
    allTimeCo2SavedGrams() {
      return (this.allTimeScore ?? 0) * this.scoreToCo2Rates
    },
  },
  async mounted() {
    if (!UserController.isLoggedIn()) {
      this.$router.push('/login')
      return
    }

    const session = UserController.getUserSession()

    if (!session || !session.UID) {
      this.errorMessage = 'Brugersession blev ikke fundet. Log ind igen.'
      this.isLoading = false
      return
    }

    this.UID = session.UID
    await this.fetchScores()
  },
  methods: {
    async fetchScores() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear

        const currentResult = await PointController.getTotalScoreByMonth(
          this.UID,
          currentMonth,
          currentYear,
        )

        if (!currentResult.success) {
          this.errorMessage = currentResult.error || 'Kunne ikke hente point.'
          return
        }

        this.currentMonthScore = currentResult.data.totalScore

        const prevResult = await PointController.getTotalScoreByMonth(
          this.UID,
          prevMonth,
          prevYear,
        )

        if (!prevResult.success) {
          this.errorMessage = prevResult.error || 'Kunne ikke hente point.'
          return
        }

        this.previousMonthScore = prevResult.data.totalScore

        const allTimeResult = await PointController.getTotalScoreByUID(this.UID)

        if (!allTimeResult.success) {
          this.errorMessage = allTimeResult.error || 'Kunne ikke hente samlet score.'
          return
        }

        this.allTimeScore = allTimeResult.data.totalScore

        await this.fetchHistoryScore()
      } catch (error) {
        this.errorMessage = 'Kunne ikke hente point.'
      } finally {
        this.isLoading = false
      }
    },

    async fetchHistoryScore() {
      this.isHistoryLoading = true
      this.historyError = ''

      try {
        const historyResult = await PointController.getTotalScoreByMonth(
          this.UID,
          Number(this.selectedMonth),
          Number(this.selectedYear),
        )

        if (!historyResult.success) {
          this.historyError = historyResult.error || 'Kunne ikke hente historik.'
          this.historyMonthScore = null
          return
        }

        this.historyMonthScore = historyResult.data.totalScore
      } catch (error) {
        this.historyError = 'Kunne ikke hente historik.'
        this.historyMonthScore = null
      } finally {
        this.isHistoryLoading = false
      }
    },
  },
}
</script>

<template>
  <main class="mypoint-page">
    <div class="mypoint-container">
      <div class="mypoint-card">
        <header class="header">
          <h1 class="mypoint-title">Mine Point</h1>
          <p class="mypoint-subtitle">Følg din genbrugsscore og se din CO2-besparelse</p>
        </header>

        <section v-if="isLoading" class="loading-section">
          <div class="loading-spinner">⟳</div>
          <p>Indlæser point...</p>
        </section>

        <section v-if="errorMessage" class="error-alert" role="alert" aria-live="polite">
          <i class="error-icon">⚠</i>
          {{ errorMessage }}
        </section>

        <div v-if="!isLoading && !errorMessage" class="points-content">
          <div class="score-block current">
            <div class="score-label">Denne måned</div>
            <div class="score-value">{{ currentMonthScore }}</div>
            <p class="co2-value">Sparet CO2: {{ currentMonthCo2SavedGrams }} g CO2e</p>
            <p class="co2-note">1 point svarer ca. til {{ scoreToCo2Rates }} g CO2e</p>

            <div class="progress-wrap">
              <div class="progress-header">
                <span>Tæt på sidste måned</span>
                <span class="progress-percent" :class="progressClass">{{ progressPercent }}%</span>
              </div>

              <div class="progress-track">
                <div
                  class="progress-fill"
                  :class="progressClass"
                  :style="{ width: progressBarPercent + '%' }"
                ></div>
              </div>

              <p class="progress-text">{{ progressText }}</p>
            </div>
          </div>

          <div class="score-block previous">
            <div class="score-label">Sidste måned</div>
            <div class="score-value">{{ previousMonthScore }}</div>
          </div>

          <div class="score-block all-time">
            <div class="score-label">Samlet score</div>
            <div class="score-value">{{ allTimeScore }}</div>
            <p class="co2-value">Sparet CO2: {{ allTimeCo2SavedGrams }} g CO2e</p>
            <p class="co2-note">1 point svarer ca. til {{ scoreToCo2Rates }} g CO2e</p>
          </div>

          <div class="score-block history">
            <div class="score-label">Historik</div>

            <div class="history-form">
              <div class="history-field">
                <label for="history-month">Måned</label>
                <select id="history-month" v-model.number="selectedMonth" class="history-select">
                  <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                    {{ month.label }}
                  </option>
                </select>
              </div>

              <div class="history-field">
                <label for="history-year">År</label>
                <select id="history-year" v-model.number="selectedYear" class="history-select">
                  <option v-for="year in yearOptions" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>

              <button
                class="history-button"
                :disabled="isHistoryLoading"
                @click="fetchHistoryScore"
              >
                {{ isHistoryLoading ? 'Henter...' : 'Hent score' }}
              </button>
            </div>

            <p v-if="historyError" class="history-error">{{ historyError }}</p>

            <div v-else-if="historyMonthScore !== null" class="history-result">
              <span class="history-result-label">{{ selectedMonthLabel }} {{ selectedYear }}</span>
              <span class="history-result-value">{{ historyMonthScore }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mypoint-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  padding: var(--gap-large) var(--gap-med);
  box-sizing: border-box;
}

.mypoint-container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.mypoint-card {
  width: 100%;
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

.eyebrow {
  margin: 0 0 var(--gap-xs);
  color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mypoint-title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
}

.mypoint-subtitle {
  max-width: 45ch;
  margin: var(--gap-small) auto 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.5;
}

.loading-section,
.error-alert {
  max-width: 520px;
  margin: 0 auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow);
  text-align: center;
}

.loading-section {
  color: var(--color-text-muted);
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
  font-size: 2rem;
  margin-bottom: var(--gap-med);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.error-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
  background: #fff5f5;
  border-color: #f5c2c7;
  color: #9f1c2e;
  font-weight: var(--font-weight-bold);
}

.points-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-med);
}

.score-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow);
}

.score-block.current {
  background: #edf7f1;
}

.score-block.previous,
.score-block.all-time,
.score-block.history {
  background: var(--color-surface);
}

.score-label {
  margin-bottom: var(--gap-small);
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

.score-value {
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  letter-spacing: 0.04em;
}

.co2-value {
  margin: var(--gap-med) 0 var(--gap-xs);
  color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.co2-note {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.progress-wrap {
  margin-top: var(--gap-large);
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-med);
  margin-bottom: var(--gap-small);
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}

.progress-percent {
  font-weight: var(--font-weight-bold);
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: var(--border-radius-round);
  background: #d8e2de;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--border-radius-round);
  transition:
    width var(--transition-med),
    background-color var(--transition-med);
}

.progress-text {
  margin: var(--gap-small) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.history-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-med);
  margin-top: var(--gap-med);
}

.history-field {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.history-field label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.history-select {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  outline: none;
}

.history-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.history-button {
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-med);
  background: var(--color-accent);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.history-button:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.history-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.history-error {
  margin: var(--gap-med) 0 0;
  color: #9f1c2e;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.history-result {
  margin-top: var(--gap-med);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-med);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  padding: var(--gap-med);
  background: #edf7f1;
}

.history-result-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}

.history-result-value {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
}

.progress-percent.milestone-low {
  color: #9f1c2e;
}

.progress-fill.milestone-low {
  background-color: #9f1c2e;
}

.progress-percent.milestone-25 {
  color: #b45f06;
}

.progress-fill.milestone-25 {
  background-color: #b45f06;
}

.progress-percent.milestone-50 {
  color: var(--color-accent);
}

.progress-fill.milestone-50 {
  background-color: var(--color-accent);
}

.progress-percent.milestone-75,
.progress-percent.milestone-100,
.progress-percent.milestone-120 {
  color: var(--color-primary);
}

.progress-fill.milestone-75,
.progress-fill.milestone-100,
.progress-fill.milestone-120 {
  background-color: var(--color-primary);
}

/* Tablet */
@media (min-width: 768px) {
  .mypoint-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .mypoint-card {
    padding: var(--gap-xl);
  }

  .points-content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-large);
  }

  .score-block.current {
    grid-column: 1 / -1;
  }

  .history-form {
    grid-template-columns: 1fr 1fr;
  }

  .history-button {
    grid-column: 1 / -1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .mypoint-card {
    max-width: 1000px;
    margin: 0 auto;
  }

  .points-content {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: stretch;
  }

  .score-block.current {
    grid-column: auto;
    grid-row: span 2;
  }

  .score-block.history {
    grid-column: 1 / -1;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .mypoint-card {
    max-width: 1100px;
  }
}
</style>
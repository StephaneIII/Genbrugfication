<script>
import UserController from '@/Controller/User.controller.js'
import PointController from '@/Controller/Point.controller.js'

export default {
  name: 'MyPoint',
  data() {
    return {
      scoreToCo2Rates: 5, // 1 point = 5 g CO2e
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

      // If last month was 0, treat any positive current score as fully reached (120% cap in UI).
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
    // Check if user is logged in
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
          <p class="mypoint-subtitle">Din genbrugsscore</p>
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
          <div class="score-block">
            <div class="score-label">Denne måned</div>
            <div class="score-value">{{ currentMonthScore }}</div>
            <p class="co2-value">Sparet CO2: {{ currentMonthCo2SavedGrams }} g CO2e</p>
            <p class="co2-note">I gennemsnit svarer 1 point til ca. {{ scoreToCo2Rates }} g CO2e</p>

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
            <div class="score-label">Samlet score (altid)</div>
            <div class="score-value">{{ allTimeScore }}</div>
            <p class="co2-value">Sparet CO2: {{ allTimeCo2SavedGrams }} g CO2e</p>
            <p class="co2-note">I gennemsnit svarer 1 point til ca. {{ scoreToCo2Rates }} g CO2e</p>
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
                  <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>

              <button
                class="history-button"
                :disabled="isHistoryLoading"
                @click="fetchHistoryScore"
              >
                {{ isHistoryLoading ? 'Henter...' : 'Hent månedsscore' }}
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}
.mypoint-container {
  width: 100%;
  max-width: 450px;
}
.mypoint-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
.header {
  text-align: center;
  margin-bottom: 32px;
}
.mypoint-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}
.mypoint-subtitle {
  color: #718096;
  font-size: 1rem;
}
.loading-section {
  text-align: center;
  padding: 32px 16px;
  color: #718096;
}
.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--secondary-color);
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
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  margin-bottom: 20px;
  font-weight: 500;
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}
.error-icon {
  margin-right: 8px;
}
.points-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-top: 32px;
}
.score-block {
  background: #e6f4ea;
  border-radius: 16px;
  padding: 32px 48px;
  box-shadow: 0 4px 16px rgba(30, 74, 66, 0.08);
  text-align: center;
}
.score-block.previous {
  background: #f3f4f6;
}

.score-block.all-time {
  background: #edf5ff;
}

.score-block.history {
  width: 100%;
  max-width: 360px;
  background: #f7fafc;
}
.score-label {
  font-size: 1.1rem;
  color: #22543d;
  margin-bottom: 8px;
}
.score-value {
  font-size: 2.8rem;
  font-weight: 800;
  color: #1e4a42;
  letter-spacing: 2px;
}

.co2-value {
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 0.98rem;
  font-weight: 700;
  color: #25594f;
}

.co2-note {
  margin: 0;
  font-size: 0.8rem;
  color: #5a746d;
}

.history-form {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.history-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.history-field label {
  font-size: 0.85rem;
  color: #3c5b54;
  font-weight: 600;
}

.history-select {
  width: 100%;
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  padding: 9px 10px;
  background: #fff;
  color: #1e4a42;
  font-family: inherit;
}

.history-button {
  grid-column: 1 / -1;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: var(--secondary-color);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.history-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.history-error {
  margin-top: 12px;
  color: #c53030;
  font-size: 0.9rem;
  text-align: left;
}

.history-result {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d7e3de;
  border-radius: 12px;
  padding: 12px 14px;
  background: #ffffff;
}

.history-result-label {
  color: #3f5f57;
  font-size: 0.95rem;
}

.history-result-value {
  color: #1e4a42;
  font-size: 1.4rem;
  font-weight: 800;
}

@media (max-width: 540px) {
  .history-form {
    grid-template-columns: 1fr;
  }
}

.progress-wrap {
  margin-top: 20px;
  text-align: left;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #35584f;
  margin-bottom: 8px;
}

.progress-percent {
  font-weight: 800;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #d8e2de;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition:
    width 300ms ease,
    background-color 300ms ease;
}

.progress-text {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #3f5f57;
}

.progress-percent.milestone-low {
  color: #c53030;
}

.progress-fill.milestone-low {
  background-color: #c53030;
}

.progress-percent.milestone-25 {
  color: #dd6b20;
}

.progress-fill.milestone-25 {
  background-color: #dd6b20;
}

.progress-percent.milestone-50 {
  color: #d69e2e;
}

.progress-fill.milestone-50 {
  background-color: #d69e2e;
}

.progress-percent.milestone-75 {
  color: #38a169;
}

.progress-fill.milestone-75 {
  background-color: #38a169;
}

.progress-percent.milestone-100 {
  color: #2f855a;
}

.progress-fill.milestone-100 {
  background-color: #2f855a;
}

.progress-percent.milestone-120 {
  color: #2b6cb0;
}

.progress-fill.milestone-120 {
  background-color: #2b6cb0;
}
</style>

<script>
import CarpoolingController from '../Controller/CarPooling.controller'
import UserController from '../Controller/User.controller.js'

export default {
  name: 'Carpoolings',
  data() {
    return {
      carpoolingController: new CarpoolingController(),
      uid: null,
      routes: [],
      filters: {
        fromTime: '',
        toTime: '',
        minSeatsLeft: 0,
        stationQuery: '',
        onlyBookedByMe: false,
      },
      loading: false,
      error: null,
    }
  },
  computed: {
    filteredRoutes() {
      const fromTime = this.filters.fromTime ? new Date(this.filters.fromTime) : null
      const toTime = this.filters.toTime ? new Date(this.filters.toTime) : null
      const hasValidFrom = fromTime && !Number.isNaN(fromTime.getTime())
      const hasValidTo = toTime && !Number.isNaN(toTime.getTime())
      const minSeats = Number(this.filters.minSeatsLeft || 0)
      const stationQuery = this.filters.stationQuery.trim().toLowerCase()

      return this.routes.filter((route) => {
        if (this.filters.onlyBookedByMe && !route.IsBookedByUser && !route.IsDriver) {
          return false
        }

        const routeDeparture = new Date(route.DepartureTime)
        if (hasValidFrom && routeDeparture < fromTime) {
          return false
        }

        if (hasValidTo && routeDeparture > toTime) {
          return false
        }

        if (Number(route.SeatsLeft || 0) < minSeats) {
          return false
        }

        if (stationQuery) {
          const address = String(route.StationAddress || '').toLowerCase()
          const postNo = String(route.StationPostNo || '').toLowerCase()
          const combined = `${address} ${postNo}`

          if (!combined.includes(stationQuery)) {
            return false
          }
        }

        return true
      })
    },
    sortedRoutes() {
      return [...this.filteredRoutes].sort((a, b) => {
        const aScore = (a.IsDriver ? 2 : 0) + (a.IsBookedByUser ? 1 : 0)
        const bScore = (b.IsDriver ? 2 : 0) + (b.IsBookedByUser ? 1 : 0)
        return bScore - aScore
      })
    },
  },
  methods: {
    async fetchRoutes() {
      try {
        this.loading = true
        this.error = null
        this.routes = await this.carpoolingController.getRouteOverview(this.uid)
      } catch (err) {
        this.error = `Kunne ikke hente ruter: ${err.message}`
      } finally {
        this.loading = false
      }
    },
    formatDeparture(value) {
      if (!value) return 'Ukendt afgangstid'

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return 'Ukendt afgangstid'
      }

      return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    resetFilters() {
      this.filters = {
        fromTime: '',
        toTime: '',
        minSeatsLeft: 0,
        stationQuery: '',
        onlyBookedByMe: false,
      }
    },
  },
  mounted() {
    const session = UserController.getUserSession()
    if (!session || !session.UID) {
      this.$router.push('/login')
      return
    }

    this.uid = Number(session.UID)
    this.fetchRoutes()
  },
}
</script>

<template>
  <div class="carpooling-page">
    <main class="carpooling-container">
      <section class="page-header">
        <div>
          <p class="eyebrow">Samkørsel</p>
          <h1 class="page-title">Tilgængelige samkørsler</h1>
          <p class="page-text">
            Find en ledig rute til nærmeste genbrugsstation.
          </p>
        </div>

        <div class="header-actions">
          <button class="button button-primary" type="button" @click="$router.push('/GenerateBooking')">
            Generer booking
          </button>

          <button class="button button-secondary" type="button" :disabled="loading" @click="fetchRoutes">
            {{ loading ? 'Indlæser...' : 'Opdater' }}
          </button>

          <button class="button button-secondary" type="button" @click="resetFilters">
            Nulstil filtre
          </button>
        </div>
      </section>

      <div class="content-grid">
        <section class="filter-panel" aria-label="Filtrér samkørsler">
          <h2 class="section-title">Filtre</h2>

          <div class="filter-grid">
            <div class="filter-group">
              <label for="fromTime">Fra afgang</label>
              <input id="fromTime" v-model="filters.fromTime" type="datetime-local" />
            </div>

            <div class="filter-group">
              <label for="toTime">Til afgang</label>
              <input id="toTime" v-model="filters.toTime" type="datetime-local" />
            </div>

            <div class="filter-group">
              <label for="minSeatsLeft">Minimum pladser tilbage</label>
              <input
                id="minSeatsLeft"
                v-model.number="filters.minSeatsLeft"
                type="number"
                min="0"
              />
            </div>

            <div class="filter-group">
              <label for="stationQuery">Destination eller postnr</label>
              <input
                id="stationQuery"
                v-model="filters.stationQuery"
                type="text"
                placeholder="Søg stationsadresse eller postnr"
              />
            </div>
          </div>

          <label class="checkbox-filter">
            <input v-model="filters.onlyBookedByMe" type="checkbox" />
            <span>Kun ruter booket af mig</span>
          </label>
        </section>

        <section class="routes-section">
          <div class="routes-header">
            <h2 class="section-title">Ruter</h2>
            <p class="route-count">{{ sortedRoutes.length }} fundet</p>
          </div>

          <div v-if="error" class="error-alert">
            <span class="error-icon">!</span>
            {{ error }}
          </div>

          <div v-if="loading" class="status-message">
            Indlæser ruter...
          </div>

          <div v-else-if="sortedRoutes.length === 0" class="empty-state">
            Ingen ruter fundet.
          </div>

          <div v-else class="routes-grid">
            <article
              v-for="route in sortedRoutes"
              :key="route.RouteID"
              class="route-card"
              :class="{ highlight: route.IsDriver || route.IsBookedByUser }"
              @click="$router.push('/carpooling/' + route.RouteID)"
            >
              <div class="route-card-top">
                <h3 class="route-title">Rute #{{ route.RouteID }}</h3>

                <div class="tag-row">
                  <span v-if="route.IsDriver" class="route-tag">Du er chauffør</span>
                  <span v-if="route.IsBookedByUser" class="route-tag">Booket af dig</span>
                </div>
              </div>

              <div class="route-info-grid">
                <p><strong>Chauffør:</strong> {{ route.DriverUsername }}</p>
                <p><strong>Afgang:</strong> {{ formatDeparture(route.DepartureTime) }}</p>
                <p>
                  <strong>Pladser tilbage:</strong>
                  {{ route.SeatsLeft }} / {{ route.AvailableSeats }}
                </p>
                <p><strong>Stationsadresse:</strong> {{ route.StationAddress }}</p>
                <p><strong>Postnr:</strong> {{ route.StationPostNo }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.carpooling-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
}

.carpooling-container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--gap-large);
  margin-bottom: var(--gap-large);
  padding: var(--gap-large);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow);
}

.eyebrow {
  margin: 0 0 var(--gap-xs);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.page-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  color: var(--color-text);
}

.page-text {
  max-width: 34rem;
  margin: var(--gap-small) 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--gap-small);
}

.button {
  min-height: 44px;
  border-radius: var(--border-radius-med);
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.button:hover {
  transform: translateY(-1px);
}

.button:focus-visible,
.route-card:focus-visible,
input:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.button-primary {
  background: var(--color-accent);
  color: var(--color-text);
  box-shadow: var(--shadow);
}

.button-primary:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
}

.button-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.button-secondary:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  border-color: var(--color-primary);
}

.button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: var(--gap-large);
  align-items: start;
}

.filter-panel,
.routes-section {
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow-card);
}

.filter-panel {
  position: sticky;
  top: calc(var(--header-height) + var(--gap-med));
}

.section-title {
  margin: 0 0 var(--gap-med);
  font-family: var(--font-heading);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.filter-grid {
  display: grid;
  gap: var(--gap-med);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.filter-group label,
.checkbox-filter {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.filter-group input {
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
}

.filter-group input::placeholder {
  color: var(--color-text-muted);
}

.filter-group input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.16);
}

.checkbox-filter {
  margin-top: var(--gap-med);
  display: inline-flex;
  align-items: center;
  gap: var(--gap-small);
  cursor: pointer;
}

.checkbox-filter input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
}

.routes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-med);
  margin-bottom: var(--gap-med);
}

.routes-header .section-title {
  margin-bottom: 0;
}

.route-count {
  margin: 0;
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius-round);
  background: var(--color-primary);
  color: var(--color-text-light);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: var(--gap-small);
  margin-bottom: var(--gap-med);
  padding: var(--gap-med);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  border: 2px solid var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.error-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: var(--border-radius-round);
  background: var(--color-accent);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

.status-message,
.empty-state {
  padding: var(--gap-med);
  background: var(--color-surface);
  border-radius: var(--border-radius-med);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

.routes-grid {
  display: grid;
  gap: var(--gap-med);
}

.route-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-med);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.route-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card);
}

.route-card.highlight {
  border: 2px solid var(--color-primary);
}

.route-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--gap-med);
  margin-bottom: var(--gap-med);
}

.route-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--gap-small);
}

.route-tag {
  border-radius: var(--border-radius-round);
  padding: 0.35rem 0.75rem;
  background: var(--color-primary);
  color: var(--color-text-light);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.route-info-grid {
  display: grid;
  gap: var(--gap-small);
}

.route-info-grid p {
  margin: 0;
  color: var(--color-text);
  line-height: 1.5;
}

.route-info-grid strong {
  font-weight: var(--font-weight-bold);
}

@media (max-width: 950px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .filter-panel {
    position: static;
  }

  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .carpooling-page {
    padding: var(--gap-med);
  }

  .page-header,
  .filter-panel,
  .routes-section {
    padding: var(--gap-med);
  }

  .page-title {
    font-size: var(--font-size-h2);
  }

  .page-text {
    font-size: var(--font-size-small);
  }

  .header-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .routes-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .route-card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-row {
    justify-content: flex-start;
  }
}
</style>

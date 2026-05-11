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
    if (!session || !session.userId) {
      this.$router.push('/login')
      return
    }

    this.uid = Number(session.userId)
    this.fetchRoutes()
  },
}
</script>

<template>
  <div class="generate-booking-page">
    <div class="carpoolings-container">
      <div class="generate-booking-card">
        <div class="header-row">
          <h1 class="generate-booking-title">Tilgængelige Samkørsler</h1>
          <div class="header-actions">
            <button class="btn-secondary" type="button" @click="$router.push('/GenerateBooking')">
              Generer Booking
            </button>
            <button class="btn-secondary" type="button" :disabled="loading" @click="fetchRoutes">
              {{ loading ? 'Indlæser...' : 'Opdater' }}
            </button>
            <button class="btn-secondary" type="button" @click="resetFilters">
              Nulstil filtre
            </button>
          </div>
        </div>

        <section class="filter-panel">
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

            <div class="filter-group filter-group-wide">
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

        <div v-if="error" class="error-alert">
          <i class="error-icon">!</i>
          {{ error }}
        </div>

        <div v-if="loading" class="loading-spinner">Indlæser ruter...</div>

        <div v-else-if="sortedRoutes.length === 0" class="empty-state">Ingen ruter fundet.</div>

        <div v-else class="routes-grid">
          <article
            v-for="route in sortedRoutes"
            :key="route.RouteID"
            class="route-card"
            :class="{ highlight: route.IsDriver || route.IsBookedByUser }"
            @click="$router.push('/carpooling/' + route.RouteID)"
          >
            <div class="route-card-top">
              <h2 class="route-title">Rute #{{ route.RouteID }}</h2>

              <div class="tag-row">
                <span v-if="route.IsDriver" class="route-tag is-driver">Du er chauffør</span>
                <span v-if="route.IsBookedByUser" class="route-tag is-booked">Booket af dig</span>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.generate-booking-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}

.carpoolings-container {
  width: 100%;
  max-width: 980px;
}

.generate-booking-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.generate-booking-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin: 0;
}

.error-alert {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  margin-bottom: 16px;
  font-weight: 500;
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.error-icon {
  margin-right: 8px;
  font-weight: bold;
}

.loading-spinner,
.empty-state {
  padding: 8px 0;
  font-weight: 600;
  color: var(--dark-text);
}

.filter-panel {
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid #d5e7e2;
  border-radius: var(--border-radius-med);
  background: #f6faf9;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group-wide {
  grid-column: span 2;
}

.filter-group label {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
}

.filter-group input {
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 0.95rem;
  background: #fff;
  color: #1a202c;
}

.filter-group input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.1);
}

.checkbox-filter {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a202c;
  font-weight: 600;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.route-card {
  background: #ffffff;
  border: 1px solid #d5e7e2;
  border-radius: var(--border-radius-med);
  padding: 14px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.route-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(47, 107, 95, 0.15);
}

.route-card.highlight {
  border-color: #2f6b5f;
  box-shadow: 0 10px 20px rgba(47, 107, 95, 0.18);
}

.route-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.route-title {
  margin: 0;
  color: var(--dark-text);
  font-size: 1.08rem;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.route-tag {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 700;
}

.route-tag.is-driver {
  background: #d8ede7;
  color: #1f4f45;
}

.route-tag.is-booked {
  background: #dbeafe;
  color: #1e3a8a;
}

.route-info-grid {
  display: grid;
  gap: 6px;
}

.route-info-grid p {
  margin: 0;
  color: #1a202c;
}

.btn-secondary {
  background: #e2e8f0;
  color: #1a202c;
  border: none;
  padding: 10px 14px;
  border-radius: var(--border-radius-med);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #cfd8e3;
}

.btn-secondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .generate-booking-page {
    padding: 10px;
  }

  .generate-booking-card {
    padding: 20px;
  }

  .header-row {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .filter-group-wide {
    grid-column: span 1;
  }

  .generate-booking-title {
    font-size: 1.5rem;
  }
}
</style>

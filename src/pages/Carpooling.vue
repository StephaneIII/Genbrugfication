<script>
import CarpoolingController from '../Controller/CarPooling.controller'
import UserController from '../Controller/User.controller.js'

export default {
  name: 'Carpooling',
  data() {
    return {
      carpoolingController: new CarpoolingController(),
      uid: null,
      route: null,
      loading: false,
      error: null,
      bookingForm: {
        address: '',
        passengerAmount: 1,
        weight: 0,
      },
      bookingLoading: false,
      bookingError: null,
      bookingSuccess: false,
    }
  },
  computed: {
    routeId() {
      return Number(this.$route.params.id)
    },
  },
  methods: {
    async fetchRoute() {
      try {
        this.loading = true
        this.error = null
        this.route = await this.carpoolingController.getRouteDetail(this.routeId, this.uid)
      } catch (err) {
        this.error = `Kunne ikke indlæse samkørsel: ${err.message}`
      } finally {
        this.loading = false
      }
    },
    formatDeparture(value) {
      if (!value) return 'Ukendt afgangstid'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return 'Ukendt afgangstid'
      return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    async handleBook() {
      this.bookingError = null
      this.bookingSuccess = false

      if (!this.bookingForm.address.trim()) {
        this.bookingError = 'Afhentingsadresse er påkrævet.'
        return
      }
      if (this.bookingForm.passengerAmount < 1) {
        this.bookingError = 'Mindst 1 passager er påkrævet.'
        return
      }
      if (this.bookingForm.weight < 0) {
        this.bookingError = 'Vægt kan ikke være negativ.'
        return
      }
      if (Number(this.bookingForm.passengerAmount) > Number(this.route.SeatsLeft)) {
        this.bookingError = `Kun ${this.route.SeatsLeft} plads(er) tilgængelig(e).`
        return
      }

      try {
        this.bookingLoading = true

        const stopData = {
          routeId: this.routeId,
          StopOrder: this.route.NextStopOrder,
          Address: this.bookingForm.address.trim(),
          UID: this.uid,
          PassengerAmount: Number(this.bookingForm.passengerAmount),
          Weight: Number(this.bookingForm.weight),
        }

        const result = await this.carpoolingController.createStop(stopData)

        if (result.success) {
          this.bookingSuccess = true
          this.bookingForm = { address: '', passengerAmount: 1, weight: 0 }
          await this.fetchRoute()
        } else {
          this.bookingError = result.error || 'Kunne ikke booke sædet.'
        }
      } catch (err) {
        this.bookingError = `Booking mislykkedes: ${err.message}`
      } finally {
        this.bookingLoading = false
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
    this.fetchRoute()
  },
}
</script>

<template>
  <div class="route-detail-page">
    <main class="detail-container">
      <button class="back-btn" type="button" @click="$router.back()">← Tilbage</button>

      <div v-if="loading" class="status-card">
        <p class="status-message">Indlæser samkørselsdetaljer...</p>
      </div>

      <div v-else-if="error" class="status-card">
        <div class="error-alert">
          <span class="alert-icon">!</span>
          {{ error }}
        </div>
      </div>

      <template v-else-if="route">
        <section class="page-header">
          <div>
            <p class="eyebrow">Samkørsel</p>
            <h1 class="page-title">Rute #{{ route.RouteID }}</h1>
            <p class="page-text">
              Se detaljer for ruten og book et sæde, hvis der er ledige pladser.
            </p>
          </div>

          <div class="tag-row">
            <span v-if="route.IsDriver" class="route-tag">Du er chauffør</span>
            <span v-if="route.IsBookedByUser" class="route-tag">Booket af dig</span>
          </div>
        </section>

          <div class="content-grid" :class="{ 'has-sidebar': !route.IsDriver && route.SeatsLeft > 0 }">          <section class="detail-card">
            <h2 class="section-title">Rutedetaljer</h2>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Chauffør</span>
                <span class="info-value">{{ route.DriverUsername }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Chaufførens telefon</span>
                <span class="info-value">
                  <a v-if="route.DriverTlf" :href="'tel:' + route.DriverTlf" class="phone-link">
                    {{ route.DriverTlf }}
                  </a>
                  <span v-else>—</span>
                </span>
              </div>

              <div class="info-item">
                <span class="info-label">Afgang</span>
                <span class="info-value">{{ formatDeparture(route.DepartureTime) }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Startadresse</span>
                <span class="info-value">{{ route.StartAddress }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Destination</span>
                <span class="info-value">{{ route.StationName || route.StationAddress }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Stationsadresse</span>
                <span class="info-value">{{ route.StationAddress }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Postnr</span>
                <span class="info-value">{{ route.StationPostNo }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Pladser tilbage</span>
                <span class="info-value">{{ route.SeatsLeft }} / {{ route.AvailableSeats }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Maksimal vægt</span>
                <span class="info-value">{{ route.MaxWeight }} kg</span>
              </div>

              <div v-if="route.Delay" class="info-item">
                <span class="info-label">Mulig forsinkelse</span>
                <span class="info-value">{{ route.Delay }} min</span>
              </div>

              <div class="info-item">
                <span class="info-label">Status</span>
                <span class="info-value">{{ route.Status }}</span>
              </div>
            </div>

            <div v-if="route.Stops && route.Stops.length > 0" class="stops-section">
              <h2 class="section-title">Bookede stop</h2>

              <div class="stops-list">
                <div v-for="stop in route.Stops" :key="stop.StopOrder" class="stop-item">
                  <span class="stop-order">#{{ stop.StopOrder }}</span>

                  <div class="stop-details">
                    <strong>{{ stop.Username }}</strong>

                    <a v-if="stop.Tlf" :href="'tel:' + stop.Tlf" class="phone-link">
                      {{ stop.Tlf }}
                    </a>

                    <span v-else class="no-phone">Ingen telefon registreret</span>
                    <span>{{ stop.Address }}</span>
                    <span>{{ stop.PassengerAmount }} passager(er) · {{ stop.Weight }} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            v-if="!route.IsDriver && route.SeatsLeft > 0"
            class="booking-card"
          >
            <h2 class="section-title">Book et sæde</h2>

            <div v-if="bookingSuccess" class="success-alert">
              <span class="alert-icon">✓</span>
              Dit sæde er blevet booket!
            </div>

            <div v-if="bookingError" class="error-alert">
              <span class="alert-icon">!</span>
              {{ bookingError }}
            </div>

            <form class="booking-form" @submit.prevent="handleBook">
              <div class="form-group">
                <label for="bookAddress">Din afhentingsadresse *</label>
                <input
                  id="bookAddress"
                  v-model="bookingForm.address"
                  type="text"
                  placeholder="Indtast adressen hvor vi skal hente dig"
                  required
                />
              </div>

              <div class="form-group">
                <label for="bookPassengers">Antal passagerer *</label>
                <input
                  id="bookPassengers"
                  v-model.number="bookingForm.passengerAmount"
                  type="number"
                  min="1"
                  :max="route.SeatsLeft"
                  required
                />
              </div>

              <div class="form-group">
                <label for="bookWeight">Samlet vægt af genstande (kg) *</label>
                <input
                  id="bookWeight"
                  v-model.number="bookingForm.weight"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <button type="submit" class="button button-primary" :disabled="bookingLoading">
                {{ bookingLoading ? 'Booker...' : 'Bekræft booking' }}
              </button>
            </form>
          </section>

          <section v-else-if="!route.IsDriver && route.SeatsLeft === 0" class="booking-card">
            <p class="empty-state">Denne rute er fuldt booket.</p>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.route-detail-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
}

.detail-container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.back-btn {
  min-height: 40px;
  margin-bottom: var(--gap-med);
  padding: 0.65rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-primary);
  color: var(--color-text-light);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-accent);
  color: var(--color-text);
  transform: translateY(-1px);
}

.back-btn:focus-visible,
.button:focus-visible,
input:focus-visible,
.phone-link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.tag-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--gap-small);
}

.route-tag {
  border-radius: var(--border-radius-round);
  padding: 0.4rem 0.8rem;
  background: var(--color-primary);
  color: var(--color-text-light);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-large);
  align-items: start;
}

.content-grid.has-sidebar {
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
}

.detail-card,
.booking-card,
.status-card {
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow-card);
}

.detail-card {
  width: 100%;
}

.booking-card {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-med);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  padding: var(--gap-med);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
}

.info-label {
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.info-value {
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.4;
}

.phone-link {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.stops-section {
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid rgba(31, 42, 36, 0.18);
}

.stops-list {
  display: grid;
  gap: var(--gap-small);
}

.stop-item {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-med);
  padding: var(--gap-med);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
}

.stop-order {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: var(--border-radius-round);
  background: var(--color-primary);
  color: var(--color-text-light);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.stop-details {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  color: var(--color-text);
  line-height: 1.4;
}

.no-phone {
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}

.booking-form {
  display: grid;
  gap: var(--gap-med);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.form-group label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.form-group input {
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

.form-group input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.16);
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
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.button:hover {
  transform: translateY(-1px);
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

.button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  gap: var(--gap-small);
  margin-bottom: var(--gap-med);
  padding: var(--gap-med);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

.error-alert {
  border: 2px solid var(--color-accent);
}

.success-alert {
  border: 2px solid var(--color-primary);
}

.alert-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: var(--border-radius-round);
  background: var(--color-primary);
  color: var(--color-text-light);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.error-alert .alert-icon {
  background: var(--color-accent);
  color: var(--color-text);
}

.status-message,
.empty-state {
  margin: 0;
  padding: var(--gap-med);
  background: var(--color-surface);
  border-radius: var(--border-radius-med);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

@media (max-width: 1100px) {
  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 950px) {
  .page-header {
    flex-direction: column;
  }

  .tag-row {
    justify-content: flex-start;
  }

  .content-grid,
  .content-grid.has-sidebar {
    grid-template-columns: 1fr;
  }

  .booking-card {
    position: static;
  }
}

@media (max-width: 600px) {
  .route-detail-page {
    padding: var(--gap-med);
  }

  .page-header,
  .detail-card,
  .booking-card,
  .status-card {
    padding: var(--gap-med);
  }

  .page-title {
    font-size: var(--font-size-h2);
  }

  .page-text {
    font-size: var(--font-size-small);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stop-item {
    flex-direction: column;
  }

  .button,
  .back-btn {
    width: 100%;
  }
}
</style>
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
          userId: this.uid,
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
    if (!session || !session.userId) {
      this.$router.push('/login')
      return
    }
    this.uid = Number(session.userId)
    this.fetchRoute()
  },
}
</script>

<template>
  <div class="generate-booking-page">
    <div class="detail-container">
      <button class="back-btn" type="button" @click="$router.back()">← Tilbage</button>

      <div v-if="loading" class="generate-booking-card">
        <p class="loading-spinner">Indlæser samkørselsdetaljer...</p>
      </div>

      <div v-else-if="error" class="generate-booking-card">
        <div class="error-alert">
          <i class="error-icon">!</i>
          {{ error }}
        </div>
      </div>

      <template v-else-if="route">
        <!-- Main info card -->
        <div class="generate-booking-card">
          <div class="header-row">
            <h1 class="generate-booking-title">Rute #{{ route.RouteID }}</h1>
            <div class="tag-row">
              <span v-if="route.IsDriver" class="route-tag is-driver">Du er chauffør</span>
              <span v-if="route.IsBookedByUser" class="route-tag is-booked">Booket af dig</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Chauffør</span>
                <span class="info-value">{{ route.DriverUsername }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Chaufförens telefon</span>
                <span class="info-value">
                  <a v-if="route.DriverTlf" :href="'tel:' + route.DriverTlf" class="phone-link">{{
                    route.DriverTlf
                  }}</a>
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
          </div>

          <!-- Stops list -->
          <div v-if="route.Stops && route.Stops.length > 0" class="stops-section">
            <h2 class="section-title">Bookede stop</h2>
            <div class="stops-list">
              <div v-for="stop in route.Stops" :key="stop.StopOrder" class="stop-item">
                <span class="stop-order">#{{ stop.StopOrder }}</span>
                <div class="stop-details">
                  <strong>{{ stop.Username }}</strong>
                  <a v-if="stop.Tlf" :href="'tel:' + stop.Tlf" class="phone-link">{{ stop.Tlf }}</a>
                  <span v-else class="no-phone">Ingen telefon registreret</span>
                  <span>{{ stop.Address }}</span>
                  <span>{{ stop.PassengerAmount }} passager(er) · {{ stop.Weight }} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking form — only for non-drivers with seats remaining -->
        <div
          v-if="!route.IsDriver && route.SeatsLeft > 0"
          class="generate-booking-card booking-card"
        >
          <h2 class="generate-booking-title" style="font-size: 1.4rem; margin-bottom: 16px">
            Book et sæde
          </h2>

          <div v-if="bookingSuccess" class="success-alert">
            <i class="success-icon">✓</i>
            Dit sæde er blevet booket!
          </div>

          <div v-if="bookingError" class="error-alert">
            <i class="error-icon">!</i>
            {{ bookingError }}
          </div>

          <form class="generate-booking-form" @submit.prevent="handleBook">
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

            <div class="form-buttons">
              <button type="submit" class="generate-booking-button" :disabled="bookingLoading">
                {{ bookingLoading ? 'Booker...' : 'Bekræft booking' }}
              </button>
            </div>
          </form>
        </div>

        <div v-else-if="!route.IsDriver && route.SeatsLeft === 0" class="generate-booking-card">
          <p class="empty-state">Denne rute er fuldt booket.</p>
        </div>
      </template>
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

.detail-container {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: var(--border-radius-med);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.generate-booking-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.booking-card {
  background: #fff;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.generate-booking-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin: 0;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.route-tag {
  border-radius: 999px;
  padding: 4px 12px;
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

.info-section {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 1rem;
  color: #1a202c;
  font-weight: 500;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark-text);
  margin-bottom: 10px;
}

.stops-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stop-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f6faf9;
  border: 1px solid #d5e7e2;
  border-radius: var(--border-radius-med);
  padding: 10px 12px;
}

.stop-order {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2f6b5f;
  min-width: 28px;
}

.stop-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.9rem;
  color: #1a202c;
}

.phone-link {
  color: #2f6b5f;
  font-weight: 600;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.no-phone {
  color: #a0aec0;
  font-size: 0.82rem;
}

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  margin-bottom: 16px;
  font-weight: 500;
}

.error-alert {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.success-alert {
  background-color: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.error-icon,
.success-icon {
  margin-right: 8px;
  font-weight: bold;
}

.loading-spinner,
.empty-state {
  font-weight: 600;
  color: var(--dark-text);
}

.generate-booking-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: var(--dark-text);
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  background: #fff;
  color: var(--dark-text);
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.1);
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.generate-booking-button {
  flex: 1;
  border: none;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  color: var(--white-text);
}

.generate-booking-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(47, 107, 95, 0.25);
}

.generate-booking-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .generate-booking-page {
    padding: 10px;
  }

  .generate-booking-card {
    padding: 20px;
  }

  .generate-booking-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

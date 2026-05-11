<script>
import CarpoolingController from '../Controller/CarPooling.controller'
import UserController from '../Controller/User.controller.js'

export default {
  name: 'GenerateBooking',
  data() {
    return {
      carpoolingController: new CarpoolingController(),
      uid: null,
      formData: {
        startAddress: '',
        recyclingStationId: null,
        availableSeats: 1,
        maxWeight: 0,
        departureTime: '',
        delay: 0,
      },
      recyclingStations: [],
      searchPostalNumber: '',
      showDropdown: false,
      loading: false,
      error: null,
      success: false,
      successMessage: '',
    }
  },
  computed: {
    filteredStationsBySearch() {
      if (!this.searchPostalNumber.trim()) {
        return this.recyclingStations
      }
      return this.recyclingStations.filter((station) =>
        station.PostNo.toString().includes(this.searchPostalNumber),
      )
    },
    selectedStationDisplay() {
      const selected = this.recyclingStations.find(
        (station) => station.RecyclingStationID === this.formData.recyclingStationId,
      )
      return selected
        ? `${selected.Name} (${selected.PostNo}) - ${selected.Address}`
        : 'Vælg en genbrugningsstation'
    },
  },
  methods: {
    async fetchRecyclingStations() {
      try {
        this.loading = true
        const response = await fetch(`${this.carpoolingController.apiBaseUrl}/recyclingstations`)
        if (!response.ok) {
          throw new Error('Kunne ikke hente genbrugningsstationer')
        }
        this.recyclingStations = await response.json()
      } catch (err) {
        this.error = `Kunne ikke indlæse genbrugningsstationer: ${err.message}`
      } finally {
        this.loading = false
      }
    },
    selectStation(stationId) {
      this.formData.recyclingStationId = stationId
      this.showDropdown = false
      this.searchPostalNumber = ''
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdown() {
      this.showDropdown = false
    },
    handleReset() {
      this.formData = {
        startAddress: '',
        recyclingStationId: null,
        availableSeats: 1,
        maxWeight: 0,
        departureTime: '',
        delay: 0,
      }
      this.searchPostalNumber = ''
      this.error = null
      this.success = false
      this.successMessage = ''
      this.showDropdown = false
    },
    async handleSubmit() {
      if (!this.formData.startAddress.trim()) {
        this.error = 'Startadresse er påkrævet'
        return
      }
      if (!this.formData.recyclingStationId) {
        this.error = 'Vælg venligst en genbrugningsstation'
        return
      }
      if (this.formData.availableSeats < 1) {
        this.error = 'Tilgængelige pladser skal være mindst 1'
        return
      }
      if (this.formData.maxWeight <= 0) {
        this.error = 'Maksimal vægt skal være større end 0'
        return
      }
      if (!this.formData.departureTime) {
        this.error = 'Afgangstid er påkrævet'
        return
      }

      try {
        this.loading = true
        this.error = null

        const routeData = {
          UID: Number(this.uid),
          StartAddress: this.formData.startAddress,
          RecyclingStationID: this.formData.recyclingStationId,
          AvailableSeats: Number(this.formData.availableSeats),
          MaxWeight: Number(this.formData.maxWeight),
          DepartureTime: this.formData.departureTime,
          Delay: this.formData.delay ? Number(this.formData.delay) : null,
          Status: 'Scheduled',
        }

        const response = await this.carpoolingController.createRoute(routeData)

        const createdRouteId = response?.RouteID || response?.id
        if (createdRouteId) {
          this.success = true
          this.successMessage = `Rute blev tilføjet til databasen (ID: ${createdRouteId}).`
          this.formData = {
            startAddress: '',
            recyclingStationId: null,
            availableSeats: 1,
            maxWeight: 0,
            departureTime: '',
            delay: 0,
          }
          this.searchPostalNumber = ''

          setTimeout(() => {
            this.success = false
            this.successMessage = ''
          }, 2500)
        } else {
          this.success = false
          this.error =
            response?.error || response?.message || 'Rute blev ikke tilføjet til databasen.'
        }
      } catch (err) {
        this.error = `Kunne ikke oprette rute: ${err.message}`
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    const session = UserController.getUserSession()
    if (!session || !session.userId) {
      this.$router.push('/login')
      return
    }

    this.uid = session.userId
    this.fetchRecyclingStations()
  },
}
</script>

<template>
  <div class="generate-booking-page">
    <div class="generate-booking-container">
      <div class="generate-booking-card">
        <div class="header">
          <h1 class="generate-booking-title">Generer ny samkørselsrute</h1>
        </div>

        <div v-if="error" class="error-alert">
          <i class="error-icon">!</i>
          {{ error }}
        </div>

        <div v-if="success" class="success-alert">
          <i class="success-icon">✓</i>
          {{ successMessage || 'Rute oprettet med succes!' }}
        </div>

        <div v-if="loading && !success" class="loading-spinner">Behandler...</div>

        <form
          v-if="!loading || success"
          class="generate-booking-form"
          @submit.prevent="handleSubmit"
        >
          <div class="form-group">
            <label for="startAddress">Startadresse *</label>
            <input
              id="startAddress"
              v-model="formData.startAddress"
              type="text"
              placeholder="Indtast din startadresse"
              required
            />
          </div>

          <div class="form-group">
            <label>Genbrugningsstation *</label>
            <div class="dropdown-wrapper">
              <button type="button" class="dropdown-toggle" @click="toggleDropdown">
                <span class="selected-station">{{ selectedStationDisplay }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>

              <div v-if="showDropdown" class="dropdown-menu">
                <div class="search-box">
                  <input
                    v-model="searchPostalNumber"
                    type="text"
                    placeholder="Søg efter postnummer..."
                    class="search-input"
                  />
                </div>

                <div class="dropdown-options">
                  <div v-if="filteredStationsBySearch.length === 0" class="no-results">
                    Ingen stationer fundet
                  </div>

                  <button
                    v-for="station in filteredStationsBySearch"
                    :key="station.RecyclingStationID"
                    type="button"
                    class="dropdown-option"
                    :class="{ active: formData.recyclingStationId === station.RecyclingStationID }"
                    @click="selectStation(station.RecyclingStationID)"
                  >
                    <div class="station-name">{{ station.Name }}</div>
                    <div class="station-info">
                      <span class="postal">{{ station.PostNo }}</span>
                      <span class="address">{{ station.Address }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="availableSeats">Tilgængelige pladser *</label>
            <input
              id="availableSeats"
              v-model.number="formData.availableSeats"
              type="number"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label for="maxWeight">Maksimal vægt (kg) *</label>
            <input
              id="maxWeight"
              v-model.number="formData.maxWeight"
              type="number"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div class="form-group">
            <label for="departureTime">Afgangstid *</label>
            <input
              id="departureTime"
              v-model="formData.departureTime"
              type="datetime-local"
              required
            />
          </div>

          <div class="form-group">
            <label for="delay">Mulig forsinkelse (minutter)</label>
            <input id="delay" v-model.number="formData.delay" type="number" min="0" step="0.1" />
          </div>

          <div class="form-buttons">
            <button type="submit" class="generate-booking-button" :disabled="loading">
              {{ loading ? 'Opretter rute...' : 'Opret rute' }}
            </button>
            <button type="button" class="btn-secondary" @click="handleReset">Nulstil</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDropdown" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<style scoped>
.generate-booking-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}

.generate-booking-container {
  width: 100%;
  max-width: 560px;
}

.generate-booking-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.generate-booking-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin: 0;
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

.loading-spinner {
  margin-bottom: 16px;
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
}

.form-group label {
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.form-group input,
.dropdown-toggle,
.search-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--white-text);
  color: var(--dark-text);
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.dropdown-toggle:focus,
.search-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.1);
}

.form-group input[type='number'] {
  color-scheme: light;
}

.form-group input[type='number']::-webkit-outer-spin-button,
.form-group input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
  filter: invert(36%) sepia(29%) saturate(885%) hue-rotate(118deg) brightness(88%) contrast(92%);
}

.form-group input[type='number']:focus::-webkit-outer-spin-button,
.form-group input[type='number']:focus::-webkit-inner-spin-button {
  filter: invert(32%) sepia(37%) saturate(980%) hue-rotate(125deg) brightness(84%) contrast(96%);
}

.form-group input[type='datetime-local'] {
  background-color: #ffffff;
  color-scheme: light;
}

.form-group input[type='datetime-local']::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
  filter: invert(36%) sepia(29%) saturate(885%) hue-rotate(118deg) brightness(88%) contrast(92%);
}

.form-group input[type='datetime-local']::-webkit-datetime-edit,
.form-group input[type='datetime-local']::-webkit-datetime-edit-fields-wrapper {
  background-color: #ffffff;
  color: var(--dark-text);
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-toggle {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.dropdown-arrow {
  color: var(--secondary-color);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #f6faf9;
  border: 1px solid #d5e7e2;
  border-radius: var(--border-radius-med);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  z-index: 1001;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-options {
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 0;
  border-bottom: 1px solid #e8eeec;
  background: transparent;
  cursor: pointer;
  color: var(--dark-text);
}

.dropdown-option:hover {
  background: #e8f3ef;
}

.dropdown-option.active {
  background: #d8ede7;
}

.station-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.station-info {
  display: flex;
  gap: 8px;
  color: #4a5568;
  font-size: 0.9rem;
}

.postal {
  font-weight: 600;
}

.no-results {
  padding: 14px;
  text-align: center;
  color: #718096;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.generate-booking-button,
.btn-secondary {
  border: none;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-booking-button {
  flex: 1;
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

.btn-secondary {
  background: #e2e8f0;
  color: #1a202c;
}

.btn-secondary:hover {
  background: #cfd8e3;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

@media (max-width: 768px) {
  .generate-booking-page {
    padding: 10px;
  }

  .generate-booking-card {
    padding: 24px;
  }

  .generate-booking-title {
    font-size: 1.5rem;
  }

  .form-buttons {
    flex-direction: column;
  }
}
</style>

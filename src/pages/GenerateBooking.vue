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
            this.$router.push('/Carpoolings')
          }, 500)
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
    if (!session || !session.UID) {
      this.$router.push('/login')
      return
    }

    this.uid = session.UID
    this.fetchRecyclingStations()
  },
}
</script>

<template>
  <div class="generate-route-page">
    <main class="generate-route-container">
      <button class="back-btn" type="button" @click="$router.back()">← Tilbage</button>

      <section class="page-header">
        <div>
          <p class="eyebrow">Samkørsel</p>
          <h1 class="page-title">Generer ny samkørselsrute</h1>
          <p class="page-text">
            Opret en rute, så andre brugere kan booke en plads til genbrugsstationen.
          </p>
        </div>
      </section>

      <section class="form-card">
        <div v-if="error" class="error-alert">
          <span class="alert-icon">!</span>
          {{ error }}
        </div>

        <div v-if="success" class="success-alert">
          <span class="alert-icon">✓</span>
          {{ successMessage || 'Rute oprettet med succes!' }}
        </div>

        <div v-if="loading && !success" class="status-message">Behandler...</div>

        <form v-if="!loading || success" class="generate-route-form" @submit.prevent="handleSubmit">
          <div class="form-group form-group-wide">
            <label for="startAddress">Startadresse *</label>
            <input
              id="startAddress"
              v-model="formData.startAddress"
              type="text"
              placeholder="Indtast din startadresse"
              required
            />
          </div>

          <div class="form-group form-group-wide">
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
                    <span class="station-name">{{ station.Name }}</span>

                    <span class="station-info">
                      <span class="postal">{{ station.PostNo }}</span>
                      <span class="address">{{ station.Address }}</span>
                    </span>
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

          <div class="form-buttons form-group-wide">
            <button type="submit" class="button button-primary" :disabled="loading">
              {{ loading ? 'Opretter rute...' : 'Opret rute' }}
            </button>

            <button type="button" class="button button-secondary" @click="handleReset">
              Nulstil
            </button>
          </div>
        </form>
      </section>
    </main>

    <div v-if="showDropdown" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<
<style scoped>
.generate-route-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
}

.generate-route-container {
  width: 100%;
  max-width: 900px;
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
.dropdown-toggle:focus-visible,
.dropdown-option:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.page-header {
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
  color: var(--color-text);
  line-height: 1.15;
}

.page-text {
  max-width: 40rem;
  margin: var(--gap-small) 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.form-card {
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow-card);
}

.generate-route-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap-med);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.form-group-wide {
  grid-column: 1 / -1;
}

.form-group label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.form-group input,
.dropdown-toggle,
.search-input {
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.form-group input::placeholder,
.search-input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus,
.dropdown-toggle:focus,
.search-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.16);
}

.form-group input[type='number'],
.form-group input[type='datetime-local'] {
  color-scheme: light;
}

.form-group input[type='datetime-local']::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
  filter: invert(36%) sepia(29%) saturate(885%) hue-rotate(118deg) brightness(88%) contrast(92%);
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-med);
  text-align: left;
  cursor: pointer;
}

.selected-station {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: var(--color-primary);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + var(--gap-small));
  left: 0;
  right: 0;
  z-index: 1001;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  box-shadow: var(--shadow-card);
}

.search-box {
  padding: var(--gap-small);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.dropdown-options {
  max-height: 260px;
  overflow-y: auto;
}

.dropdown-option {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  padding: var(--gap-med);
  border: 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.dropdown-option:last-child {
  border-bottom: 0;
}

.dropdown-option:hover,
.dropdown-option.active {
  background: var(--color-primary);
  color: var(--color-text-light);
}

.station-name {
  font-weight: var(--font-weight-bold);
}

.station-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-small);
  color: inherit;
  font-size: var(--font-size-small);
  line-height: 1.4;
}

.postal {
  font-weight: var(--font-weight-bold);
}

.no-results {
  padding: var(--gap-med);
  color: var(--color-text-muted);
  text-align: center;
  font-weight: var(--font-weight-bold);
}

.form-buttons {
  display: flex;
  gap: var(--gap-small);
  margin-top: var(--gap-small);
}

.button {
  min-height: 46px;
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

.button-primary {
  flex: 1;
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

.error-alert,
.success-alert,
.status-message {
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

.status-message {
  border: 1px solid var(--color-border);
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

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

@media (max-width: 700px) {
  .generate-route-page {
    padding: var(--gap-med);
  }

  .page-header,
  .form-card {
    padding: var(--gap-med);
  }

  .page-title {
    font-size: var(--font-size-h2);
  }

  .page-text {
    font-size: var(--font-size-small);
  }

  .generate-route-form {
    grid-template-columns: 1fr;
  }

  .form-buttons {
    flex-direction: column;
  }

  .button,
  .back-btn {
    width: 100%;
  }

  .selected-station {
    white-space: normal;
  }
}
</style>

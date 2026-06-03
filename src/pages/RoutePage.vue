<script>
import BaseButton from '../Components/BaseButton.vue'
import StationMap from '../Components/StationMap.vue'

export default {
  name: 'RoutePage',

  components: {
    BaseButton,
    StationMap,
  },

  data() {
    return {
      station: null,
      startPoint: '',
      routeOrigin: null,
      loading: false,
      errorMessage: '',
      isPanelMinimized: false,
    }
  },

  async mounted() {
    const stationId = Number(this.$route.params.stationId)
    this.loading = true

    try {
      const res = await fetch('http://localhost:3001/api/recyclingstations')

      if (!res.ok) {
        throw new Error('Kunne ikke hente genbrugsstation')
      }

      const stations = await res.json()

      const apiStation = stations.find(
        (station) => station.RecyclingStationID === stationId,
      )

      if (!apiStation) {
        this.errorMessage = 'Ingen station fundet.'
        return
      }

      this.station = {
        id: apiStation.RecyclingStationID,
        name: apiStation.Name,
        address: apiStation.Address,
        lat: apiStation.YCoord,
        lng: apiStation.XCoord,
        imageUrl: apiStation.ImageUrl,
      }
    } catch (error) {
      this.errorMessage = error.message
    } finally {
      this.loading = false
    }
  },

  methods: {
    togglePanel() {
      const isMobileOrTablet = window.matchMedia('(max-width: 1023px)').matches

      if (!isMobileOrTablet) return

      this.isPanelMinimized = !this.isPanelMinimized
    },

    async handleOpenRoute() {
      if (!this.station) return

      const trimmedStartPoint = this.startPoint.trim()

      if (!trimmedStartPoint) {
        this.errorMessage = 'Indtast et startpunkt'
        return
      }

      try {
        this.errorMessage = ''

        const query = encodeURIComponent(`${trimmedStartPoint}, Denmark`)

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        )

        const data = await res.json()

        if (!data.length) {
          this.errorMessage = 'Kunne ikke finde adressen'
          return
        }

        this.routeOrigin = {
          lat: Number(data[0].lat),
          lng: Number(data[0].lon),
        }
      } catch (error) {
        this.errorMessage = 'Kunne ikke hente rute'
      }
    },
  },
}
</script>

<template>
  <v-main class="route-page">
    <section v-if="loading" class="route-content">
      <p class="error-message">Henter station...</p>
    </section>

    <section v-else-if="station" class="route-content">
      <div class="map-wrapper">
        <StationMap
          :lat="station.lat"
          :lng="station.lng"
          :station-name="station.name"
          :station-address="station.address"
          :zoom="13"
          :show-popup="false"
          :show-zoom-control="false"
          :route-origin="routeOrigin"
          map-id="route-page-map"
        />
      </div>

      <section
        class="route-panel"
        :class="{ 'route-panel--minimized': isPanelMinimized }"
      >
        <button
          class="drag-handle"
          type="button"
          :aria-label="isPanelMinimized ? 'Åbn rutefelt' : 'Minimer rutefelt'"
          @click="togglePanel"
        ></button>

        <div class="route-form">
          <div class="route-input-group">
            <span class="route-dot start-dot"></span>

            <input
              v-model="startPoint"
              type="text"
              placeholder="Vælg startpunkt"
              class="route-input"
            />
          </div>

          <div class="route-line"></div>

          <div class="route-input-group">
            <span class="route-dot end-dot"></span>

            <input
              :value="station.address"
              type="text"
              class="route-input"
              readonly
            />
          </div>

          <p v-if="errorMessage" class="form-error-message">
            {{ errorMessage }}
          </p>

          <div class="route-button-wrapper">
            <BaseButton @click="handleOpenRoute">
              Find rute
            </BaseButton>
          </div>
        </div>
      </section>
    </section>

    <section v-else class="route-content">
      <p class="error-message">{{ errorMessage }}</p>
    </section>
  </v-main>
</template>

<style scoped>
.route-page {
  width: 100%;
  min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  background: var(--color-primary);
  overflow: hidden;
}

.route-content {
  position: relative;
  width: 100%;
  min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  background: var(--color-primary);
}

.map-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: calc(100dvh - var(--header-height) - var(--footer-height));
  min-height: 520px;
  background: var(--color-surface-muted);
}

/* Bottom sheet */
.route-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--footer-height);
  z-index: 20;
  background: var(--color-primary);
  color: var(--color-text-light);
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  padding: var(--gap-large) var(--gap-med) var(--gap-xl);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
  transform: translateY(0);
  transition:
    transform var(--transition-med),
    padding var(--transition-med),
    box-shadow var(--transition-med);
}

/* Minimized bottom tab */
.route-panel--minimized {
  padding: var(--gap-med);
  transform: translateY(calc(100% - 44px));
  box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.16);
}

.drag-handle {
  display: block;
  width: 72px;
  height: 6px;
  border: none;
  border-radius: var(--border-radius-round);
  background: rgba(255, 255, 255, 0.75);
  margin: 0 auto var(--gap-large);
  padding: 0;
  cursor: pointer;
  transition:
    width var(--transition-fast),
    background var(--transition-fast),
    transform var(--transition-fast);
}

.drag-handle:hover {
  width: 88px;
  background: var(--color-text-light);
  transform: translateY(-1px);
}

.drag-handle:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 6px;
}

.route-panel--minimized .drag-handle {
  margin-bottom: var(--gap-large);
}

.route-form {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: var(--gap-large);
  border-radius: var(--border-radius-large);
  transition:
    opacity var(--transition-fast),
    visibility var(--transition-fast);
}

.route-panel--minimized .route-form {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.route-input-group {
  display: flex;
  align-items: center;
  gap: var(--gap-med);
}

.route-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--border-radius-round);
  flex-shrink: 0;
}

.start-dot {
  border: 4px solid var(--color-secondary);
  background: transparent;
}

.end-dot {
  background: var(--color-accent);
}

.route-line {
  width: 2px;
  height: 28px;
  background: var(--color-secondary);
  margin: var(--gap-small) 0 var(--gap-small) 6px;
}

.route-input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-round);
  padding: 0.85rem var(--gap-med);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  color: var(--color-text);
  outline: none;
  box-shadow: var(--shadow);
}

.route-input:focus {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-card);
}

.route-input::placeholder {
  color: var(--color-text-muted);
}

.form-error-message {
  margin: var(--gap-med) 0 0;
  padding-left: calc(14px + var(--gap-med));
  color: var(--color-text-light);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

/* Button aligned with inputs */
.route-button-wrapper {
  width: calc(100% - 14px - var(--gap-med));
  margin-top: var(--gap-large);
  margin-left: calc(14px + var(--gap-med));
}

.route-button-wrapper :deep(button) {
  width: 100%;
  min-height: 44px;
  border-radius: var(--border-radius-round);
  background: var(--color-accent);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.route-button-wrapper :deep(button:hover) {
  background: var(--color-text-light);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.error-message {
  color: var(--color-text-light);
  padding: var(--gap-large);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

/* Tablet */
/* Tablet */
@media (min-width: 768px) {
  .route-panel {
    padding: var(--gap-large) var(--gap-large);
  }

  .route-panel--minimized {
    padding: var(--gap-med) var(--gap-large);
  }

  .drag-handle {
    margin-bottom: var(--gap-med);
  }

  .route-form {
    max-width: 520px;
    padding: var(--gap-med) var(--gap-large);
  }

  .route-input {
    padding: 0.75rem var(--gap-med);
    font-size: var(--font-size-body);
  }

  .route-line {
    height: 22px;
    margin: var(--gap-xs) 0 var(--gap-xs) 6px;
  }

  .route-button-wrapper {
    margin-top: var(--gap-med);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .route-content {
    display: grid;
    grid-template-columns: 68% 32%;
    min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  }

  .map-wrapper {
    height: 100%;
    min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  }

  .route-panel {
    position: relative;
    left: auto;
    right: auto;
    bottom: auto;
    z-index: 20;
    border-radius: 0;
    padding: var(--gap-xl) var(--gap-large);
    box-shadow: none;
    transform: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Disable minimized state on desktop */
  .route-panel--minimized {
    transform: none;
    padding: var(--gap-xl) var(--gap-large);
  }

  .drag-handle {
    display: none;
  }

  .route-form {
    max-width: 100%;
    margin: 0;
    padding: var(--gap-large);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .route-panel--minimized .route-form {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .route-panel {
    padding: var(--gap-xl);
  }
}
</style>
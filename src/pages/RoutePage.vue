<script>
import BaseButton from '../Components/BaseButton.vue'
import StationMap from '../Components/StationMap.vue'

export default {
  name: 'RoutePage',
  components: {
    BaseButton,
    StationMap
  },
  data() {
    return {
      station: null,
      startPoint: '',
      routeOrigin: null,
      loading: false,
      errorMessage: '',
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
        station => station.RecyclingStationID === stationId
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
        imageUrl: apiStation.ImageUrl
      }
    } catch (error) {
      this.errorMessage = error.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    // handleOpenRoute() {
    //   if (!this.station) return

    //   const destination = encodeURIComponent(this.station.address)

    //   if (this.startPoint.trim()) {
    //     const origin = encodeURIComponent(this.startPoint.trim())
    //     window.open(
    //       `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
    //       '_blank'
    //     )
    //   } else {
    //     window.open(
    //       `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    //       '_blank'
    //     )
    //   }
    // }
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
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
    )

    const data = await res.json()

    if (!data.length) {
      this.errorMessage = 'Kunne ikke finde adressen'
      return
    }

    this.routeOrigin = {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon)
    }
  } catch (error) {
    this.errorMessage = 'Kunne ikke hente rute'
  }
}
  }
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

      <section class="route-panel">
        <div class="drag-handle"></div>

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
  min-height: 100%;
  background: var(--color-primary);
}

.route-content {
  width: 100%;
  min-height: 100%;
  background: var(--color-primary);
}

.map-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 320px;
  background: var(--color-surface-muted);
}

.route-panel {
  position: relative;
  z-index: 20;
  margin-top: -24px;
  background: var(--color-primary);
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  padding: var(--gap-large) var(--gap-med);
  color: var(--color-text-light);
}

.drag-handle {
  width: 72px;
  height: 6px;
  border-radius: var(--border-radius-round);
  background: rgba(255, 255, 255, 0.75);
  margin: 0 auto var(--gap-large);
}

.route-form {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  /* background: var(--color-surface-muted); */
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  /* box-shadow: var(--shadow-card); */
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
}

.route-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.route-input::placeholder {
  color: var(--color-text-muted);
}

.route-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--gap-large);
}

.route-button-wrapper :deep(button) {
  width: 100%;
  border-radius: var(--border-radius-round);
}

.error-message {
  color: var(--color-text-light);
  padding: var(--gap-large);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

/* Tablet - 768px */
@media (min-width: 768px) {
  .map-wrapper {
    height: 360px;
  }

  .route-panel {
    margin-top: -28px;
    padding: var(--gap-xl) var(--gap-large);
  }

  .route-form {
    max-width: 520px;
    padding: var(--gap-xl);
  }

  .route-input {
    font-size: var(--font-size-body);
  }
}

/* Desktop - 1024px */
@media (min-width: 1024px) {
  .route-content {
    display: grid;
    grid-template-columns: 68% 32%;
    min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  }

  .map-wrapper {
    height: 100%;
    min-height: 560px;
  }

  .route-panel {
    margin-top: 0;
    border-radius: 0;
    padding: var(--gap-large);
    display: flex;
    align-items: flex-start;
  }

  .drag-handle {
    display: none;
  }

  .route-form {
    max-width: 100%;
    margin: 0;
    padding: var(--gap-large);
  }
}

/* Large desktop - 1200px */
@media (min-width: 1200px) {
  .route-panel {
    padding: var(--gap-xl);
  }
}
</style>
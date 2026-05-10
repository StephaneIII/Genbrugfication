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

<style scoped>
.route-page {
  min-height: 100vh;
  background-color: var(--secondary-color);
  display: flex;
  flex-direction: column;
}

.route-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  width: 100%;
  height: 250px;
  position: relative;
  z-index: 1;
}

.route-panel {
  position: relative;
  z-index: 2;
  margin-top: -28px;
  background-color: var(--secondary-color);
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 16px 20px 32px;
  flex: 1;
}

.drag-handle {
  width: 72px;
  height: 6px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.85);
  margin: 0 auto 24px;
}

.route-form {
  max-width: 360px;
  margin: 0 auto;
}

.route-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.route-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.start-dot {
  border: 4px solid rgba(255, 255, 255, 0.35);
  background: transparent;
}

.end-dot {
  background-color: #4d8dff;
}

.route-line {
  width: 2px;
  height: 26px;
  background-color: rgba(255, 255, 255, 0.6);
  margin: 6px 0 6px 6px;
}

.route-input {
  width: 100%;
  background-color: #d9d9d9;
  border: none;
  border-radius: 999px;
  padding: 14px 18px;
  font-size: 1rem;
  color: #4a4a4a;
  outline: none;
}

.route-input::placeholder {
  color: #6a6a6a;
}

.route-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}

.error-message {
  color: white;
  padding: 24px 16px;
  font-weight: 600;
}
</style>
<script>
import BaseButton from '../Components/BaseButton.vue'
import StationMap from '../Components/StationMap.vue'

export default {
  name: 'MapPage',
  components: {
    BaseButton,
    StationMap
  },
  data() {
    return {
      station: null,
      areaName: '',
      errorMessage: '',
      loading: false
    }
  },
  async mounted() {
    const postcode = this.$route.params.postcode
    this.areaName = postcode
    this.loading = true

    try {
      const res = await fetch('http://localhost:3001/api/recyclingstations')

      if (!res.ok) {
        throw new Error('Kunne ikke hente genbrugsstationer')
      }

      const stations = await res.json()

      const matchedStations = stations.filter(
        station => String(station.PostNo) === String(postcode)
      )

      if (matchedStations.length > 0) {
        const apiStation = matchedStations[0]

        this.station = {
          id: apiStation.RecyclingStationID,
          name: apiStation.Name,
          address: apiStation.Address,
          lat: apiStation.YCoord,
          lng: apiStation.XCoord,
          imageUrl: apiStation.ImageUrl
        }

        const areaNames = {
          '4000': 'Roskilde',
          '4040': 'Jyllinge',
          '4130': 'Viby Sjælland'
        }

        this.areaName = areaNames[postcode] || postcode
      } else {
        this.errorMessage = 'Ingen station fundet for dette postnummer.'
      }
    } catch (error) {
      this.errorMessage = error.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    handleFindRoute() {
      const postcode = this.$route.params.postcode
      this.$router.push(`/route/${postcode}/${this.station.id}`)
    }
  }
}
</script>

<template>
  <v-main class="map-page">
    <section v-if="loading" class="map-content">
      <p class="error-message">Henter station...</p>
    </section>

    <section v-else-if="station" class="map-content">
      <div class="map-wrapper">
        <StationMap
          :lat="station.lat"
          :lng="station.lng"
          :station-name="station.name"
          :station-address="station.address"
          :zoom="13"
          map-id="map-page-map"
        />
      </div>

      <section class="station-panel">
        <h2 class="station-title">1 genbrugsstation i {{ areaName }}</h2>

        <article class="station-card">
          <div class="station-image-wrapper">
            <img
              :src="station.imageUrl"
              :alt="station.name"
              class="station-image"
            />
          </div>

          <div class="station-info">
            <h3>{{ station.name }}</h3>
            <p>{{ station.address }}</p>
          </div>

          <div class="route-button-wrapper">
            <BaseButton @click="handleFindRoute">
              Find rute
            </BaseButton>
          </div>
        </article>
      </section>
    </section>

    <section v-else class="map-content">
      <p class="error-message">{{ errorMessage }}</p>
    </section>
  </v-main>
</template>

<style scoped>
.map-page {
  width: 100%;
  min-height: 100%;
  background: var(--color-primary);
}

.map-content {
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

.station-panel {
  position: relative;
  z-index: 20;
  margin-top: -20px;
  background: var(--color-primary);
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  padding: var(--gap-med);
  color: var(--color-text-light);
}

.station-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  margin-bottom: var(--gap-med);
  color: var(--color-text-light);
}

.station-card {
  width: 100%;
  color: var(--color-text-light);
}

.station-image-wrapper {
  width: 100%;
  height: 180px;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  margin-bottom: var(--gap-med);
  box-shadow: var(--shadow);
}

.station-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.station-info h3 {
  font-family: var(--font-heading);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--gap-xs);
}

.station-info p {
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  line-height: 1.4;
  color: var(--color-text-light);
}

.route-button-wrapper {
  margin-top: var(--gap-med);
}

.route-button-wrapper :deep(button) {
  min-width: 120px;
  border-radius: var(--border-radius-med);
  font-size: var(--font-size-small);
}

.error-message {
  color: var(--color-text-light);
  padding: var(--gap-large);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

/* Tablet */
@media (min-width: 562px) {
  .map-wrapper {
    height: 360px;
  }

  .station-panel {
    margin-top: -28px;
    padding: var(--gap-large);
  }

  .station-title {
    font-size: var(--font-size-h2);
    margin-bottom: var(--gap-med);
  }

  .station-image-wrapper {
    height: 220px;
    border-radius: var(--border-radius-large);
  }

  .station-info h3 {
    font-size: var(--font-size-h3);
  }

  .station-info p {
    font-size: var(--font-size-small);
  }
}

/* Desktop */
@media (min-width: 768px) {
  .map-content {
    display: grid;
    grid-template-columns: 68% 32%;
    min-height: calc(100dvh - var(--header-height) - var(--footer-height));
  }

  .map-wrapper {
    height: 100%;
    min-height: 560px;
  }

  .station-panel {
    margin-top: 0;
    border-radius: 0;
    padding: var(--gap-med);
    overflow-y: auto;
  }

  .station-title {
    font-size: var(--font-size-h3);
    margin-bottom: var(--gap-med);
  }

  .station-image-wrapper {
    height: 170px;
  }

  .station-info h3 {
    font-size: var(--font-size-body);
  }

  .station-info p {
    font-size: var(--font-size-small);
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .station-panel {
    padding: var(--gap-large);
  }
}
</style>
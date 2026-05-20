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
  min-height: 100vh;
  background-color: #2f6b5f;
  display: flex;
  flex-direction: column;
}

.map-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  width: 100%;
  height: 460px;
}

.station-panel {
  margin-top: -24px;
  background-color: #2f6b5f;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 20px 16px 32px;
  position: relative;
  z-index: 1000;
}

.station-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 16px;
}

.station-card {
  color: white;
}

.station-image-wrapper {
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 16px;
}

.station-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

.station-info h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.station-info p {
  font-size: 1.2rem;
  line-height: 1.5;
}

.route-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.error-message {
  color: white;
  padding: 24px 16px;
  font-weight: 600;
}
</style>
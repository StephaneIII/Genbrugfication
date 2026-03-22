<template>
  <v-main class="map-page">
    <AppHeader />

    <section class="map-content" v-if="station">
      <div class="map-wrapper">
        <div id="map"></div>
      </div>

      <section class="station-panel">
        <h2 class="station-title">1 genbrugsstation i {{ areaName }}</h2>

        <article class="station-card">
          <div class="station-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
              alt="Genbrugsstation"
              class="station-image"
            />
          </div>

          <div class="station-info">
            <h3>{{ station.name }}</h3>
            <p>{{ station.address }}</p>
          </div>
          <div class="route-button-wrapper">
            <BaseButton>
              Find rute
            </BaseButton>
          </div>
        </article>
      </section>
    </section>

    <section v-else class="map-content">
      <p class="error-message">Ingen station fundet for dette postnummer.</p>
    </section>

    <AppFooter />
  </v-main>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import AppHeader from '../Components/AppHeader.vue'
import AppFooter from '../Components/AppFooter.vue'
import { postcodeStations } from '../data/mockData.js'
import BaseButton from '@/Components/BaseButton.vue'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: 'MapPage',
  components: {
    AppHeader,
    AppFooter,
    BaseButton
  },
  data() {
    return {
      map: null,
      station: null,
      areaName: ''
    }
  },
  mounted() {
    const postcode = this.$route.params.postcode
    const stations = postcodeStations[postcode]

    if (stations && stations.length > 0) {
      this.station = stations[0]

      const areaNames = {
        '4000': 'Roskilde',
        '2500': 'Valby',
        '2000': 'Frederiksberg'
      }

      this.areaName = areaNames[postcode] || postcode

      this.$nextTick(() => {
        this.initMap()
      })
    }
  },
  methods: {
    initMap() {
      if (!this.station) return

      this.map = L.map('map', {
        zoomControl: true
      }).setView([this.station.lat, this.station.lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)

      L.marker([this.station.lat, this.station.lng])
        .addTo(this.map)
        .bindPopup(`<strong>${this.station.name}</strong><br>${this.station.address}`)
        .openPopup()
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
</script>

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

#map {
  width: 100%;
  height: 100%;
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
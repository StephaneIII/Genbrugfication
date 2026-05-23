<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: 'StationMap',
  props: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    stationName: {
      type: String,
      default: ''
    },
    stationAddress: {
      type: String,
      default: ''
    },
    zoom: {
      type: Number,
      default: 13
    },
    mapId: {
      type: String,
      default: 'station-map'
    },
    showPopup: {
      type: Boolean,
      default: true
    },
    showZoomControl: {
      type: Boolean,
      default: true
    },
    routeOrigin: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      map: null,
      marker: null,
      routingControl: null,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = L.map(this.mapId, {
        zoomControl: this.showZoomControl
      }).setView([this.lat, this.lng], this.zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)

      this.marker = L.marker([this.lat, this.lng]).addTo(this.map)

      if (this.showPopup && (this.stationName || this.stationAddress)) {
        this.marker
          .bindPopup(
            `<strong>${this.stationName}</strong><br>${this.stationAddress}`
          )
          .openPopup()
      }
    }
  },
  watch: {
    routeOrigin(newOrigin) {
      if (!newOrigin || !this.map) return

      if (this.routingControl) {
        this.map.removeControl(this.routingControl)
        this.routingControl = null
      }

      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(newOrigin.lat, newOrigin.lng),
          L.latLng(this.lat, this.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false
      }).addTo(this.map)
    }
  },
  beforeUnmount() {
    if (this.routingControl && this.map) {
      this.map.removeControl(this.routingControl)
      this.routingControl = null
    }

    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
</script>

<template>
  <div class="station-map">
    <div :id="mapId" class="map-element"></div>
  </div>
</template>

<style scoped>
.station-map {
  width: 100%;
  height: 100%;
}

.map-element {
  width: 100%;
  height: 100%;
}
</style>
import { createApp } from 'vue'
import App from '../vue/App.vue'
import router from '../router'

//style
import '../styles/reset.css'
import '../styles/main.css'
import 'leaflet/dist/leaflet.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')

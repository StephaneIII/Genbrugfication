import { createRouter, createWebHistory } from 'vue-router'
import PostcodePage from '../pages/PostcodePage.vue'
import Map from '../pages/MapPage.vue'
import RoutePage from '../pages/RoutePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import DetailPage from '@/pages/DetailPage.vue'
import DetailsPage from '@/pages/DetailsPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import { components } from 'vuetify/dist/vuetify.js'
import Cart from '@/pages/Cart.vue'
import SignUp from '@/pages/SignUp.vue'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  {
    path: '/LandingPage',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/PostcodePage',
    name: 'PostcodePage',
    component: PostcodePage,
  },
  {
    path: '/map/:postcode',
    name: 'Map',
    component: Map,
  },
  {
    path: '/',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/Detailspage',
    name: 'Detailspage',
    component: DetailsPage,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: Login,
  },
  {
    path: '/Signup',
    name: 'SignupPage',
    component: SignUp,
  },
  {
    path: '/route/:postcode/:stationId',
    name: 'RoutePage',
    component: () => import('../pages/RoutePage.vue'),
  },
  {
    path: '/Detailspage/:id',
    name: 'DetailPage',
    component: DetailsPage,
    props: true,
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: Profile,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

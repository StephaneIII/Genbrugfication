import { createRouter, createWebHistory } from 'vue-router'
import PostcodePage from '../pages/PostcodePage.vue'
import Map from '../pages/MapPage.vue'
import RoutePage from '../pages/RoutePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import LandingPage from '@/pages/LandingPage.vue'

const routes = [
    {
    path: '/',
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
    path: '/SearchPage',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/detail/:trashID',
    name: 'DetailPage',
    component: () => import('../pages/DetailPage.vue'),
    props: true,
  },
  {
    path: '/route/:postcode/:stationId',
    name: 'RoutePage',
    component: () => import('../pages/RoutePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

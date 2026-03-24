import { createRouter, createWebHistory } from 'vue-router'
import PostcodePage from '../pages/PostcodePage.vue'
import Map from '../pages/MapPage.vue'
import RoutePage from '../pages/RoutePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import DetailPage from '@/pages/DetailPage.vue'
import DetailsPage from '@/pages/DetailsPage.vue'

const routes = [
  {
    path: '/',
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
    path: '/Detailspage',
    name: 'Detailspage',
    component: DetailsPage,
  },
  {
    path: '/route/:postcode/:stationId',
    name: 'RoutePage',
    component: () => import('../pages/RoutePage.vue'),
  },
  {
    path: '/Detailspage',
    name: 'DetailPage',
    component: () => import('../pages/Detailspage.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

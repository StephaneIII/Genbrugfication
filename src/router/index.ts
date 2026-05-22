import { createRouter, createWebHistory } from 'vue-router'
import PostcodePage from '../pages/PostcodePage.vue'
import Map from '../pages/MapPage.vue'
import RoutePage from '../pages/RoutePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import DetailPage from '@/pages/DetailPage.vue'
import DetailsPage from '@/pages/DetailsPage.vue'
import { components } from 'vuetify/dist/vuetify.js'
import Cart from '@/pages/Cart.vue'
import SignUp from '@/pages/SignUp.vue'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import ThankYou from '@/pages/ThankYou.vue'
import TrashListPage from '@/pages/TrashListPage.vue'
import GenerateBooking from '@/pages/GenerateBooking.vue'
import Carpoolings from '@/pages/Carpoolings.vue'
import Carpooling from '@/pages/Carpooling.vue'
import MyPoint from '@/pages/MyPoint.vue'
import ListOfTrash from '@/pages/ListOfTrash.vue'

const routes = [
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
  {
    path: '/ThankYou',
    name: 'ThankYouPage',
    component: ThankYou,
  },
  {
    path: '/TrashList',
    name: 'TrashListPage',
    component: TrashListPage,
  },
  {
    path: '/GenerateBooking',
    name: 'GenerateBooking',
    component: GenerateBooking,
    meta: { requiresAuth: true },
  },
  {
    path: '/carpoolings',
    name: 'Carpoolings',
    component: Carpoolings,
  },
  {
    path: '/carpooling/:id',
    name: 'Carpooling',
    component: Carpooling,
    props: true,
  },
  {
    path: '/MyPoints',
    alias: ['/mypoint'],
    name: 'MyPoint',
    component: MyPoint,
    meta: { requiresAuth: true },
  },
  {
    path: '/ListOfTrash/:id',
    name: 'ListOfTrash',
    component: ListOfTrash,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const UID = localStorage.getItem('UID')
    if (!UID) {
      return { name: 'LoginPage' }
    }
  }
})

export default router

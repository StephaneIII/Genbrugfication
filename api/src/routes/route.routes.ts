import { Router } from 'express'
import {
  createRoute,
  deleteRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
} from '../controllers/Route.controller.js'

const router = Router()

router.post('/routes', createRoute)
router.get('/routes', getAllRoutes)
router.get('/routes/:id', getRouteById)
router.put('/routes/:id', updateRoute)
router.delete('/routes/:id', deleteRoute)

export default router
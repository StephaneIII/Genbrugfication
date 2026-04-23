import { Router } from 'express'
import {
  createRecyclingStation,
  deleteRecyclingStation,
  getRecyclingStationById,
  getRecyclingStations,
  updateRecyclingStation,
} from '../controllers/RecyclingStation.controller.js'

const router = Router()

router.post('/recyclingstations', createRecyclingStation)
router.get('/recyclingstations', getRecyclingStations)
router.get('/recyclingstations/:id', getRecyclingStationById)
router.put('/recyclingstations/:id', updateRecyclingStation)
router.delete('/recyclingstations/:id', deleteRecyclingStation)

export default router
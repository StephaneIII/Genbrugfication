import { Router } from 'express'
import {
  createTrash,
  deleteTrash,
  getTrashById,
  getAllTrash,
  updateTrash,
  deleteAllTrash,
} from '../controllers/Trash.controller.js'

const router = Router()
router.post('/trashes', createTrash)
router.get('/trashes', getAllTrash)
router.get('/trashes/:id', getTrashById)
router.put('/trashes/:id', updateTrash)
router.delete('/trashes/:id', deleteTrash)
router.delete('/trashes', deleteAllTrash)

export default router

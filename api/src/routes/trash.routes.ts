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
router.post('/trash', createTrash)
router.get('/trash', getAllTrash)
router.get('/trash/:id', getTrashById)
router.put('/trash/:id', updateTrash)
router.delete('/trash/:id', deleteTrash)
router.delete('/trash', deleteAllTrash)

export default router

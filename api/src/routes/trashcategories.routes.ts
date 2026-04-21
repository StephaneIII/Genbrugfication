import { Router } from 'express'
import {
  createTrashCategory,
  deleteTrashCategory,
  getTrashCategoryById,
  getTrashCategories,
  updateTrashCategory,
} from '../controllers/TrashCategory.controller.js'

const router = Router()

router.post('/trashcategories', createTrashCategory)
router.get('/trashcategories', getTrashCategories)
router.get('/trashcategories/:id', getTrashCategoryById)
router.put('/trashcategories/:id', updateTrashCategory)
router.delete('/trashcategories/:id', deleteTrashCategory)

export default router

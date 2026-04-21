import { Router } from 'express'
import healthRouter from './health.routes.js'
import usersRouter from './users.routes.js'
import trashCategoriesRouter from './trashcategories.routes.js'

const router = Router()

router.use('/', healthRouter)
router.use('/', usersRouter)
router.use('/', trashCategoriesRouter)

export default router

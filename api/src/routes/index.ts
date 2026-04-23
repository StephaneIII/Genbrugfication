import { Router } from 'express'
import healthRouter from './health.routes.js'
import usersRouter from './users.routes.js'
import trashCategoriesRouter from './trashcategories.routes.js'
import recyclingStationsRouter from './recycling-station.routes.js'
import routesRouter from './route.routes.js'
import stopsRoutes from './Stops.routes.js'

const router = Router()

router.use('/', healthRouter)
router.use('/', usersRouter)
router.use('/', trashCategoriesRouter)
router.use('/', recyclingStationsRouter)
router.use('/', routesRouter)
router.use('/', stopsRoutes)

export default router

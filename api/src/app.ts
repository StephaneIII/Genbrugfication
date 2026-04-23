import express from 'express'
import cors from 'cors'
import apiRouter from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import stopsRoutes from "./routes/Stops.routes.js";

const app = express()

// Enable CORS for all routes
app.use(cors())
app.use(express.json())
app.use('/api', apiRouter)
app.use('/api/', stopsRoutes)


app.use(notFound)
app.use(errorHandler)

export default app



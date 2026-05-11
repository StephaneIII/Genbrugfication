import { Request, Response } from 'express'
import Route from '../models/route.model.js'

// Create
export const createRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      UID,
      StartAddress,
      RecyclingStationID,
      AvailableSeats,
      MaxWeight,
      DepartureTime,
      Delay,
      Status,
    } = req.body

    const route = await Route.create({
      UID,
      StartAddress,
      RecyclingStationID,
      AvailableSeats,
      MaxWeight,
      DepartureTime,
      Delay,
      Status: Status || 'Scheduled',
    })

    res.status(201).json(route)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

// Get all
export const getAllRoutes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const routes = await Route.findAll()
    res.status(200).json(routes)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// Get one
export const getRouteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const route = await Route.findByPk(id)

    if (!route) {
      res.status(404).json({ error: 'Route not found' })
      return
    }

    res.status(200).json(route)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// Update
export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const route = await Route.findByPk(id)

    if (!route) {
      res.status(404).json({ error: 'Route not found' })
      return
    }

    const {
      UID,
      StartAddress,
      RecyclingStationID,
      AvailableSeats,
      MaxWeight,
      DepartureTime,
      Delay,
      Status,
    } = req.body

    await route.update({
      UID,
      StartAddress,
      RecyclingStationID,
      AvailableSeats,
      MaxWeight,
      DepartureTime,
      Delay,
      Status,
    })

    res.status(200).json(route)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

// Delete
export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const route = await Route.findByPk(id)

    if (!route) {
      res.status(404).json({ error: 'Route not found' })
      return
    }

    await route.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

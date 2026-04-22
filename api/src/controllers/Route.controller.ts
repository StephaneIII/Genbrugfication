import { Request, Response } from 'express'
import Route from '../models/route.model.js'

// Create
export const createRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { RouteId, UID, StartAdress, RecyclingStationID, AvailableSeats, MaxWeight, DepatureTime, Delay } = req.body

        const route = await Route.create({
            RouteId,
            UID,
            StartAdress,
            RecyclingStationID,
            AvailableSeats,
            MaxWeight,
            DepatureTime,
            Delay,
        })

    res.status(201).json(route)
    } catch (error) {
    res.status(400).json({ error: (error as Error).message })
    }
}

// Get one
export const getRouteById = async (_req: Request, res: Response): Promise<void> => {
    try {
        const route = await Route.findAll()
        res.status(200).json(route)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

// Get All
export const getAllRoutes = async (_req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(_req.params.id)
        const route = await Route.findByPk(id)

        if (!route) {
            res.status(404).json({ error: 'Route not found'})
            return
        }

        res.status(200).json(route)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message})
    }
}

// update
export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const route = await Route.findByPk(id)

    if (!route) {
      res.status(404).json({ error: 'Route not found' })
      return
    }

    const { RouteId, UID, StartAdress, RecyclingStationID, AvailableSeats, MaxWeight, DepatureTime, Delay } = req.body

    await route.update({
      RouteId,
      UID,
      StartAdress,
      RecyclingStationID,
      AvailableSeats,
      MaxWeight,
      DepatureTime,
      Delay,
    })

    res.status(200).json(route)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}


// delete
export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
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
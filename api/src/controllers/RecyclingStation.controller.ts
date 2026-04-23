import { Request, Response } from 'express'
import RecyclingStation from '../models/recycling-station.model.js'

// Create
export const createRecyclingStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Address, Name, Url, Recipient, XCoord, YCoord, PostNo, OpeningHours, ImageUrl } = req.body

    const recyclingStation = await RecyclingStation.create({
      Address,
      Name,
      Url,
      Recipient,
      XCoord,
      YCoord,
      PostNo,
      OpeningHours,
      ImageUrl,
    })

    res.status(201).json(recyclingStation)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

// Get All
export const getRecyclingStations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recyclingStations = await RecyclingStation.findAll()
    res.status(200).json(recyclingStations)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// Get one
export const getRecyclingStationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const recyclingStation = await RecyclingStation.findByPk(id)

    if (!recyclingStation) {
      res.status(404).json({ error: 'RecyclingStation not found' })
      return
    }

    res.status(200).json(recyclingStation)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// Update
export const updateRecyclingStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const recyclingStation = await RecyclingStation.findByPk(id)

    if (!recyclingStation) {
      res.status(404).json({ error: 'RecyclingStation not found' })
      return
    }

    const { Address, Name, Url, Recipient, XCoord, YCoord, PostNo, OpeningHours, ImageUrl } = req.body

    await recyclingStation.update({
      Address,
      Name,
      Url,
      Recipient,
      XCoord,
      YCoord,
      PostNo,
      OpeningHours,
      ImageUrl,
    })

    res.status(200).json(recyclingStation)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

// Delete
export const deleteRecyclingStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }

    const recyclingStation = await RecyclingStation.findByPk(id)

    if (!recyclingStation) {
      res.status(404).json({ error: 'RecyclingStation not found' })
      return
    }

    await recyclingStation.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
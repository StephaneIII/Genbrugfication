import { Request, Response } from "express";
import stops from "../models/stops.model.js";

export const createStop = async (req: Request, res: Response): Promise<void> => {
    try {
        const stop = await stops.create(req.body)
        res.status(201).json(stop)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const getAllStops = async (req: Request, res: Response): Promise<void> => {
    try {
        const stop = await stops.findAll()
        res.status(200).json(stop)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const getStopById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const stop = await stops.findByPk(id)

        if (!stop) {
            res.status(404).json({ error: 'Stop not found' })
            return
        }
        res.status(200).json(stop)

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const updateStop = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const stop = await stops.findByPk(id)

        if (!stop) {
            res.status(404).json({ error: 'Stop not found' })
            return
        }
        await stop.update(req.body)
        res.status(200).json(stop)

    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const deleteStop = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const stop = await stops.findByPk(id)

        if (!stop) {
            res.status(404).json({ error: 'Stop not found' })
            return
        }
        await stop.destroy()
        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const deleteAllStops = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedCount = await stops.destroy({
            where: {}, // deletes all rows
            truncate: true
        })
        res.status(200).json({
            message: 'All stops deleted',
            deletedCount
        })
        
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}
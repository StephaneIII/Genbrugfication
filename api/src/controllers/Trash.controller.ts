import { Request, Response } from "express";
import Trash from "../models/trash.model.js";

export const createTrash = async (req: Request, res: Response): Promise<void> => {
    try {
        const trash = await Trash.create(req.body)
        res.status(201).json(trash)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const getAllTrash = async (req: Request, res: Response): Promise<void> => {
    try {
        const trash = await Trash.findAll()
        res.status(200).json(trash)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const getTrashById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const trash = await Trash.findByPk(id)

        if (!trash) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        res.status(200).json(trash)

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const updateTrash = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const trash = await Trash.findByPk(id)

        if (!trash) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await trash.update(req.body)
        res.status(200).json(trash)

    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const deleteTrash = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const trash = await Trash.findByPk(id)

        if (!trash) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await trash.destroy()
        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const deleteAllTrash = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedCount = await Trash.destroy({
            where: {}, // deletes all rows
            truncate: true
        })
        res.status(200).json({
            message: 'All checkout items deleted',
            deletedCount
        })
        
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}
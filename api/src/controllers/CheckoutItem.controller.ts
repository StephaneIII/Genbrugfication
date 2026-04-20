import { Request, Response } from 'express'
import CheckoutItem from '../models/checkout-item.model.js'

export const createCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const checkoutItem = await CheckoutItem.create(req.body)
        res.status(201).json(checkoutItem)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const getAllCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const checkoutItem = await CheckoutItem.findAll()
        res.status(200).json(checkoutItem)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const getCheckoutItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkoutItem = await CheckoutItem.findByPk(id)

        if (!checkoutItem) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        res.status(200).json(checkoutItem)

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const updateCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkoutItem = await CheckoutItem.findByPk(id)

        if (!checkoutItem) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await checkoutItem.update(req.body)
        res.status(200).json(checkoutItem)

    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const deleteCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkoutItem = await CheckoutItem.findByPk(id)

        if (!checkoutItem) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await checkoutItem.destroy()
        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const deleteAllCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedCount = await CheckoutItem.destroy({
            where: {}, // deletes all rows
            truncate: true // optional: faster + resets auto-increment
        })
        res.status(200).json({
            message: 'All checkout items deleted',
            deletedCount
        })
        
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}
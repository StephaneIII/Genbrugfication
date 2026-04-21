import { Request, Response } from 'express'
import Checkout from '../models/checkout.model.js'

export const createCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const checkout = await Checkout.create(req.body)
        res.status(201).json(checkout)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const getCheckoutItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkout = await Checkout.findByPk(id)

        if (!checkout) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        res.status(200).json(checkout)

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const updateCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkout = await Checkout.findByPk(id)

        if (!checkout) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await checkout.update(req.body)
        res.status(200).json(checkout)

    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

export const deleteCheckoutItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id)
        const checkout = await Checkout.findByPk(id)

        if (!checkout) {
            res.status(404).json({ error: 'Item not found' })
            return
        }
        await checkout.destroy()
        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}


import { Request, Response } from 'express'
import Checkout from '../models/checkout.model.js'
import CheckoutItem from '../models/checkout-item.model.js'
import Trash from '../models/trash.model.js'

export const createCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkout = await Checkout.create(req.body)
    res.status(201).json(checkout)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}
export const getAllCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkout = await Checkout.findAll()
    res.status(200).json(checkout)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const getCheckoutById = async (req: Request, res: Response): Promise<void> => {
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

export const deleteCheckout = async (req: Request, res: Response): Promise<void> => {
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

export const scoreCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)

    const checkoutItemArray = await CheckoutItem.findAll({ where: { CheckoutID: id } })

    let totalScore = 0

    for (const item of checkoutItemArray as any[]) {
      const trash = await Trash.findByPk(item.TrashID)

      if (trash) {
        totalScore += (trash as any).Score * item.Amount
      }
    }

    res.status(200).json({ totalScore })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

/// total score for specific month parameter: month (1-12) and year (e.g. 2023)+ user id
export const scoreCheckoutByMonth = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId)
    const month = Number(req.query.month)
    const year = Number(req.query.year)
    const checkoutAttributes = (Checkout as any).rawAttributes || {}
    const checkoutUserField = checkoutAttributes.UID ? 'UID' : 'UserID'
    const checkoutItemAttributes = (CheckoutItem as any).rawAttributes || {}
    const checkoutItemCheckoutField = checkoutItemAttributes.CheckoutID
      ? 'CheckoutID'
      : 'checkoutId'
    const checkouts = await Checkout.findAll({ where: { [checkoutUserField]: userId } as any })

    let totalScore = 0
    for (const checkout of checkouts as any[]) {
      const checkoutDate = new Date(checkout.Date ?? checkout.CreatedAt)
      const checkoutId = checkout.CheckoutID ?? checkout.ID
      if (checkoutDate.getMonth() + 1 === month && checkoutDate.getFullYear() === year) {
        const checkoutItems = await CheckoutItem.findAll({
          where: { [checkoutItemCheckoutField]: checkoutId } as any,
        })
        for (const item of checkoutItems as any[]) {
          const trash = await Trash.findByPk(item.TrashID)
          if (trash) {
            totalScore += (trash as any).Score * item.Amount
          }
        }
      }
    }

    res.status(200).json({ totalScore })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

/// total score by user id
export const scoreCheckoutByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId)
    const checkoutAttributes = (Checkout as any).rawAttributes || {}
    const checkoutUserField = checkoutAttributes.UID ? 'UID' : 'UserID'
    const checkoutItemAttributes = (CheckoutItem as any).rawAttributes || {}
    const checkoutItemCheckoutField = checkoutItemAttributes.CheckoutID
      ? 'CheckoutID'
      : 'checkoutId'
    const checkouts = await Checkout.findAll({ where: { [checkoutUserField]: userId } as any })

    let totalScore = 0
    for (const checkout of checkouts as any[]) {
      const checkoutId = checkout.CheckoutID ?? checkout.ID
      const checkoutItems = await CheckoutItem.findAll({
        where: { [checkoutItemCheckoutField]: checkoutId } as any,
      })
      for (const item of checkoutItems as any[]) {
        const trash = await Trash.findByPk(item.TrashID)
        if (trash) {
          totalScore += (trash as any).Score * item.Amount
        }
      }
    }

    res.status(200).json({ totalScore })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

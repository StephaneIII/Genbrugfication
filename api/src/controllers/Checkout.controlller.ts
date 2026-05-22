import { Request, Response } from 'express'
import Checkout from '../models/checkout.model.js'
import CheckoutItem from '../models/checkout-item.model.js'
import Trash from '../models/trash.model.js'

const resolveCheckoutId = (checkout: any) => checkout.CheckoutID ?? checkout.ID ?? checkout.id

const toPlain = (value: any) => {
  if (!value) {
    return null
  }

  return typeof value.toJSON === 'function' ? value.toJSON() : value
}

const getOrCreateOpenCheckout = async (UID: number) => {
  let checkout = await Checkout.findOne({
    where: { UID: UID, Locked: false },
  })

  if (!checkout) {
    checkout = await Checkout.create({
      UID: UID,
      Date: new Date(),
      Locked: false,
    })
  }

  return checkout
}

const getOpenCheckout = async (UID: number) => {
  return Checkout.findOne({
    where: { UID: UID, Locked: false },
  })
}

const buildOpenCheckoutResponse = async (checkout: any) => {
  const checkoutId = resolveCheckoutId(checkout)
  const checkoutItems = (await CheckoutItem.findAll({ where: { CheckoutID: checkoutId } })) as any[]

  const items = await Promise.all(
    checkoutItems.map(async (item) => {
      const checkoutItem = item as Record<string, any>
      const trash = await Trash.findByPk(checkoutItem.TrashID)

      return {
        ...toPlain(checkoutItem),
        Trash: toPlain(trash),
      }
    }),
  )

  return {
    checkout: toPlain(checkout),
    items,
  }
}

export const getOpenCheckoutByUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)

    if (Number.isNaN(UID)) {
      res.status(400).json({ error: 'Invalid user id' })
      return
    }

    const checkout = await getOrCreateOpenCheckout(UID)
    const response = await buildOpenCheckoutResponse(checkout)

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const addTrashToOpenCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)
    const trashId = Number(req.body.TrashID ?? req.body.trashId)
    const amount = Number(req.body.Amount ?? req.body.amount ?? 1)

    if (Number.isNaN(UID) || Number.isNaN(trashId)) {
      res.status(400).json({ error: 'Invalid checkout or trash id' })
      return
    }

    if (!amount || amount < 1) {
      res.status(400).json({ error: 'Amount must be at least 1' })
      return
    }

    const trash = await Trash.findByPk(trashId)
    if (!trash) {
      res.status(404).json({ error: 'Trash not found' })
      return
    }

    const checkout = await getOrCreateOpenCheckout(UID)
    const checkoutId = resolveCheckoutId(checkout)
    const checkoutItem = (await CheckoutItem.findOne({
      where: { CheckoutID: checkoutId, TrashID: trashId },
    })) as any

    if (checkoutItem) {
      const existingItem = checkoutItem as Record<string, any>
      await checkoutItem.update({ Amount: Number(existingItem.Amount) + amount })
    } else {
      await CheckoutItem.create({
        CheckoutID: checkoutId,
        TrashID: trashId,
        Amount: amount,
      })
    }

    const response = await buildOpenCheckoutResponse(checkout)
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const updateOpenCheckoutTrashAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)
    const trashId = Number(req.params.trashId)
    const amount = Number(req.body.Amount ?? req.body.amount)

    if (Number.isNaN(UID) || Number.isNaN(trashId) || Number.isNaN(amount)) {
      res.status(400).json({ error: 'Invalid checkout payload' })
      return
    }

    const checkout = await getOrCreateOpenCheckout(UID)
    const checkoutId = resolveCheckoutId(checkout)
    const checkoutItem = await CheckoutItem.findOne({
      where: { CheckoutID: checkoutId, TrashID: trashId },
    })

    if (!checkoutItem) {
      if (amount <= 0) {
        const response = await buildOpenCheckoutResponse(checkout)
        res.status(200).json(response)
        return
      }

      await CheckoutItem.create({
        CheckoutID: checkoutId,
        TrashID: trashId,
        Amount: amount,
      })
    } else if (amount <= 0) {
      await checkoutItem.destroy()
    } else {
      await checkoutItem.update({ Amount: amount })
    }

    const response = await buildOpenCheckoutResponse(checkout)
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const deleteOpenCheckoutTrash = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)
    const trashId = Number(req.params.trashId)

    if (Number.isNaN(UID) || Number.isNaN(trashId)) {
      res.status(400).json({ error: 'Invalid checkout payload' })
      return
    }

    const checkout = await getOrCreateOpenCheckout(UID)
    const checkoutId = resolveCheckoutId(checkout)
    const checkoutItem = await CheckoutItem.findOne({
      where: { CheckoutID: checkoutId, TrashID: trashId },
    })

    if (checkoutItem) {
      await checkoutItem.destroy()
    }

    const response = await buildOpenCheckoutResponse(checkout)
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const lockOpenCheckoutByUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)

    if (Number.isNaN(UID)) {
      res.status(400).json({ error: 'Invalid user id' })
      return
    }

    const checkout = await getOpenCheckout(UID)

    if (!checkout) {
      res.status(404).json({ error: 'No open checkout found' })
      return
    }

    await checkout.update({ Locked: true })

    res.status(200).json({
      success: true,
      checkout: toPlain(checkout),
    })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

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
    const UID = Number(req.params.UID)
    const month = Number(req.query.month)
    const year = Number(req.query.year)
    const checkoutAttributes = (Checkout as any).rawAttributes || {}
    const checkoutUserField = checkoutAttributes.UID ? 'UID' : 'UID'
    const checkoutItemAttributes = (CheckoutItem as any).rawAttributes || {}
    const checkoutItemCheckoutField = checkoutItemAttributes.CheckoutID
      ? 'CheckoutID'
      : 'checkoutId'
    const checkouts = await Checkout.findAll({ where: { [checkoutUserField]: UID } as any })

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
export const scoreCheckoutByUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const UID = Number(req.params.UID)
    const checkoutAttributes = (Checkout as any).rawAttributes || {}
    const checkoutUserField = checkoutAttributes.UID ? 'UID' : 'UID'
    const checkoutItemAttributes = (CheckoutItem as any).rawAttributes || {}
    const checkoutItemCheckoutField = checkoutItemAttributes.CheckoutID
      ? 'CheckoutID'
      : 'checkoutId'
    const checkouts = await Checkout.findAll({ where: { [checkoutUserField]: UID } as any })

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

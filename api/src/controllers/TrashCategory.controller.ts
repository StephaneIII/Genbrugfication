import { Request, Response } from 'express'
import TrashCategory from '../models/trash-category.model.js'

export const createTrashCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const trashCategory = await TrashCategory.create(req.body)
    res.status(201).json(trashCategory)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getTrashCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const trashCategories = await TrashCategory.findAll()
    res.status(200).json(trashCategories)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const getTrashCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const trashCategory = await TrashCategory.findByPk(id)

    if (!trashCategory) {
      res.status(404).json({ error: 'TrashCategory not found' })
      return
    }

    res.status(200).json(trashCategory)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const updateTrashCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const trashCategory = await TrashCategory.findByPk(id)

    if (!trashCategory) {
      res.status(404).json({ error: 'TrashCategory not found' })
      return
    }

    await trashCategory.update(req.body)
    res.status(200).json(trashCategory)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const deleteTrashCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const trashCategory = await TrashCategory.findByPk(id)

    if (!trashCategory) {
      res.status(404).json({ error: 'TrashCategory not found' })
      return
    }

    await trashCategory.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

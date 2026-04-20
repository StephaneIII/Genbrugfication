import { Request, Response } from 'express'
import User from '../models/user.model.js'

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    await user.update(req.body)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    await user.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

import { Request, Response } from 'express'
import User from '../models/user.model.js'
import { hashPassword, comparePassword, validatePassword } from '../helpers/encryption.helper.js'

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Password, ...userData } = req.body

    // Password is required
    if (!Password) {
      res.status(400).json({ error: 'Password is required' })
      return
    }

    // Validate password
    if (!validatePassword(Password)) {
      res.status(400).json({
        error:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      })
      return
    }

    // Hash the password
    const hashedPassword = await hashPassword(Password)

    const user = await User.create({
      ...userData,
      Password: hashedPassword,
      IsAdmin: false // New users are not admins by default
    })

    // Remove password from response
    const { Password: _, ...userResponse } = user.toJSON()

    res.status(201).json(userResponse)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['Password'] }, // Exclude password from response
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id, {
      attributes: { exclude: ['Password'] }, // Exclude password from response
    })

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
    const { Password, ...updateData } = req.body

    const user = await User.findByPk(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // If password is being updated, validate and hash it
    let hashedPassword
    if (Password) {
      if (!validatePassword(Password)) {
        res.status(400).json({
          error:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
        })
        return
      }
      hashedPassword = await hashPassword(Password)
    }

    await user.update({
      ...updateData,
      ...(hashedPassword && { Password: hashedPassword }),
    })

    // Remove password from response
    const { Password: _, ...userResponse } = user.toJSON()

    res.status(200).json(userResponse)
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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Email, Password } = req.body

    console.log('Login attempt:', { Email, Password: Password ? 'PROVIDED' : 'MISSING' })

    if (!Email || !Password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Find user by email (including password for verification)
    const user = await User.findOne({ where: { Email } })

    if (!user) {
      console.log('User not found for email:', Email)
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    console.log('User found:', { UID: user.UID, Email: user.Email, hasPassword: !!user.Password })

    // Check if user has a password stored (handle legacy users without passwords)
    if (!user.Password) {
      console.log('User has no password stored')
      res.status(401).json({ error: 'Account has no password set. Please contact support.' })
      return
    }

    // Compare provided password with stored hashed password
    console.log('Comparing passwords...')
    const isPasswordValid = await comparePassword(Password, user.Password)
    console.log('Password comparison result:', isPasswordValid)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Remove password from response
    const { Password: _, ...userResponse } = user.toJSON()

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: (error as Error).message })
  }
}

export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const { Password } = req.body

    console.log('Password verification attempt for user:', id)

    if (!Password) {
      res.status(400).json({ error: 'Password is required' })
      return
    }

    // Find user by ID (including password for verification)
    const user = await User.findByPk(id)

    if (!user) {
      console.log('User not found for ID:', id)
      res.status(404).json({ error: 'User not found' })
      return
    }

    console.log('User found for password verification:', {
      UID: user.UID,
      hasPassword: !!user.Password,
    })

    // Check if user has a password stored
    if (!user.Password) {
      console.log('User has no password stored')
      res.status(400).json({ error: 'Account has no password set' })
      return
    }

    // Compare provided password with stored hashed password
    console.log('Comparing passwords for verification...')
    const isPasswordValid = await comparePassword(Password, user.Password)
    console.log('Password verification result:', isPasswordValid)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' })
      return
    }

    res.status(200).json({
      message: 'Password verified successfully',
      verified: true,
    })
  } catch (error) {
    console.error('Password verification error:', error)
    res.status(500).json({ error: (error as Error).message })
  }
}

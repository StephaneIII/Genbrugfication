import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  loginUser,
} from '../controllers/user.controller.js'

const router = Router()

router.post('/users', createUser)
router.post('/users/login', loginUser)
router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router

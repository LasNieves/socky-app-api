import { Router } from 'express'
import {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller'

export const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:ID', getOneUser)

usersRouter.post('/', createUser)

usersRouter.patch('/:ID', updateUser)

usersRouter.delete('/:ID', deleteUser)

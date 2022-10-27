import { Router } from 'express'
import {
  getUsers,
  getOneUser,
  updateUser,
} from '../controllers/user.controller'

export const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:ID', getOneUser)

usersRouter.patch('/:ID', updateUser)

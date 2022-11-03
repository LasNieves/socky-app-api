import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares'
import {
  getUsers,
  getOneUser,
  deleteUser,
  getUserWorkspaces,
} from '../controllers/user.controller'

export const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:ID', getOneUser)

usersRouter.get(
  '/workspaces/:ID',

  getUserWorkspaces
)

usersRouter.delete(
  '/:ID',
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  deleteUser
)

/* usersRouter.patch('/:ID', updateUser)
 */

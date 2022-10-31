import { validateRequest } from './../middlewares/validateRequest'
import { body } from 'express-validator'
import { Router } from 'express'
import {
  getUsers,
  getOneUser,
  deleteUser,
  getUserWorkspaces,
} from '../controllers/user.controller'

export const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:ID', getOneUser)

usersRouter.delete(
  '/:ID',
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  deleteUser
)

usersRouter.get(
  '/workspaces/:ID',

  getUserWorkspaces
)

/* usersRouter.patch('/:ID', updateUser)
 */

import { validateRequest } from './../middlewares/validateRequest';
import { body } from 'express-validator';
import { Router } from 'express'
import {
  getUsers,
  getOneUser,
  deleteUser,
} from '../controllers/user.controller'

export const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:ID', getOneUser)

usersRouter.delete('/:ID',
body("password").trim().notEmpty().withMessage("Contraseña obligatoria"),
validateRequest,
deleteUser)


/* usersRouter.patch('/:ID', updateUser)
 */
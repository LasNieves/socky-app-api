import { Router } from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/auth.controller'
import { validateRequest } from '../middlewares'

export const authRouter = Router()

authRouter.post('/register',
  body("email").isEmail().withMessage("Email inválido"),
  body("password").trim().notEmpty().withMessage("Contraseña obligatoria"),
  body("firstName").trim().isString().notEmpty().withMessage("Campo requerido"),
  body("lastName").trim().isString().notEmpty().withMessage("Campo requerido"),
  body("avatar").trim().isString().notEmpty().withMessage("Campo requerido"),
  validateRequest,
  register
)

authRouter.post(
  '/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  login
)

// authRouter.delete('/logout/:ID', logout)

import { Router } from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/auth.controller'

export const authRouter = Router()

authRouter.post('/register', register)

authRouter.post(
  '/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').trim().notEmpty().withMessage('Password obligatorio'),
  login
)

// authRouter.delete('/logout/:ID', logout)

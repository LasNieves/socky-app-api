import { Router } from 'express'
import { login, register, logout } from '../controllers/auth.controller'

export const authRouter = Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.delete('/logout/:ID', logout)

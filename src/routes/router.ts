import { Router } from 'express'
import { usersRouter } from './users'

export const router = Router()

router.use('/users', usersRouter)

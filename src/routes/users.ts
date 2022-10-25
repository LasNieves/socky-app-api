import { Router } from 'express'
import { get, getOne, post } from '../controllers/users'

export const usersRouter = Router()

usersRouter.get('/', get)

usersRouter.get('/:ID', getOne)

usersRouter.post('/', post)

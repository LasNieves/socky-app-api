import { Router } from 'express'

export const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.status(200).send('users')
})

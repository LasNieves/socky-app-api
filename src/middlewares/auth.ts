import { Request, NextFunction, Response } from 'express'

import { jwtModel } from '../controllers/auth.controller'
import { NotAuthorized } from '../errors/NotAuthorized'

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const { headers } = req

  if (!headers.authorization || !headers.authorization.startsWith('Bearer')) {
    return next(new NotAuthorized('Usuario no autenticado'))
  }

  const token = headers.authorization.split(' ')[1]

  if (!token) {
    return next(new NotAuthorized('Usuario no autenticado'))
  }

  try {
    const decoded = jwtModel.verify(token)
    console.log({ decoded })
    next()
  } catch (error) {
    next(error)
  }
}

//TODO: Authorization

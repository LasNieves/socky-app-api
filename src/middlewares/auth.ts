import { Request, NextFunction, Response } from 'express'

import { jwtService } from '../controllers/auth.controller'
import { categoryService } from '../controllers/category.controller'
import { userService } from '../controllers/user.controller'
import { Category, User } from '../core/entities'
import { CustomError } from '../errors'
import { NotAuthorized } from '../errors/NotAuthorized'

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { headers } = req

  if (!headers.authorization || !headers.authorization.startsWith('Bearer')) {
    return next(new NotAuthorized('Usuario no autenticado'))
  }

  const token = headers.authorization.split(' ')[1]

  if (!token) {
    return next(new NotAuthorized('Usuario no autenticado'))
  }

  try {
    const decoded = jwtService.verify(token)
    const user = await userService.get({ id: decoded.id })

    if (user instanceof CustomError) {
      return next(user)
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const authorization =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // if (roles.includes(userRole)) {
    //   return next()
    // }
    // return next(new NotAuthorized('Usuario no autorizado'))
  }

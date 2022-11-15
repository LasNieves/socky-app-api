import { Request, NextFunction, Response } from 'express'

import { jwtService } from '../controllers/auth.controller'
import { userService } from '../controllers/user.controller'
import { User } from '../core/entities'
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
    req.user = user as User
    next()
  } catch (error) {
    next(error)
  }
}

//TODO: Authorization

export const authorization =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId } = req.params

    const userRole = await userService.getUserRole(
      req.user?.id ?? '',
      workspaceId
    )

    if (userRole instanceof CustomError) {
      return next(userRole)
    }

    if (roles.includes(userRole)) {
      return next()
    }

    return next(new NotAuthorized('Usuario no autorizado'))
  }

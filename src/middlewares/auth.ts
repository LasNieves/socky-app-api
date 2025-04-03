import { Request, NextFunction, Response } from 'express'

import { ApplicationRole } from '../core/enums'
import { NotAuthorized, NotFound } from '../errors'
import { jwtService, userService } from '../services'

export const protect =
  (requireVerification = true) =>
  async (req: Request, _res: Response, next: NextFunction) => {
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
      const user = await userService
        .getFirstUserOrThrow({ id: decoded.id })
        .catch((error) => {
          console.log(error)
          throw new NotFound(`Usuario con id ${decoded.id} no encontrado`)
        })

      if (requireVerification && !user.verified) {
        throw new NotAuthorized('Usuario no verificado')
      }

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  }

export const authorization =
  (...roles: ApplicationRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const { user } = req
    if (roles.includes(user!.role)) {
      return next()
    }
    return next(new NotAuthorized('Usuario no autorizado'))
  }

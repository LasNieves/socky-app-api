import { Request, Response, NextFunction } from 'express'

import { NotAuthorized } from './../errors'

export const verifyUserIdentity = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const { user } = req

  if (user?.role !== 'SUPERADMIN' && user?.id !== ID) {
    return next(
      new NotAuthorized('Usuario no autorizado para realizar esta operación')
    )
  }

  return next()
}

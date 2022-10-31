import { NextFunction, Request, Response } from 'express'

import { AuthModel } from '../core/models'
import { CustomError } from '../errors'

const authModel = new AuthModel()

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { email, password } = req.body

  const credentials = await authModel.login({ email, password })

  if (credentials instanceof CustomError) {
    return next(credentials)
  }

  res.status(200).json({
    message: 'Usuario logeado correctamente',
    data: {
      ...credentials,
    },
  })
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName, avatar } = req.body

  const credentials = await authModel.register({
    email,
    password,
    firstName,
    lastName,
    avatar,
  })

  if (credentials instanceof CustomError) {
    return next(credentials)
  }
  
  res.status(201).json({
    message: 'Usuario registrado correctamente',
    data: { ...credentials },
  })
}

 
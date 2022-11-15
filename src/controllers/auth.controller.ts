import { NextFunction, Request, Response } from 'express'

import { userService } from './user.controller'
import { AuthService, JwtService } from '../services'
import { CustomError } from '../errors'

export const jwtService = new JwtService()
export const authService = new AuthService(userService, jwtService)

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, avatar } = req.body

  const credentials = await authService.register({
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
    data: credentials,
  })
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const credentials = await authService.login({ email, password })

  if (credentials instanceof CustomError) {
    return next(credentials)
  }

  res.status(200).json({
    message: 'Usuario logeado correctamente',
    data: credentials,
  })
}

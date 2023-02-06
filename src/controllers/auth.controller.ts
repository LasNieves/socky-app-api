import { NextFunction, Request, Response } from 'express'

import { userService } from './user.controller'
import { AuthService, JwtService } from '../services'
import { CustomError } from '../errors'
import { MailerService } from '../services/mailer.service'

export const jwtService = new JwtService()
export const mailerService = new MailerService()
export const authService = new AuthService(
  userService,
  jwtService,
  mailerService
)

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, avatar } = req.body

  const { headers } = req

  let isSuperAdmin = false

  if (headers['application-secret']) {
    isSuperAdmin =
      headers['application-secret'] === process.env.APPLICATION_SECRET
  }

  const credentials = await authService.register({
    email,
    password,
    firstName,
    lastName,
    avatar,
    isSuperAdmin,
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

export const validateCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body

  const isVerified = await authService.validateCode({ email, code: +code })

  if (isVerified instanceof CustomError) {
    return next(isVerified)
  }

  res.status(200).json({
    message: isVerified,
  })
}

export const resendvalidationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  const resendValidationCode = await authService.resendValidationCode({ email })

  if (resendValidationCode instanceof CustomError) {
    return next(resendValidationCode)
  }

  res.status(200).json({
    message: resendValidationCode,
  })
}

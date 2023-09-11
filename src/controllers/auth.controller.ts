import { NextFunction, Request, Response } from 'express'

import { authService } from '../services'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { headers } = req

  //FIX super admin use crypto package
  let isSuperAdmin = false

  if (headers['application-secret']) {
    isSuperAdmin =
      headers['application-secret'] === process.env.APPLICATION_SECRET
  }

  try {
    const credentials = await authService.register({
      ...req.body,
      isSuperAdmin,
    })

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      data: credentials,
    })
  } catch (err) {
    return next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials = await authService.login(req.body)

    res.status(200).json({
      message: 'Usuario logeado correctamente',
      data: credentials,
    })
  } catch (err) {
    return next(err)
  }
}

export const validateCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body

  try {
    const message = await authService.validateCode({ email, code: +code })

    res.status(200).json({
      message,
    })
  } catch (err) {
    return next(err)
  }
}

export const resendvalidationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await authService.resendValidationCode(req.body)

    res.status(200).json({
      message,
    })
  } catch (err) {
    return next(err)
  }
}

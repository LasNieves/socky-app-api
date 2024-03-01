import { NextFunction, Request, Response } from 'express'

import { authService } from '../services'
import { timingSafeEqual } from '../utils'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { headers } = req

  let isSuperAdmin = false
  const appSecret = process.env.APPLICATION_SECRET
  const secretSended = headers['application-secret']

  if (appSecret && secretSended && typeof secretSended === 'string') {
    if (timingSafeEqual(appSecret, secretSended)) {
      isSuperAdmin = true
    }
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

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body
  const { email } = req.user!

  try {
    const message = await authService.verifyAccount(email, { code: +code })

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
    const message = await authService.sendValidationCode(req.body)

    res.status(200).json({
      message,
    })
  } catch (err) {
    return next(err)
  }
}

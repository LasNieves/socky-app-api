import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { AuthModel } from '../core/models'
import { BadRequest, CustomError } from '../errors'

const authModel = new AuthModel()

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array()))
  }

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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array()))
  }
  
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

// export const logout = async (req: Request, res: Response) => {
//   const { ID } = req.params
//   const { password } = req.body

//   const deletedUser = await authModel.logout({ id: ID, password })

//   if (!deletedUser) {
//     res
//       .status(409)
//       .json({ message: 'El usuario no fue eliminado correctamente' })
//   }

//   res.status(201).json({
//     message: deletedUser,
//   })
// }

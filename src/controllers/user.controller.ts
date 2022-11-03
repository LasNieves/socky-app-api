import { NextFunction, Request, Response } from 'express'

import { UserModel } from './../core/models'
import { CustomError } from '../errors'

export const userModel = new UserModel()

export const getUsers = async (req: Request, res: Response) => {
  const users = await userModel.getAll()

  res.status(200).json(users)
}

export const getOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const user = await userModel.getById(ID)

  if (user instanceof CustomError) {
    return next(user)
  }

  res.status(200).json(user)
}

export const getUserWorkspaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  const userWorkspaces = await userModel.getUserWorkspaces(ID)

  if (userWorkspaces instanceof CustomError) {
    return next(userWorkspaces)
  }

  res.status(200).send(userWorkspaces)
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const { password } = req.body

  const deletedUser = await userModel.delete(ID, password)

  if (deletedUser instanceof CustomError) {
    return next(deletedUser)
  }

  res.status(200).json({
    message: 'Usuario eliminado correctamente',
    data: deletedUser,
  })
}

import { UserModel } from './../core/models/user.model'
import { NextFunction, Request, Response } from 'express'

import { CustomError, NotFound } from '../errors'

const userModel = new UserModel()

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

  if (!user) {
    return next(new NotFound('Usuario no encontrado'))
  }

  res.status(200).json(user)
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
    message: deletedUser,
  })
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

/* export const updateUser = async (req: Request, res: Response) => {
  const { ID } = req.params
  const { email } = req.body

  const user = await updateOneUser(ID, { email })

  res.status(200).json(user)
} */

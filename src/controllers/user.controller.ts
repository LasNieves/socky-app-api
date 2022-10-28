import { UserModel } from './../core/models/user.model';
import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors'


const userModel = new UserModel()

export const getUsers = async (req: Request, res: Response) => {
  const users = await userModel.getAll()

  res.status(200).json(users)
}

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  const { ID } = req.params
  const user = await userModel.getById(ID)
  
  if (user instanceof CustomError) {
    return next(user)
  }

  res.status(200).json(user)
}

/* export const updateUser = async (req: Request, res: Response) => {
  const { ID } = req.params
  const { email } = req.body

  const user = await updateOneUser(ID, { email })

  res.status(200).json(user)
} */

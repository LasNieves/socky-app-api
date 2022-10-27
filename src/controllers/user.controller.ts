import { Request, Response } from 'express'

import {
  getAllUsers,
  getUserByID,
  updateOneUser,
} from '../core/models/user.model'

export const getUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers()

  res.status(200).json(users)
}

export const getOneUser = async (req: Request, res: Response) => {
  const { ID } = req.params
  const user = await getUserByID(ID)

  res.status(200).json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const { ID } = req.params
  const { email } = req.body

  const user = await updateOneUser(ID, { email })

  res.status(200).json(user)
}

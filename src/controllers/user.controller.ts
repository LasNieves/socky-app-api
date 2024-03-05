import { NextFunction, Request, Response } from 'express'

import { userService } from '../services'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAll()

  res.status(200).json(users)
}

export const getOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const user = await userService.get(
      { id: ID },
      { profile: true, workspaces: true }
    )

    res.status(200).json(user)
  } catch (err) {
    return next(err)
  }
}

export const getUserWorkspaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const userWorkspaces = await userService.getUserWorkspaces(ID)

    res.status(200).send(userWorkspaces)
  } catch (err) {
    return next(err)
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const updatedUser = await userService.updateProfile(ID, req.body)

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      data: updatedUser,
    })
  } catch (err) {
    return next(err)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const deletedUser = await userService.delete(ID, req.body)

    res.status(200).json({
      message: 'Usuario eliminado correctamente',
      data: deletedUser,
    })
  } catch (err) {
    return next(err)
  }
}

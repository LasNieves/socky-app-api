import { NextFunction, Request, Response } from 'express'

import { NotFound } from '../errors'
import { workspaceService } from '../services'

export const getWorkspaces = async (req: Request, res: Response) => {
  const workspaces = await workspaceService.getAll()

  res.status(200).json(workspaces)
}

export const getOneWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const workspace = await workspaceService.get({ id: ID })

  if (!workspace) {
    return next(new NotFound(`No se ha encontrado el workspace con id ${ID}`))
  }

  res.status(200).json(workspace)
}

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!

  try {
    const workspace = await workspaceService.create(req.body, id)

    res
      .status(201)
      .json({ message: `Workspace ${workspace.name} creado`, data: workspace })
  } catch (err) {
    return next(err)
  }
}

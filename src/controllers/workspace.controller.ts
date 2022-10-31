import { NextFunction, Request, Response } from 'express'
import { WorkspaceModel } from '../core/models/workspace.model'
import { NotFound } from '../errors'

const workspaceModel = new WorkspaceModel()

export const getOneWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const workspace = await workspaceModel.getById(ID)

  if (!workspace) {
    return next(new NotFound('Workspace no encontrado'))
  }

  res.status(200).json(workspace)
}

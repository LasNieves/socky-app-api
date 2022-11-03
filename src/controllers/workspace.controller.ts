import { NextFunction, Request, Response } from 'express'

import { WorkspaceModel } from '../core/models'
import { CustomError } from '../errors'

export const workspaceModel = new WorkspaceModel()

export const getOneWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const workspace = await workspaceModel.get(ID)

  if (workspace instanceof CustomError) {
    return next(workspace)
  }

  res.status(200).json(workspace)
}

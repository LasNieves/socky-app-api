import { NextFunction, Request, Response } from 'express'

import { WorkspaceService } from '../services'
import { CustomError } from '../errors'

export const workspaceService = new WorkspaceService()

export const getOneWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const workspace = await workspaceService.get(ID)

  if (workspace instanceof CustomError) {
    return next(workspace)
  }

  res.status(200).json(workspace)
}

import { Router } from 'express'
import { getOneWorkspace } from '../controllers/workspace.controller'

export const workspaceRouter = Router()

workspaceRouter.get('/:ID', getOneWorkspace)

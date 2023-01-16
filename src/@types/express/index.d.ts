import * as core from 'express-serve-static-core'
import { User } from '../../core/entities'

declare global {
  namespace Express {
    interface Request {
      user?: User
      workspaceId: string
    }
  }
}

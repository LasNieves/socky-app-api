import { Request } from 'express'

import { User } from '../core/entities'

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User
  }
}

// export interface MyCustomRequest extends Request {
//   user?: User
// }

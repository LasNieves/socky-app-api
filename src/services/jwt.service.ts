import jwt from 'jsonwebtoken'

import { NotAuthorized } from '../errors/NotAuthorized'
import { JwtPayload } from '../core/types'

export class JwtService {
  private signature: string

  constructor() {
    this.signature = process.env.JWT_SECRET!
  }

  sign(payload: JwtPayload): string {
    return jwt.sign({ ...payload }, this.signature)
  }

  verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.signature)
      return decoded as JwtPayload
    } catch (error) {
      throw new NotAuthorized('Usuario no autenticado')
    }
  }
}

export const jwtService = new JwtService()

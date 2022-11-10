import { CustomError } from '../../errors'
import { JwtPayload } from '../types'

export interface JwtRepository {
  sign(payload: JwtPayload): string
  verify(token: string): JwtPayload | CustomError
}

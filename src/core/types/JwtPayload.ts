import { User } from '../entities'

export type JwtPayload = Pick<User, 'id' | 'email'>

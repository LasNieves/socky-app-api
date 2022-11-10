import { User } from '../entities'

export type JwtPayload = Partial<Omit<User, 'password'>>

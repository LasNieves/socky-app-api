import { User } from '../entities'

export type UserWithoutPassword = Omit<User, 'password'>

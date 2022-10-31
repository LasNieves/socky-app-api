import { Profile } from '@prisma/client'

export interface AuthLogin {
  email: string
  password: string
}

export interface AuthRegister {
  email: string
  password: string
  firstName: string
  lastName: string
  avatar: string
}

export interface AuthDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date

  profile?: Omit<Profile, 'userId'> | null

  token: string
}

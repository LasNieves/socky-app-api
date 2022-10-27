import { prisma } from '../../config/db'
import jwt from 'jsonwebtoken'
import { hash, genSalt, compare } from 'bcryptjs'
import { User } from '@prisma/client'

import { AuthLogin, AuthLogout, AuthRegister, AuthResponse } from '../entities'
import { AuthRepository } from '../repositories'
import { RequireAtLeastOne } from '../../utilities/types'

export class AuthModel implements AuthRepository {
  private getSignedToken(user: User): string {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET!)
  }

  private async existUser(
    field: RequireAtLeastOne<Record<'id' | 'email', string>>
  ): Promise<User | null> {
    const existUser = await prisma.user.findUnique({
      where: { ...field },
      include: { profile: true },
    })

    return existUser
  }

  private async isValidPassword(
    passwordToCompare: string,
    password: string
  ): Promise<boolean> {
    return await compare(passwordToCompare, password)
  }

  async login(data: AuthLogin): Promise<AuthResponse | null> {
    const { email, password } = data
    const existUser = await this.existUser({ email })

    if (!existUser) {
      return null
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return null
    }

    return { ...existUser, token: 'jsgkhl' }
  }

  async register(data: AuthRegister): Promise<AuthResponse | null> {
    const { email, password, ...rest } = data

    const existUser = await this.existUser({ email })

    if (existUser) {
      return null
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        profile: {
          create: {
            ...rest,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    const token = this.getSignedToken(user)

    const { password: userPassword, ...userRest } = user

    return { ...userRest, token }
  }

  /* Logout cierra la sesión, no elimina la usuario de la DB */

  async logout(data: AuthLogout): Promise<string | null> {
    const { id, password } = data

    const existUser = await this.existUser({ id })

    if (!existUser) {
      return null
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return null
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    })

    return `Usuario ${deletedUser.id} eliminado correctamente`
  }
}

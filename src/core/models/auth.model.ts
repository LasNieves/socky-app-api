import { prisma } from '../../config/db'
import jwt from 'jsonwebtoken'
import { hash, genSalt, compare } from 'bcryptjs'
import { User } from '@prisma/client'

import { AuthLogin, AuthRegister, AuthDto } from '../dtos'
import { AuthRepository } from '../repositories'
import { RequireAtLeastOne } from '../../utilities/types'
import { CustomError, NotFound, Conflict } from '../../errors'

export class AuthModel implements AuthRepository {
  private getSignedToken(user: Omit<User, 'password'>): string {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET!)
  }

  private async existUser(
    field: RequireAtLeastOne<Record<'id' | 'email', string>>
  ): Promise<User | null> {
    const existUser = await prisma.user.findUnique({
      where: { ...field },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    return existUser
  }

  private async isValidPassword(
    passwordToCompare: string,
    password: string
  ): Promise<boolean> {
    return await compare(passwordToCompare, password)
  }

  async login(data: AuthLogin): Promise<AuthDto | CustomError> {
    const { email, password } = data
    const existUser = await this.existUser({ email })

    if (!existUser) {
      return new NotFound(`Usuario con email ${email} no encontrado`)
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return new Conflict('Credenciales inválidas')
    }

    const token = this.getSignedToken(existUser)

    const { password: userPassword, ...rest } = existUser

    return { ...rest, token }
  }

  async register(data: AuthRegister): Promise<AuthDto | CustomError> {
    const { email, password, ...rest } = data

    const existUser = await this.existUser({ email })

    if (existUser) {
      return new Conflict(`El email ${email} ya está en uso`)
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
        workspaces: {
          create: {
            workspace: {
              create: {
                name: `${data.firstName}'s workspace`,
                icon: 'Diego Armando Maradona',
              },
            },
            role: 'ADMIN',
          },
        },
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    const token = this.getSignedToken(user)

    return { ...user, token }
  }

  /* Logout cierra la sesión, no elimina la usuario de la DB */

  //  async logout(data: AuthLogout): Promise<string | null> {
  //   const { id, password } = data

  //   const existUser = await this.existUser({ id })

  //   if (!existUser) {
  //     return null
  //   }

  //   const isValid = await this.isValidPassword(password, existUser.password)

  //   if (!isValid) {
  //     return null
  //   }

  //   const deletedUser = await prisma.user.delete({
  //     where: { id },
  //   })

  //   return `Usuario ${deletedUser.id} eliminado correctamente`
  // }
}

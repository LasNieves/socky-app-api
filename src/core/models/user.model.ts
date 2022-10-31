import { compare } from 'bcryptjs'
import { UserRepository } from './../repositories'
import { prisma } from '../../config/db'

import { Conflict, CustomError, NotFound } from '../../errors'
import { UserDto, UsersDto, UserWorkspacesDto } from '../dtos'
import { User } from '../entities'
import { RequireAtLeastOne } from '../../utilities/types'

export class UserModel implements UserRepository {
  private async existUser(
    field: RequireAtLeastOne<Record<'id' | 'email', string>>
  ): Promise<User | null> {
    const existUser = await prisma.user.findUnique({ where: { ...field } })

    return existUser
  }

  private async isValidPassword(
    passwordToCompare: string,
    password: string
  ): Promise<boolean> {
    return await compare(passwordToCompare, password)
  }

  async getAll(): Promise<UsersDto[]> {
    const users = await prisma.user.findMany({
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

    return users
  }

  async getById(id: string): Promise<UserDto | null> {
    const user = await prisma.user.findUnique({
      where: { id },
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
        posts: true,
      },
    })

    return user
  }

  async delete(id: string, password: string): Promise<string | CustomError> {
    const existUser = await this.existUser({ id })

    if (!existUser) {
      return new NotFound(`Usuario con id ${id} no encontrado`)
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return new Conflict('Credenciales inválidas')
    }

    const deletedUser = await prisma.user.delete({ where: { id } })
    return `El usuario con email ${deletedUser.email} fue borrado correctamente`
  }

  async getUserWorkspaces(
    id: string
  ): Promise<UserWorkspacesDto | CustomError> {
    const userWorkspaces = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        workspaces: {
          select: {
            role: true,
            workspace: true,
          },
        },
      },
    })

    if (!userWorkspaces) {
      return new NotFound(`Usuario con id ${id} no encontrado`)
    }

    return userWorkspaces
  }
}

/* export const updateOneUser = async (
  id: string,
  user: updateUserDto
): Promise<UserEntity> => {
  const { ...rest } = user

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { ...rest },
  })

  return updatedUser
}
 */

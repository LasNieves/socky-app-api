import { compare } from 'bcryptjs'

import { prisma } from '../../config/db'

import { UserRepository } from './../repositories'
import { BadRequest, Conflict, CustomError, NotFound } from '../../errors'
import { UserDto, UsersDto, UserWorkspacesDto } from '../dtos'
import { User } from '../entities'
import { RequireAtLeastOne } from '../../utilities/types'

export class UserModel implements UserRepository {
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

  async get(
    field: RequireAtLeastOne<Record<'id' | 'email', string>>
  ): Promise<User | CustomError> {
    const user = await prisma.user.findUnique({
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

    if (!user) {
      return new NotFound(
        `Usuario con ${
          field.email ? `email ${field.email}` : `id ${field.id}`
        }  no encontrado`
      )
    }

    return user
  }

  async getById(id: string): Promise<UserDto | CustomError> {
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

    if (!user) {
      return new NotFound(`Usuario con id ${id} no encontrado`)
    }

    return user
  }

  async delete(id: string, password: string): Promise<User | CustomError> {
    const existUser = await this.get({ id })

    if (existUser instanceof CustomError) {
      return existUser
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return new Conflict('Credenciales inválidas')
    }

    try {
      const deletedUser = await prisma.user.delete({ where: { id } })

      return deletedUser
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al eliminar el usuario')
    }
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

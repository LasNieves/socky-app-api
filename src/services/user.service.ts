import { compare } from 'bcryptjs'

import { prisma } from '../config/db'

import { UserRepository, WorkspaceRepository } from '../core/repositories'
import {
  BadRequest,
  Conflict,
  CustomError,
  NotFound,
  NotAuthorized,
} from '../errors'
import { UserDto, UsersDto, UserWorkspacesDto } from '../core/dtos'
import { User } from '../core/entities'
import { RequireAtLeastOne } from '../core/types'

export class UserService implements UserRepository {
  constructor(private readonly workspaceService: WorkspaceRepository) {}

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

  async getUserRole(
    userId: string,
    workspaceId: string
  ): Promise<string | CustomError> {
    const exist = await this.workspaceService.get(workspaceId)

    if (exist instanceof CustomError) {
      return exist
    }

    const role = await prisma.usersOnWorkspaces.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
      select: { role: true },
    })

    if (!role) {
      return new NotAuthorized(
        `El usuario no pertenece al workspace con id ${workspaceId}`
      )
    }

    return role.role
  }
}

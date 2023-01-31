import { Prisma } from '@prisma/client'
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
import { User } from '../core/entities'
import { UsersDto, UserWorkspacesDto } from '../core/dtos'

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
        verified: true,
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

  async getFirstUserOrThrow(where: Prisma.UserWhereUniqueInput) {
    return await prisma.user.findFirstOrThrow({ where })
  }

  async get(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ): Promise<CustomError | User> {
    const user = await prisma.user.findUnique({
      where,
      include,
    })

    if (!user) {
      return new NotFound(
        `Usuario con ${
          where.email ? `email ${where.email}` : `id ${where.id}`
        }  no encontrado`
      )
    }

    return user
  }

  async delete(id: string, password: string): Promise<User | CustomError> {
    const user = await this.getFirstUserOrThrow({ id }).catch((error) => {
      console.log(error)
      throw new NotFound(`Usuario con id ${id} no encontrado`)
    })

    const isValid = await this.isValidPassword(password, user.password)

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
    await this.workspaceService
      .getFirstWorkspaceOrThrow({ id: workspaceId })
      .catch((error) => {
        console.log(error)
        throw new NotFound(`Workspace con id ${workspaceId} no encontrado`)
      })

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

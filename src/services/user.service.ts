import { Prisma } from '@prisma/client'
import { compare } from 'bcryptjs'

import { prisma } from '../config/db'

import { UserRepository, WorkspaceRepository } from '../core/repositories'
import { Conflict, CustomError, NotFound, NotAuthorized } from '../errors'
import { User } from '../core/entities'
import { UpdateUserDto, UsersDto, UserWorkspacesDto } from '../core/dtos'
import { WorkspaceRole } from '../core/enums'
import { UserWithoutPassword } from '../core/types'

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
        } no encontrado`
      )
    }

    return user
  }

  async update(
    id: string,
    data: UpdateUserDto
  ): Promise<UserWithoutPassword | CustomError> {
    const existUser = await this.getFirstUserOrThrow({ id }).catch((error) => {
      console.log(error)
      return new NotFound(`Usuario con id ${id} no encontrado`)
    })

    if (existUser instanceof CustomError) {
      return existUser
    }

    try {
      const { password, ...user } = await prisma.user.update({
        where: { id },
        data: { profile: { update: { ...data } } },
        include: { profile: true },
      })

      return user
    } catch (error) {
      return new Conflict('Error al actualizar el usuario')
    }
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
      return new Conflict('Error al eliminar el usuario')
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

  async getUserRoleInWorkspace(
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceRole | CustomError> {
    const workspace = await this.workspaceService.get({ id: workspaceId })

    if (workspace instanceof CustomError) {
      return workspace
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

import { Prisma } from '@prisma/client'
import { compare } from 'bcryptjs'

import { prisma } from '../config/db'

import { UserRepository, WorkspaceRepository } from '../core/repositories'
import { Conflict, NotFound } from '../errors'
import { User } from '../core/entities'
import { UpdateProfileDto, UsersDto, UserWorkspacesDto } from '../core/dtos'
import { WorkspaceRole } from '../core/enums'
import { UserWithoutPassword } from '../core/types'
import { workspaceService } from './workspace.service'

class UserService implements UserRepository {
  constructor(private readonly workspaceService: WorkspaceRepository) {}

  async getAll(): Promise<UsersDto[]> {
    return await prisma.user.findMany({
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
  }

  async getFirstUserOrThrow(where: Prisma.UserWhereInput) {
    return await prisma.user.findFirstOrThrow({ where })
  }

  async get(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ): Promise<User | null> {
    return await prisma.user.findUnique({
      where,
      include,
    })
  }

  async updateProfile(
    id: string,
    updatedProfile: UpdateProfileDto
  ): Promise<UserWithoutPassword> {
    await this.getFirstUserOrThrow({ id }).catch(() => {
      throw new NotFound(`Usuario con id ${id} no encontrado`)
    })

    try {
      const { password: _, ...user } = await prisma.user.update({
        where: { id },
        data: { profile: { update: updatedProfile } },
        include: { profile: true },
      })

      return user
    } catch (error) {
      console.log(error)
      throw new Conflict('Error al actualizar el perfil del usuario')
    }
  }

  async delete(id: string, password: string): Promise<User> {
    const user = await this.getFirstUserOrThrow({ id }).catch(() => {
      throw new NotFound(`Usuario con id ${id} no encontrado`)
    })

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Conflict('Credenciales inválidas')
    }

    try {
      return await prisma.user.delete({ where: { id } })
    } catch (error) {
      console.log(error)
      throw new Conflict('Error al eliminar el usuario')
    }
  }

  async getUserWorkspaces(id: string): Promise<UserWorkspacesDto> {
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
      throw new NotFound(`Usuario con id ${id} no encontrado`)
    }

    return userWorkspaces
  }

  async getUserRoleInWorkspace(
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceRole | null> {
    const workspace = await this.workspaceService.get({ id: workspaceId })

    if (!workspace) {
      throw new NotFound(`Workspace con id ${workspaceId} no encontrado`)
    }

    const role = await prisma.usersOnWorkspaces.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
      select: { role: true },
    })

    return role?.role ?? null
  }
}

export const userService = new UserService(workspaceService)

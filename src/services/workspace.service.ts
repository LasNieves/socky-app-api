import { Prisma } from '@prisma/client'

import { prisma } from '../config/db'

import { BadRequest, CustomError, NotFound } from '../errors'
import { CreateWorkspaceDto, WorkspaceDto } from '../core/dtos'
import { Workspace } from '../core/entities'
import { WorkspaceRepository } from '../core/repositories'

class WorkspaceService implements WorkspaceRepository {
  async getAll(): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
      include: {
        users: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    return workspaces
  }

  async getFirstWorkspaceOrThrow(where: Prisma.WorkspaceWhereUniqueInput) {
    return await prisma.workspace.findFirstOrThrow({ where })
  }

  async get(
    where: Prisma.WorkspaceWhereUniqueInput
  ): Promise<WorkspaceDto | null> {
    return await prisma.workspace.findUnique({
      where,
      include: {
        categories: true,
        users: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    })
  }

  async create(
    data: CreateWorkspaceDto,
    userId: string
  ): Promise<Workspace | CustomError> {
    const { name, icon } = data

    try {
      const newWorkspace = prisma.workspace.create({
        data: {
          name,
          icon,
          personal: false,
          users: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
      })

      return newWorkspace
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear el workspace')
    }
  }

  async delete(id: string): Promise<Workspace | CustomError> {
    try {
      const deletedWorkspace = await prisma.workspace.delete({ where: { id } })

      return deletedWorkspace
    } catch (error) {
      console.log(error)
      return new NotFound(`Workspace con id ${id} no encontrado`)
    }
  }
}

export const workspaceService = new WorkspaceService()

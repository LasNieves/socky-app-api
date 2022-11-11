import { prisma } from '../config/db'

import { CustomError, NotFound } from '../errors'
import { WorkspaceDto } from '../core/dtos'
import { Workspace } from '../core/entities'
import { WorkspaceRepository } from '../core/repositories'

export class WorkspaceService implements WorkspaceRepository {
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

  async get(id: string): Promise<WorkspaceDto | CustomError> {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
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

    if (!workspace) {
      return new NotFound(`Workspace con id ${id} no encontrado`)
    }

    return workspace
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

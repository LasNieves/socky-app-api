import { Prisma, WorkspaceRole } from '@prisma/client'

import { prisma } from '../config/db'

import { BadRequest, Conflict, NotFound } from '../errors'
import { CreateWorkspaceDto } from '../core/dtos'
import { Workspace } from '../core/entities'

export class WorkspaceService {
  async getAll(): Promise<Workspace[]> {
    return await prisma.workspace.findMany({
      include: {
        users: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    })
  }

  async getFirstWorkspaceOrThrow(where: Prisma.WorkspaceWhereUniqueInput) {
    return await prisma.workspace.findFirstOrThrow({ where })
  }

  async get(where: Prisma.WorkspaceWhereUniqueInput) {
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
    { isPersonal = false, ...workspace }: CreateWorkspaceDto,
    userId: string
  ): Promise<Workspace> {
    try {
      return prisma.workspace.create({
        data: {
          ...workspace,
          personal: isPersonal,
          trashBin: {
            create: {},
          },
          users: {
            create: {
              userId,
              role: WorkspaceRole.OWNER,
            },
          },
        },
      })
    } catch (error) {
      console.log(error)
      throw new BadRequest('Error al crear el workspace')
    }
  }

  async cleanTrashBin(workspaceId: string): Promise<string> {
    const workspace = await this.getFirstWorkspaceOrThrow({
      id: workspaceId,
    }).catch(() => {
      throw new NotFound(`Workspace con id ${workspaceId} no encontrado`)
    })

    try {
      const { count } = await prisma.post.deleteMany({
        where: { trashBin: { workspaceId: workspace.id } },
      })

      return `Se han eliminado ${count} posts en la papelera del workspace ${workspace.name}`
    } catch (error) {
      console.log(error)
      throw new Conflict(
        `Error al vaciar la papelera del workspace ${workspace.id}`
      )
    }
  }

  async delete(id: string): Promise<string> {
    await this.getFirstWorkspaceOrThrow({ id }).catch(() => {
      throw new NotFound(`Workspace con id ${id} no encontrado`)
    })

    try {
      await prisma.workspace.delete({ where: { id } })
      return `Workspace con id ${id} eliminado`
    } catch (error) {
      console.log(error)
      throw new Conflict('Error al eliminar el workspace')
    }
  }
}

export const workspaceService = new WorkspaceService()

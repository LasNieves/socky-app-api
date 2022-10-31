import { prisma } from '../../config/db'
import { CustomError, NotFound } from '../../errors'
import { WorkspaceDto } from '../dtos'
import { WorkspaceRepository } from './../repositories/workspace.repository'

export class WorkspaceModel implements WorkspaceRepository {
  async getById(id: string): Promise<WorkspaceDto | null> {
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

    return workspace
  }
}

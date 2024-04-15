import { Prisma, WorkspaceRole } from '@prisma/client'

import { prisma } from '../config/db'

import { BadRequest, Conflict, NotFound } from '../errors'
import { CreateWorkspaceDto, RestorePostsDto } from '../core/dtos'
import { Workspace } from '../core/entities'
import { PostService, postService } from './post.service'

export class WorkspaceService {
  constructor(private readonly postService: PostService) {}

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

  async getWorkspaceUsers(workspaceId: string) {
    return await prisma.usersOnWorkspaces.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                color: true,
                avatar: true,
              },
            },
          },
        },
      },
    })
  }

  async create(
    { isPersonal = false, ...workspace }: CreateWorkspaceDto,
    userId: string
  ): Promise<Workspace> {
    console.log(`Creando Workspace ${workspace.name}`)

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

  async restorePosts(
    workspaceId: string,
    { posts, categoryId }: RestorePostsDto
  ): Promise<string> {
    const postsOnWorkspaceTrashBin = (
      await prisma.post.findMany({
        where: { trashBin: { workspaceId } },
        select: { id: true },
      })
    ).map((post) => post.id)

    const allAreInWorkspaceTrash = posts.every((post) =>
      postsOnWorkspaceTrashBin.includes(post)
    )

    if (!allAreInWorkspaceTrash) {
      throw new BadRequest(
        'Algún post enviado no se encuentra en la papelera del workspace'
      )
    }

    for await (const post of posts) {
      await this.postService.restorePost(post, categoryId)
    }

    return `Se han restaurado ${posts.length} posts`
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

export const workspaceService = new WorkspaceService(postService)

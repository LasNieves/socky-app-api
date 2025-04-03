import { prisma } from '../config/db'

import { BadRequest, NotAuthorized, NotFound } from '../errors'
import { CreatePostDto, UpdatePostDto } from '../core/dtos'
import { Post } from '../core/entities'

export class PostService {
  async getByCategory(id: number) {
    return await prisma.post.findMany({
      where: { categoryId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                avatar: true,
                color: true,
              },
            },
          },
        },
      },
    })
  }

  async getByWorkspace(id: string) {
    return await prisma.post.findMany({
      where: { category: { workspaceId: id } },
      include: {
        category: {
          select: {
            title: true,
            createdAt: true,
          },
        },
      },
    })
  }

  async get(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            workspace: true,
          },
        },
        trashBin: true,
      },
    })
  }

  async create(post: CreatePostDto & { userId: string }): Promise<Post> {
    try {
      return await prisma.post.create({
        data: post,
      })
    } catch (error) {
      console.log(error)
      throw new BadRequest('Error al crear el post')
    }
  }

  async update(
    postId: string,
    workspaceId: string,
    data: UpdatePostDto
  ): Promise<Post> {
    const post = await this.get(postId)

    if (!post) {
      throw new NotFound(`No se ha encontrado el post ${postId}`)
    }
    if (post.trashBinId) {
      throw new BadRequest(
        `No puedes editar un post que se encuentra en la papelera`
      )
    }

    const { categoryId } = data

    if (categoryId) {
      const existCategory = await prisma.category
        .findUniqueOrThrow({ where: { id: categoryId } })
        .catch(() => {
          throw new NotFound(`Categoría con id ${categoryId} no encontrada`)
        })

      const canEditPost = existCategory.workspaceId === workspaceId

      if (!canEditPost) {
        throw new NotAuthorized(
          'La categoría enviada no pertenece al workspace del post que estas editando'
        )
      }
    }

    try {
      return await prisma.post.update({
        where: { id: postId },
        data,
      })
    } catch (error) {
      console.log(error)
      throw new BadRequest(`Error al actualizar un post`)
    }
  }

  async movePostToTrashBin(postId: string): Promise<string> {
    const post = await this.get(postId)

    if (!post) {
      throw new NotFound(`No se ha encontrado el post ${postId}`)
    }

    if (post.trashBinId) {
      throw new BadRequest(`El post ya se encuentra en la papelera`)
    }

    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          category: {
            disconnect: true,
          },
          trashBin: {
            connect: {
              workspaceId: post.category?.workspaceId,
            },
          },
        },
      })

      return `Post en papelera`
    } catch (error) {
      console.log(error)
      throw new BadRequest(`Error al mover a la papelera el post ${postId}`)
    }
  }

  async restorePost(postId: string, categoryId: number): Promise<string> {
    const post = await this.get(postId)

    if (!post) {
      throw new NotFound(`No se ha encontrado el post ${postId}`)
    }

    if (!post.trashBinId) {
      throw new BadRequest('El post no se encuentra en la papelera')
    }

    const category = await prisma.category
      .findUniqueOrThrow({ where: { id: categoryId } })
      .catch(() => {
        throw new NotAuthorized(
          'No se encontró la categoría en la que quieres restablecer el post'
        )
      })

    if (category.workspaceId !== post.trashBin?.workspaceId) {
      throw new NotAuthorized(
        'La categoría enviada no pertenece al workspace del post que estas restableciendo'
      )
    }

    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          trashBin: {
            disconnect: true,
          },
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      })

      return `El post se ha restablecido en la categoría ${category.title}`
    } catch (error) {
      console.log(error)
      throw new BadRequest(`Error al recuperar el post ${postId}`)
    }
  }

  async permantlyDelete(postId: string): Promise<string> {
    const post = await this.get(postId)

    if (!post) {
      throw new NotFound(`No se ha encontrado el post ${postId}`)
    }

    if (!post.trashBinId) {
      throw new BadRequest(`El post no se encuentra en la papelera`)
    }

    try {
      await prisma.post.delete({ where: { id: postId } })

      return `Post con id ${postId} eliminado de forma permanente`
    } catch (error) {
      console.log(error)
      throw new BadRequest(`Error al eliminar un post`)
    }
  }
}

export const postService = new PostService()

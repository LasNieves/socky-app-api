import { prisma } from '../config/db'

import { BadRequest, NotAuthorized, NotFound } from '../errors'
import { CreatePostDto, UpdatePostDto } from '../core/dtos'
import { Post } from '../core/entities'
import { CategoryService, categoryService } from '.'

export class PostService {
  constructor(private readonly categoryService: CategoryService) {}

  async getByCategory(id: number) {
    return await prisma.post.findMany({
      where: { categoryId: id },
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
    const { categoryId } = data

    if (categoryId) {
      const existCategory = await this.categoryService.get({ id: categoryId })
      if (!existCategory) {
        throw new NotFound(`Categoría con id ${categoryId} no encontrada`)
      }

      const canEditPost = await this.categoryService.categoryBelongsToWorkspace(
        categoryId,
        workspaceId
      )

      if (!canEditPost) {
        throw new NotAuthorized(
          `La categoría ${categoryId} no pertenece al workspace del post que estas editando`
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

  async delete(id: string): Promise<string> {
    try {
      await prisma.post.delete({ where: { id } })
      return `Post con id ${id} eliminado correctamente`
    } catch (error) {
      console.log(error)
      throw new BadRequest(`Error al eliminar un post`)
    }
  }
}

export const postService = new PostService(categoryService)

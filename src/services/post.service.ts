import { prisma } from '../config/db'

import { BadRequest, CustomError, NotAuthorized, NotFound } from '../errors'
import {
  CategoriesDto,
  CreatePostDto,
  PostDto,
  UpdatePostDto,
} from '../core/dtos'
import { Post } from '../core/entities'
import {
  CategoryRepository,
  PostRepository,
  WorkspaceRepository,
} from '../core/repositories'

export class PostService implements PostRepository {
  constructor(
    private readonly categoryService: CategoryRepository,
    private readonly workspaceService: WorkspaceRepository
  ) {}

  private async categoryBelongsToWorkspace(
    workspaceId: string,
    categoryId: number
  ): Promise<CategoriesDto | CustomError> {
    const categories = await this.categoryService.getByWorkspace(workspaceId)

    const category = (categories as CategoriesDto[]).find(
      (category) => category.id === categoryId
    )

    if (!category) {
      return new NotAuthorized(
        `La categoría ${categoryId} no pertenece al workspace ${workspaceId} `
      )
    }

    return category
  }

  async getByWorkspace(id: string): Promise<Post[] | CustomError> {
    const existWorkspace = await this.workspaceService.get(id)

    if (existWorkspace instanceof CustomError) {
      return existWorkspace
    }

    const posts = await prisma.post.findMany({
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

    return posts
  }

  async get(id: string): Promise<PostDto | CustomError> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        categoryId: true,
        userId: true,
        category: {
          include: {
            workspace: true,
          },
        },
      },
    })

    if (!post) {
      return new NotFound(`Post con id ${id} no encontrado`)
    }

    return post
  }

  async create(data: CreatePostDto): Promise<Post | CustomError> {
    const { title, description, categoryId, userId } = data

    const existCategory = await this.categoryService.get(categoryId)

    if (existCategory instanceof CustomError) {
      return existCategory
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          description,
          categoryId,
          userId,
        },
      })
      return post
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear el post')
    }
  }

  async update(
    postId: string,
    workspaceId: string,
    data: UpdatePostDto
  ): Promise<Post | CustomError> {
    const { categoryId } = data
    if (categoryId) {
      const existCategory = await this.categoryService.get(categoryId)

      if (existCategory instanceof CustomError) {
        return existCategory
      }

      const categoryBelongsToWorkspace = await this.categoryBelongsToWorkspace(
        workspaceId,
        categoryId
      )

      if (categoryBelongsToWorkspace instanceof CustomError) {
        return categoryBelongsToWorkspace
      }
    }

    try {
      const updatePost = await prisma.post.update({
        where: { id: postId },
        data,
      })
      return updatePost
    } catch (error) {
      console.log(error)
      return new NotFound(`Post con id ${postId} no encontrado`)
    }
  }

  async delete(id: string): Promise<Post | CustomError> {
    try {
      const deletedPost = await prisma.post.delete({ where: { id } })
      return deletedPost
    } catch (error) {
      console.log(error)
      return new NotFound(`Post con id ${id} no encontrado`)
    }
  }
}

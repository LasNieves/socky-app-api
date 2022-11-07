import { prisma } from '../../config/db'

import { BadRequest, CustomError, NotFound } from '../../errors'
import { CreatePostDto, UpdatePostDto } from '../dtos'
import { Post } from '../entities'
import {
  CategoryRepository,
  PostRepository,
  UserRepository,
  WorkspaceRepository,
} from './../repositories'

export class PostModel implements PostRepository {
  constructor(
    private readonly userModel: UserRepository,
    private readonly categoryModel: CategoryRepository,
    private readonly workspaceModel: WorkspaceRepository,
  ) { }

  async getByWorkspace(id: string): Promise<Post[] | CustomError> {
    const existWorkspace = await this.workspaceModel.get(id)

    if (existWorkspace instanceof CustomError) {
      return existWorkspace
    }

    const posts = await prisma.post.findMany({
      where: { category: { workspaceId: id } },
      include: {
        user: true, category: {
          select: {
            title: true,
            createdAt: true
          }
        }
      }
    })

    return posts
  }

  async get(id: string): Promise<Post | CustomError> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        categoryId: true,
        userId: true,
      },
    })

    if (!post) {
      return new NotFound('Post no encontrado')
    }

    return post
  }

  async create(data: CreatePostDto): Promise<Post | CustomError> {
    const { title, description, categoryId, userId } = data

    const existUser = await this.userModel.get({ id: userId })

    if (!existUser) {
      return new NotFound(`Usuario con id ${userId} no encontrado`)
    }

    const existCategory = await this.categoryModel.get(categoryId)

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


  async update(id: string, data: UpdatePostDto): Promise<Post | CustomError> {
    if (data.categoryId) {
      const existCategory = await this.categoryModel.get(data.categoryId)

      if (existCategory instanceof CustomError) {
        return existCategory
      }
    }

    try {
      const updatePost = await prisma.post.update({ where: { id }, data })
      return updatePost
    } catch (error) {
      console.log(error)
      return new NotFound(`Post con id ${id} no encontrado`)
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

  // TODO: GET Posts by Workspace & Update Post


}

import { prisma } from '../../config/db'

import { BadRequest, CustomError, NotFound } from '../../errors'
import { CreatePostDto } from '../dtos'
import { Post } from '../entities'
import {
  CategoryRepository,
  PostRepository,
  UserRepository,
} from './../repositories'

export class PostModel implements PostRepository {
  constructor(
    private userModel: UserRepository,
    private categoryModel: CategoryRepository
  ) {}

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

    const existCategory = await this.categoryModel.get(+categoryId)

    if (existCategory instanceof CustomError) {
      return existCategory
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          description,
          categoryId: +categoryId,
          userId,
        },
      })
      return post
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear el post')
    }
  }

  async delete(id: string): Promise<Post | CustomError> {
    try {
      const deletedPost = await prisma.post.delete({ where: { id } })
      return deletedPost
    } catch (error) {
      console.log(error)
      return new NotFound('Post no encontrado')
    }
  }

  // TODO: GET Posts by Workspace & Update Post
}

import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

import { BadRequest, Conflict, NotFound } from '../errors'
import { CreateCategoryDto, UpdateCategoryDto } from '../core/dtos'
import { Category } from '../core/entities'
import { WorkspaceService, workspaceService } from './workspace.service'

export class CategoryService {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async getByWorkspace(id: string) {
    const categories = await prisma.category.findMany({
      where: { workspaceId: id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    return categories.map(({ _count, ...category }) => ({
      ...category,
      posts: _count.posts,
    }))
  }

  async get(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude
  ) {
    return await prisma.category.findUnique({
      where,
      include,
    })
  }

  async categoryBelongsToWorkspace(
    categoryId: number,
    workspaceId: string
  ): Promise<boolean> {
    const foundCategory = await prisma.category.findFirst({
      where: { AND: [{ id: categoryId, workspaceId }] },
    })

    return !!foundCategory
  }

  async create({ title, workspaceId }: CreateCategoryDto): Promise<Category> {
    const workspace = await this.workspaceService.get({ id: workspaceId })

    if (!workspace) {
      throw new NotFound(
        `El workspace con id ${workspaceId} no se ha encontrado`
      )
    }

    const categoryTitles = workspace.categories.map((category) =>
      category.title.toLowerCase()
    )

    if (categoryTitles.includes(title.toLowerCase())) {
      throw new Conflict(`La categoria ${title} ya existe en el workspace`)
    }

    try {
      return await prisma.category.create({
        data: {
          title,
          workspaceId,
        },
      })
    } catch (error) {
      console.log(error)
      throw new BadRequest('Error al crear la categoría')
    }
  }

  async update(id: number, { title }: UpdateCategoryDto): Promise<Category> {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          title,
        },
      })
    } catch (error) {
      console.log(error)
      throw new Conflict(`Error al actualizar la categoría`)
    }
  }

  async delete(id: number): Promise<string> {
    try {
      await prisma.category.delete({ where: { id } })

      return `Categoría con id ${id} eliminada correctamente`
    } catch (error) {
      console.log(error)
      throw new Conflict(`Error al eliminar la categoría`)
    }
  }
}

export const categoryService = new CategoryService(workspaceService)

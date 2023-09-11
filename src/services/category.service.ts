import { prisma } from '../config/db'

import { BadRequest, Conflict, NotFound } from '../errors'
import { WorkspaceRepository, CategoryRepository } from '../core/repositories'
import {
  CategoriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../core/dtos'
import { Category } from '../core/entities'
import { workspaceService } from './workspace.service'
import { Prisma } from '@prisma/client'

class CategoryService implements CategoryRepository {
  constructor(private readonly workspaceService: WorkspaceRepository) {}

  async getByWorkspace(id: string): Promise<CategoriesDto[]> {
    return await prisma.category.findMany({
      where: { workspaceId: id },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })
  }

  async get(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude
  ): Promise<Category | null> {
    return await prisma.category.findUnique({
      where,
      include,
    })
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

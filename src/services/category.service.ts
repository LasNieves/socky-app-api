import { prisma } from '../config/db'

import { BadRequest, Conflict, CustomError, NotFound } from '../errors'
import { WorkspaceRepository, CategoryRepository } from '../core/repositories'
import {
  CategoriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../core/dtos'
import { Category } from '../core/entities'

export class CategoryService implements CategoryRepository {
  constructor(private readonly workspaceService: WorkspaceRepository) {}

  private validateIdType(id: number): CustomError | true {
    if (isNaN(id)) {
      return new BadRequest('El id de la categoría debe ser un número')
    }

    return true
  }

  async getByWorkspace(id: string): Promise<CategoriesDto[]> {
    const categories = await prisma.category.findMany({
      where: { workspaceId: id },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })

    return categories
  }

  async get(id: number): Promise<Category | CustomError> {
    const isNumber = this.validateIdType(id)

    if (isNumber instanceof CustomError) {
      return isNumber
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { posts: true },
    })

    if (!category) {
      return new NotFound(`Categoría con id ${id} no encontrada`)
    }

    return category
  }

  async create(data: CreateCategoryDto): Promise<Category | CustomError> {
    const { title, workspaceId } = data
    const existWorkspace = await this.workspaceService.get(workspaceId)

    if (existWorkspace instanceof CustomError) {
      return existWorkspace
    }

    const categoryTitles = existWorkspace.categories?.map((category) =>
      category.title.toLowerCase()
    )

    if (categoryTitles?.includes(title.toLowerCase())) {
      return new Conflict(`La categoria ${title} ya fue creada`)
    }

    try {
      const category = await prisma.category.create({
        data: {
          title,
          workspaceId,
        },
      })

      return category
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear la categoría')
    }
  }

  async update(
    id: number,
    data: UpdateCategoryDto
  ): Promise<Category | CustomError> {
    const { title } = data

    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          title,
        },
      })
      return updatedCategory
    } catch (error) {
      console.log(error)
      return new Conflict(`Error al actualizar la categoría`)
    }
  }

  async delete(id: number): Promise<Category | CustomError> {
    try {
      const deletedCategory = await prisma.category.delete({ where: { id } })

      return deletedCategory
    } catch (error) {
      console.log(error)
      return new Conflict(`Error al eliminar la categoría`)
    }
  }
}

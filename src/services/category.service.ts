import { prisma } from '../config/db'

import { BadRequest, Conflict, CustomError, NotFound } from '../errors'
import { WorkspaceRepository, CategoryRepository } from '../core/repositories'
import { CategoriesDto, CreateCategoryDto } from '../core/dtos'
import { Category } from '../core/entities'

export class CategoryService implements CategoryRepository {
  constructor(private readonly workspaceService: WorkspaceRepository) {}

  async getByWorkspace(id: string): Promise<CategoriesDto[] | CustomError> {
    const existWorkspace = await this.workspaceService.get(id)

    if (existWorkspace instanceof CustomError) {
      return existWorkspace
    }

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
    if (isNaN(id)) {
      return new BadRequest('El id de la categoría debe ser un número')
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

  async delete(id: number): Promise<Category | CustomError> {
    if (isNaN(id)) {
      return new BadRequest('El id de la categoría debe ser un número')
    }

    try {
      const deletedCategory = await prisma.category.delete({ where: { id } })
      return deletedCategory
    } catch (error) {
      console.log(error)
      return new NotFound('Categoría no encontrada')
    }
  }
}

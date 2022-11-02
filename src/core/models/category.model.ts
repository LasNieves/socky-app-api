import { prisma } from '../../config/db';
import { Conflict, CustomError, NotFound } from '../../errors';
import { CategoriesDto, CategoryDto } from '../dtos';
import { Category, Workspace } from '../entities';
import { CreateCategoryDto } from './../dtos/category.dto';
import { CategoryRepository } from './../repositories/category.repository';

export class CategoryModel implements CategoryRepository {
    private async getWorkspace(id: string): Promise<Workspace | null> {
        const existWorkspace = await prisma.workspace.findUnique({ where: { id }, include: { categories: true, } })
        return existWorkspace
    }

    async getCategoriesByWorkspace(id: string): Promise<CategoriesDto[] | CustomError> {
        const existWorkspace = await this.getWorkspace(id)

        if (!existWorkspace) {
            return new NotFound(`Workspace con ${id} no encontrado`)
        }

        const categories = await prisma.category.findMany({
            where: { workspaceId: id },
            select: {
                id: true,
                title: true,
                createdAt: true,
            }
        })
        return categories


    }

    async getCategoryByWorkspace(workspaceId: string, categoryId: number): Promise<CategoryDto | CustomError> {
        const existWorkspace = await this.getWorkspace(workspaceId)

        if (!existWorkspace) {
            return new NotFound(`Workspace con id ${workspaceId} no encontrado`)
        }

        const category = await prisma.category.findUnique({ where: { id: categoryId }, include: { posts: true, } })

        if (!category) {
            return new NotFound(`Categoría con id ${categoryId} no encontrado`)
        }

        return category
    }

    async createCategory(data: CreateCategoryDto): Promise<Category | CustomError> {
        const { title, workspaceId } = data
        const existWorkspace = await this.getWorkspace(workspaceId)

        if (!existWorkspace) {
            return new NotFound(`Workspace con id ${workspaceId} no encontrado`)
        }

        const categoryTitles = existWorkspace.categories?.map(category => category.title.toLowerCase())

        if (categoryTitles?.includes(title.toLowerCase())) {
            return new Conflict(`La categoria ${title} ya fue creada`)

        }

        const category = await prisma.category.create({
            data: {
                title,
                workspaceId
            }
        })
        return category
    }
}
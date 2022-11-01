import { prisma } from '../../config/db';
import { CustomError, NotFound } from '../../errors';
import { CategoriesDto, CategoryDto } from '../dtos';
import { Workspace } from '../entities';
import { CategoryRepository } from './../repositories/category.repository';

export class CategoryModel implements CategoryRepository {
    private async getWorkspace(id: string): Promise<Workspace | null> {
        const existWorkspace = await prisma.workspace.findUnique({ where: { id } })
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
        return new NotFound(`Workspace con  no encontrado`)
    }


}
import { CustomError } from '../../errors';
import { Category } from '../entities';
import { CategoryDto, CategoriesDto, CreateCategoryDto } from './../dtos/category.dto';

export interface CategoryRepository {
    getCategoriesByWorkspace(id: string): Promise<CategoriesDto[] | CustomError>
    getCategoryByWorkspace(workspaceId: string, categoryId: number): Promise<CategoryDto | CustomError>
    createCategory(data: CreateCategoryDto): Promise<Category | CustomError>
}

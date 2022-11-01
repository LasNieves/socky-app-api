import { CustomError } from '../../errors';
import { CategoryDto, CategoriesDto } from './../dtos/category.dto';

export interface CategoryRepository {
    getCategoriesByWorkspace(id: string): Promise<CategoriesDto[] | CustomError>
    getCategoryByWorkspace(workspaceId: string, categoryId: number): Promise<CategoryDto | CustomError>
}

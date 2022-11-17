import { CustomError } from '../../errors'
import { Category } from '../entities'
import { CategoriesDto, CreateCategoryDto, UpdateCategoryDto } from './../dtos'

export interface CategoryRepository {
  getByWorkspace(id: string): Promise<CategoriesDto[] | CustomError>
  get(id: number): Promise<Category | CustomError>
  create(data: CreateCategoryDto): Promise<Category | CustomError>
  update(id: number, data: UpdateCategoryDto): Promise<Category | CustomError>
  delete(id: number, workspaceId: string): Promise<Category | CustomError>
}

import { Prisma } from '@prisma/client'
import { Category } from '../entities'
import { CategoriesDto, CreateCategoryDto, UpdateCategoryDto } from './../dtos'

export interface CategoryRepository {
  getByWorkspace(id: string): Promise<CategoriesDto[]>
  get(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude
  ): Promise<Category | null>
  create(data: CreateCategoryDto): Promise<Category>
  update(id: number, data: UpdateCategoryDto): Promise<Category>
  delete(id: number): Promise<string>
}

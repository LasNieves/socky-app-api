import { Post } from "../entities"

export interface CategoryDto {
  id: number
  title: string
  createdAt: Date
  workspaceId: string
  posts: Post[]
}


export interface CategoriesDto {
  id: number
  title: string
  createdAt: Date
}
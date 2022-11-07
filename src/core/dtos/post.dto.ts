export interface CreatePostDto {
  title: string
  description: string
  categoryId: number
  userId: string
}

export interface UpdatePostDto {
  title?: string
  description?: string
  categoryId?: number
}

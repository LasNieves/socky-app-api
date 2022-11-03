export interface PostDto {
    id: string
    title: string
    description: string
    createdAt: Date
    categoryId: number
    userId: string
}


export interface CreatePostDto {
    title: string
    description: string
    categoryId: number
    userId: string
}
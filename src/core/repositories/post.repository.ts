import { CreatePostDto, PostDto, UpdatePostDto } from './../dtos'
import { Post } from '../entities'

export interface PostRepository {
  getByWorkspace(id: string): Promise<Post[]>
  get(id: string): Promise<PostDto | null>
  create(data: CreatePostDto & { userId: string }): Promise<Post>
  update(
    postId: string,
    workspaceId: string,
    data: UpdatePostDto
  ): Promise<Post>
  delete(id: string): Promise<string>
}

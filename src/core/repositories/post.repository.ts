import { CustomError } from '../../errors'
import { CreatePostDto, PostDto, UpdatePostDto } from './../dtos'
import { Post } from '../entities'

export interface PostRepository {
  getByWorkspace(id: string): Promise<Post[] | CustomError>
  get(id: string): Promise<PostDto | CustomError>
  create(data: CreatePostDto): Promise<Post | CustomError>
  update(
    postId: string,
    workspaceId: string,
    data: UpdatePostDto
  ): Promise<Post | CustomError>
  delete(id: string): Promise<Post | CustomError>
}

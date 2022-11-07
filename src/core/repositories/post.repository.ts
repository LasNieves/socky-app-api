import { CustomError } from '../../errors'
import { CreatePostDto, UpdatePostDto } from './../dtos'
import { Post } from '../entities'

export interface PostRepository {
  getByWorkspace(id: string): Promise<Post[] | CustomError>
  get(id: string): Promise<Post | CustomError>
  create(data: CreatePostDto): Promise<Post | CustomError>
  update(id: string, data: UpdatePostDto): Promise<Post | CustomError>
  delete(id: string): Promise<Post | CustomError>
}

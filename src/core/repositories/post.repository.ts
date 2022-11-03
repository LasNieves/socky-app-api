import { CustomError } from '../../errors'
import { CreatePostDto } from './../dtos'
import { Post } from '../entities'

export interface PostRepository {
  get(id: string): Promise<Post | CustomError>
  create(data: CreatePostDto): Promise<Post | CustomError>
  delete(id: string): Promise<Post | CustomError>
}

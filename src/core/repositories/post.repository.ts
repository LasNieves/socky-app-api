import { PostDto } from './../dtos/post.dto';
import { CustomError } from '../../errors';
import { CreatePostDto } from '../dtos/post.dto';
import { Post } from '../entities';

export interface PostRepository {
    getOnePost(id: string): Promise<PostDto | null>
    createPost(data: CreatePostDto): Promise<Post | CustomError>
    delete(id: string): Promise<Post | CustomError>

}

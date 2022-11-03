import { BadRequest, CustomError, NotFound } from '../../errors';
import { CreatePostDto, PostDto } from '../dtos/post.dto';
import { Post, User, Category } from '../entities';
import { PostRepository } from './../repositories/';
import { prisma } from '../../config/db';
import { RequireAtLeastOne } from '../../utilities/types';


export class PostModel implements PostRepository {

    private async getCategory(id: number): Promise<Category | null> {
        const existCategory = await prisma.category.findUnique({ where: { id } })
        return existCategory
    }

    private async existUser(
        field: RequireAtLeastOne<Record<'id' | 'email', string>>
    ): Promise<User | null> {
        const existUser = await prisma.user.findUnique({ where: { ...field } })

        return existUser
    }


    async getOnePost(id: string): Promise<PostDto | null> {

        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                categoryId: true,
                userId: true
            }
        })
        return post

    }

    async createPost(data: CreatePostDto): Promise<Post | CustomError> {
        const { title, description, categoryId, userId } = data

        const existUser = await this.existUser({ id: userId })

        if (!existUser) {
            return new NotFound(`Usuario con id ${userId} no encontrado`)
        }

        const existCategory = await this.getCategory(+categoryId)

        if (!existCategory) {
            return new NotFound(`La categoria con el ${title} no encontrado`)
        }

        const post = await prisma.post.create({
            data: {
                title,
                description,
                categoryId: +categoryId,
                userId,
            }
        })
        return post

    }

    async delete(id: string): Promise<Post | CustomError> {

        try {
            const deletedPost = await prisma.post.delete({ where: { id } })
            return deletedPost
        } catch (error) {
            console.log(error)
            return new NotFound("Post no encontrada")
        }
    }
}
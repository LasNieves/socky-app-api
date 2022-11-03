import { NextFunction, Request, Response } from 'express';
import { PostModel } from "../core/models/post.model"
import { CustomError, NotFound } from '../errors';

const postModel = new PostModel()

export const getOnePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { ID } = req.params
    const post = await postModel.getOnePost(ID)

    if (!post) {
        return next(new NotFound('Post no encontrado'))
    }

    res.status(200).json(post)
}

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { title, description, categoryId, userId } = req.body

    const post = await postModel.createPost({
        title,
        description,
        categoryId,
        userId
    })

    if (post instanceof CustomError) {
        return next(post)
    }

    res.status(200).json({
        message: 'Post creado correctamente',
        data: post
    })

}

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { ID } = req.params


    const post = await postModel.delete(ID)

    if (post instanceof CustomError) {
        return next(post)
    }

    res.status(200).json({
        message: 'Post eliminada correctamente',
        data: post
    })
}
import { NextFunction, Request, Response } from 'express'

import { PostModel } from '../core/models'
import { CustomError } from '../errors'
import { categoryModel } from './category.controller'
import { userModel } from './user.controller'

export const postModel = new PostModel(userModel, categoryModel)

export const getOnePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const post = await postModel.get(ID)

  if (post instanceof CustomError) {
    return next(post)
  }

  res.status(200).json(post)
}

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, categoryId, userId } = req.body

  const post = await postModel.create({
    title,
    description,
    categoryId,
    userId,
  })

  if (post instanceof CustomError) {
    return next(post)
  }

  res.status(200).json({
    message: 'Post creado correctamente',
    data: post,
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
    message: 'Post eliminado correctamente',
    data: post,
  })
}

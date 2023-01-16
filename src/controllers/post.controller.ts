import { NextFunction, Request, Response } from 'express'

import { PostService } from '../services'
import { CustomError } from '../errors'

import { categoryService } from './category.controller'
import { workspaceService } from './workspace.controller'

export const postService = new PostService(categoryService, workspaceService)

export const getByWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const posts = await postService.getByWorkspace(ID)

  if (posts instanceof CustomError) {
    return next(posts)
  }

  res.status(200).json(posts)
}

export const getOnePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const post = await postService.get(ID)

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
  const { title, description, categoryId } = req.body
  const { id } = req.user!

  const post = await postService.create({
    title,
    description,
    categoryId,
    userId: id,
  })

  if (post instanceof CustomError) {
    return next(post)
  }

  res.status(200).json({
    message: 'Post creado correctamente',
    data: post,
  })
}

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const data = req.body

  const post = await postService.update(ID, req.workspaceId, data)

  if (post instanceof CustomError) {
    return next(post)
  }

  res.status(200).json({
    message: 'Post actualizado correctamente',
    data: post,
  })
}

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  const post = await postService.delete(ID)

  if (post instanceof CustomError) {
    return next(post)
  }

  res.status(200).json({
    message: 'Post eliminado correctamente',
    data: post,
  })
}

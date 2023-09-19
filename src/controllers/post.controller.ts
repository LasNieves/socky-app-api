import { NextFunction, Request, Response } from 'express'

import { NotFound } from '../errors'
import { postService } from '../services'

export const getByWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const posts = await postService.getByWorkspace(ID)

  if (!posts) {
    return next(new NotFound(`El workspace con id ${ID} no se ha encontrado`))
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

  if (!post) {
    return next(new NotFound(`El post con id ${ID} no se ha encontrado`))
  }

  res.status(200).json(post)
}

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!

  try {
    const post = await postService.create({
      ...req.body,
      userId: id,
    })

    res.status(201).json({
      message: 'Post creado correctamente',
      data: post,
    })
  } catch (err) {
    return next(err)
  }
}

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const post = await postService.update(ID, req.workspaceId!, req.body)

    res.status(200).json({
      message: 'Post actualizado correctamente',
      data: post,
    })
  } catch (err) {
    return next(err)
  }
}

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  try {
    const message = await postService.delete(ID)

    res.status(200).json({
      message,
    })
  } catch (err) {
    return next(err)
  }
}

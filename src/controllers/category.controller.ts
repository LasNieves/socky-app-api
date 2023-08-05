import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors'
import { categoryService } from '../services'

export const getByWorkspace = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { ID } = req.params
  const category = await categoryService.getByWorkspace(ID)

  res.status(200).json(category)
}

export const getOneCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const category = await categoryService.get(+ID)

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(200).json(category)
}

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, workspaceId } = req.body

  const category = await categoryService.create({
    title,
    workspaceId,
  })

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(201).json({
    message: 'Categoría creada correctamente',
    data: category,
  })
}

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const data = req.body

  const category = await categoryService.update(+ID, data)

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(200).json({
    message: 'Categoría actualizada correctamente',
    data: category,
  })
}

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params

  const category = await categoryService.delete(+ID)

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(200).json({
    message: 'Categoría eliminada correctamente',
    data: category,
  })
}

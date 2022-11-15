import { NextFunction, Request, Response } from 'express'

import { CategoryService } from '../services/category.service'
import { CustomError } from '../errors'
import { workspaceService } from './workspace.controller'

export const categoryService = new CategoryService(workspaceService)

export const getByWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const category = await categoryService.getByWorkspace(ID)

  if (category instanceof CustomError) {
    return next(category)
  }

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

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params

  const category = await categoryService.delete(+categoryId)

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(200).json({
    message: 'Categoría eliminada correctamente',
    data: category,
  })
}

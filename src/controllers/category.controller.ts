import { NextFunction, Request, Response } from 'express'

import { CategoryModel } from '../core/models/category.model'
import { CustomError } from '../errors'
import { workspaceModel } from './workspace.controller'

export const categoryModel = new CategoryModel(workspaceModel)

export const getByWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  const category = await categoryModel.getByWorkspace(ID)

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
  const category = await categoryModel.get(+ID)

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

  const category = await categoryModel.create({
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
  const { ID } = req.params

  const category = await categoryModel.delete(+ID)

  if (category instanceof CustomError) {
    return next(category)
  }

  res.status(200).json({
    message: 'Categoría eliminada correctamente',
    data: category,
  })
}

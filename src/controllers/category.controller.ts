import { NextFunction, Request, Response } from 'express'

import { BadRequest, NotFound } from '../errors'
import { categoryService } from '../services'

const canCoerceToNumber = (value: any): value is number =>
  !Object.is(Number(value), NaN)

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
  if (!canCoerceToNumber(ID)) {
    throw new BadRequest(`El ID de la categoría debe ser un número`)
  }

  const category = await categoryService.get({ id: +ID }, { posts: true })

  if (!category) {
    next(new NotFound(`La categoría con id ${ID} no se ha encontrado`))
  }

  res.status(200).json(category)
}

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.create(req.body)

    res.status(201).json({
      message: 'Categoría creada correctamente',
      data: category,
    })
  } catch (err) {
    return next(err)
  }
}

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  if (!canCoerceToNumber(ID)) {
    throw new BadRequest(`El ID de la categoría debe ser un número`)
  }

  try {
    const category = await categoryService.update(+ID, req.body)

    res.status(200).json({
      message: 'Categoría actualizada correctamente',
      data: category,
    })
  } catch (err) {
    return next(err)
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ID } = req.params
  if (!canCoerceToNumber(ID)) {
    throw new BadRequest(`El ID de la categoría debe ser un número`)
  }

  try {
    const message = await categoryService.delete(+ID)

    res.status(200).json({
      message,
    })
  } catch (err) {
    return next(err)
  }
}

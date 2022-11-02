import { NextFunction, Request, Response } from 'express'
import { CategoryModel } from '../core/models/category.model'
import { CustomError } from '../errors'

const categoryModel = new CategoryModel()

export const getCategoriesByWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { ID } = req.params
    const category = await categoryModel.getCategoriesByWorkspace(ID)

    if (category instanceof CustomError) {
        return next(category)
    }

    res.status(200).json(category)
}


export const getCategoryByWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { workspaceId, categoryId } = req.params
    const category = await categoryModel.getCategoryByWorkspace(workspaceId, +categoryId)

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

    const category = await categoryModel.createCategory({
        title,
        workspaceId
    })

    if (category instanceof CustomError) {
        return next(category)
    }

    res.status(201).json({
        message: 'Categoria creada correctamente',
        data: category
    })

}
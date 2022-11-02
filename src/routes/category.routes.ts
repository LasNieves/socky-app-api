import { validateRequest } from './../middlewares/validateRequest';
import { createCategory, deleteCategory, getCategoriesByWorkspace, getCategoryByWorkspace } from './../controllers/category.controller';
import { Router } from 'express'
import { body } from 'express-validator';

export const categoryRouter = Router()

categoryRouter.get('/:ID', getCategoriesByWorkspace)

categoryRouter.get('/:workspaceId/category/:categoryId', getCategoryByWorkspace)

categoryRouter.post('/',
    body("title").trim().isString().notEmpty().withMessage("Campo requerido"),
    body("workspaceId").trim().isString().notEmpty().withMessage("Campo requerido"),
    validateRequest, createCategory)

categoryRouter.delete('/:ID', deleteCategory)

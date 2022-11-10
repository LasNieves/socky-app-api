import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares/validateRequest'
import {
  createCategory,
  deleteCategory,
  getByWorkspace,
  getOneCategory,
} from './../controllers/category.controller'
import { protect } from '../middlewares/auth'

export const categoryRouter = Router()

categoryRouter.get('/workspace/:ID', getByWorkspace)

categoryRouter.get('/:ID', getOneCategory)

categoryRouter.post(
  '/',
  protect,
  body('title').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('workspaceId')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Campo requerido'),
  validateRequest,
  createCategory
)

categoryRouter.delete('/:ID', deleteCategory)

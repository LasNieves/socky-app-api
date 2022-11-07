import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares/validateRequest'
import {
  createPost,
  deletePost,
  getByWorkspace,
  getOnePost,
  updatePost,
} from './../controllers/post.controller'

export const postRouter = Router()

postRouter.get('/workspaces/:ID', getByWorkspace)

postRouter.get('/:ID', getOnePost)

postRouter.post(
  '/',
  body('title').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('description')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Campo requerido'),
  body('categoryId')
    .isNumeric()
    .notEmpty()
    .withMessage('Campo requerido'),
  body('userId').trim().isString().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  createPost
)

postRouter.patch('/:ID',
  body('title').trim().isString().notEmpty().optional().withMessage('El título debe ser un string y no puede estar vacío'),
  body('description')
    .trim()
    .isString()
    .notEmpty()
    .optional().withMessage('La descripción debe ser un string y no puede estar vacía'),
  body('categoryId')
    .isNumeric()
    .notEmpty()
    .optional().withMessage('El categoryId debe ser un número'),
  validateRequest,
  updatePost)

postRouter.delete('/:ID', deletePost)

import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares/validateRequest'
import {
  createCategory,
  deleteCategory,
  getByWorkspace,
  getOneCategory,
} from './../controllers/category.controller'
import { authorization, protect } from '../middlewares/auth'
import { Roles } from '../core/enums'

export const categoryRouter = Router()

/**
 * @swagger
 *  /categories/workspace/{ID}:
 *   get:
 *    summary: Get all categories of one specific workspace
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The workspace id
 *    responses:
 *      200:
 *        description: Categories founded
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/CategoriesDto'
 */

categoryRouter.get('/workspace/:ID', protect, getByWorkspace)

/**
 * @swagger
 *  /categories/{ID}:
 *   get:
 *    summary: Get one specific category with its details
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: number
 *        required: true
 *        description: The category id
 *    responses:
 *      200:
 *        description: Category founded
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/CategoryDto'
 */

categoryRouter.get('/:ID', getOneCategory)

/**
 * @swagger
 *  /categories:
 *   post:
 *    summary: Create one category
 *    tags: [Categories]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/CreateCategoryDto'
 *    responses:
 *      201:
 *        description: Category created successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/Category'
 */

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

/**
 * @swagger
 *  /categories/{ID}:
 *   delete:
 *    summary: Delete one category
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: number
 *        required: true
 *        description: The category id
 *    responses:
 *      200:
 *        description: Category deleted successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/Category'
 */

categoryRouter.delete(
  '/:workspaceId/:categoryId',
  protect,
  authorization('OWNER', 'ADMIN'),
  deleteCategory
)

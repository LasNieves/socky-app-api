import { Router } from 'express'
import { body } from 'express-validator'

import {
  validateRequest,
  protect,
  workspaceAuthorization,
} from './../middlewares'

import {
  createCategory,
  deleteCategory,
  getByWorkspace,
  getOneCategory,
  updateCategory,
} from './../controllers/category.controller'

export const categoryRouter = Router()

/**
 * @swagger
 *  /categories/workspace/{ID}:
 *   get:
 *    summary: Get all categories of one specific workspace
 *    tags: [Categories]
 *    security:
 *     - bearerAuth: []
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
 *        description: Categories found
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/CategoriesDto'
 */

categoryRouter.get(
  '/workspace/:ID',
  protect(),
  workspaceAuthorization('workspaceId', 'OWNER', 'ADMIN', 'MEMBER', 'CAN_VIEW'),
  getByWorkspace
)

/**
 * @swagger
 *  /categories/{ID}:
 *   get:
 *    summary: Get one specific category with its details
 *    tags: [Categories]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: number
 *        required: true
 *        description: The category id
 *    responses:
 *      200:
 *        description: Category found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/CategoryDto'
 */

categoryRouter.get(
  '/:ID',
  protect(),
  workspaceAuthorization('categoryId', 'OWNER', 'ADMIN', 'MEMBER', 'CAN_VIEW'),
  getOneCategory
)

/**
 * @swagger
 *  /categories:
 *   post:
 *    summary: Create one category
 *    tags: [Categories]
 *    security:
 *     - bearerAuth: []
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
  protect(),
  body('title')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Campo requerido')
    .isLength({ max: 55 })
    .withMessage('El nombre de la categoría no debe superar los 55 caracteres'),
  body('workspaceId')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Campo requerido'),
  validateRequest,
  workspaceAuthorization('workspaceId', 'OWNER', 'ADMIN', 'MEMBER'),
  createCategory
)

/**
 * @swagger
 *  /categories/{ID}:
 *   patch:
 *    summary: Update one category
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: number
 *        required: true
 *        description: The category id
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/UpdateCategoryDto'
 *    responses:
 *      200:
 *        description: Category updated successfully
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

categoryRouter.patch(
  '/:ID',
  protect(),
  body('title')
    .isString()
    .trim()
    .optional()
    .notEmpty()
    .withMessage('El nombre de la categoría debe contener un valor')
    .isLength({ max: 55 })
    .withMessage('El nombre de la categoría no debe superar los 55 caracteres'),
  validateRequest,
  workspaceAuthorization('categoryId', 'OWNER', 'ADMIN', 'MEMBER'),
  updateCategory
)

/**
 * @swagger
 *  /categories/{ID}:
 *   delete:
 *    summary: Delete one category
 *    tags: [Categories]
 *    security:
 *     - bearerAuth: []
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
  '/:ID',
  protect(),
  workspaceAuthorization('categoryId', 'OWNER', 'ADMIN'),
  deleteCategory
)

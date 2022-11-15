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

/**
 * @swagger
 *  /posts/{ID}:
 *   get:
 *    summary: Get one post
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The post id
 *    responses:
 *      200:
 *        description: Post founded
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 */

postRouter.get('/:ID', getOnePost)

/**
 * @swagger
 *  /posts:
 *   post:
 *    summary: Create one post
 *    tags: [Posts]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/CreatePostDto'
 *    responses:
 *      201:
 *        description: Post created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 */

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
/**
 * @swagger
 *  /posts/{ID}:
 *   delete:
 *    summary: Delete one post
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The post id
 *    responses:
 *      200:
 *        description: Post deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 */

postRouter.delete('/:ID', deletePost)

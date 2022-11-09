import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares/validateRequest'
import {
  createPost,
  deletePost,
  getOnePost,
} from './../controllers/post.controller'

export const postRouter = Router()

/**
 * @swagger
 *  /posts/{ID}:
 *   get:
 *    summary: Get one Post
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
 *    summary: Create one Post
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
    .trim()
    .isNumeric()
    .notEmpty()
    .withMessage('Campo requerido'),
  body('userId').trim().isString().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  createPost
)

/**
 * @swagger
 *  /posts/{ID}:
 *   delete:
 *    summary: Delete one Post
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
 *      20o:
 *        description: Post deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 */

postRouter.delete('/:ID', deletePost)

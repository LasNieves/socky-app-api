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
import { authorization, protect } from '../middlewares'

export const postRouter = Router()

/**
 * @swagger
 *  /posts/workspace/{ID}:
 *   get:
 *    summary: Get all the posts of one workspace
 *    tags: [Posts]
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
 *        description: Posts of workspace found successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Post'
 */

postRouter.get(
  '/workspace/:ID',
  protect,
  authorization('OWNER', 'ADMIN', 'MEMBER', 'CAN_VIEW'),
  getByWorkspace
)

/**
 * @swagger
 *  /posts/{ID}:
 *   get:
 *    summary: Get one post
 *    tags: [Posts]
 *    security:
 *     - bearerAuth: []
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
 *        description: Post found succesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 */

postRouter.get('/:ID', protect, getOnePost)

/**
 * @swagger
 *  /posts:
 *   post:
 *    summary: Create one post
 *    tags: [Posts]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/CreatePostDto'
 *    responses:
 *      201:
 *        description: Post created succesfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/Post'
 */

postRouter.post(
  '/',
  protect,
  body('title').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('description')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Campo requerido'),
  body('categoryId').isNumeric().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  authorization('OWNER', 'ADMIN', 'MEMBER'),
  createPost
)

/**
 * @swagger
 *  /posts/{ID}:
 *   patch:
 *    summary: Update one post
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The post id
 *    requestBody:
 *     required: false
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/UpdatePostDto'
 *    responses:
 *      200:
 *        description: Post updated succesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                data:
 *                  $ref: '#/components/schemas/Post'
 */

postRouter.patch(
  '/:ID',
  body('title')
    .trim()
    .isString()
    .notEmpty()
    .optional()
    .withMessage('El t??tulo debe ser un string y no puede estar vac??o'),
  body('description')
    .trim()
    .isString()
    .notEmpty()
    .optional()
    .withMessage('La descripci??n debe ser un string y no puede estar vac??a'),
  body('categoryId')
    .isNumeric()
    .notEmpty()
    .optional()
    .withMessage('El categoryId debe ser un n??mero'),
  validateRequest,
  updatePost
)

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
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/Post'
 */

postRouter.delete('/:ID', deletePost)

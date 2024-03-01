import { Router } from 'express'
import { body } from 'express-validator'

import {
  authorization,
  protect,
  validateRequest,
  verifyUserIdentity,
} from './../middlewares'

import {
  getUsers,
  getOneUser,
  deleteUser,
  getUserWorkspaces,
  updateUser,
} from '../controllers/user.controller'

export const usersRouter = Router()

/**
 * @swagger
 *  /users:
 *   get:
 *    summary: Get all Users from the app
 *    tags: [Users]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: Users found
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/UsersDto'
 */

usersRouter.get('/', protect(), authorization('SUPERADMIN'), getUsers)

/**
 * @swagger
 *  /users/{ID}:
 *   get:
 *    summary: Get one user by id
 *    tags: [Users]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: User found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */

usersRouter.get('/:ID', protect(), verifyUserIdentity, getOneUser)

/**
 * @swagger
 *  /users/workspaces/{ID}:
 *   get:
 *    summary: Get the workspaces of one user
 *    tags: [Users]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: User Workspace found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/UserWorkspacesDto'
 */

usersRouter.get(
  '/workspaces/:ID',
  protect(),
  verifyUserIdentity,
  getUserWorkspaces
)

/**
 * @swagger
 *  /users/{ID}:
 *   patch:
 *    summary: Update one User
 *    tags: [Users]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The user id
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/UpdateUserDto'
 *    responses:
 *      200:
 *        description: User updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/User'
 */

usersRouter.patch(
  '/:ID',
  protect(),
  verifyUserIdentity,
  body('firstName').trim().isString().optional(),
  body('lastName').trim().isString().optional(),
  body('avatar').trim().isString().optional(),
  validateRequest,
  updateUser
)

/**
 * @swagger
 *  /users/{ID}:
 *   delete:
 *    summary: Delete one User
 *    tags: [Users]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: The user id
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            password:
 *              type: string
 *              format: password
 *              description: The password of the User
 *    responses:
 *      200:
 *        description: User deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                data:
 *                  $ref: '#/components/schemas/User'
 */

usersRouter.delete(
  '/:ID',
  protect(),
  verifyUserIdentity,
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  deleteUser
)

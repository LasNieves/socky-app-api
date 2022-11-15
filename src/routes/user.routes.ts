import { Router } from 'express'
import { body } from 'express-validator'

import { validateRequest } from './../middlewares'
import {
  getUsers,
  getOneUser,
  deleteUser,
  getUserWorkspaces,
} from '../controllers/user.controller'

export const usersRouter = Router()

/**
 * @swagger
 *  /users:
 *   get:
 *    summary: Get all Users from the app
 *    tags: [Users]
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

usersRouter.get('/', getUsers)

/**
 * @swagger
 *  /users/{ID}:
 *   get:
 *    summary: Get one user by id
 *    tags: [Users]
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
 *              $ref: '#/components/schemas/UserDto'
 */

usersRouter.get('/:ID', getOneUser)

/**
 * @swagger
 *  /users/workspaces/{ID}:
 *   get:
 *    summary: Get the workspaces of one user
 *    tags: [Users]
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

usersRouter.get('/workspaces/:ID', getUserWorkspaces)

/**
 * @swagger
 *  /users/{ID}:
 *   delete:
 *    summary: Delete one User
 *    tags: [Users]
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
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  deleteUser
)

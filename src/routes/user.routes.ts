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
  updateProfile,
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
 *  /users/{ID}/workspaces:
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
  '/:ID/workspaces',
  protect(),
  verifyUserIdentity,
  getUserWorkspaces
)

/**
 * @swagger
 *  /users/{ID}/profile:
 *   patch:
 *    summary: Update user profile
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
 *           $ref: '#/components/schemas/UpdateProfileDto'
 *    responses:
 *      200:
 *        description: User's profile updated successfully
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
  '/:ID/profile',
  protect(),
  verifyUserIdentity,
  body('firstName')
    .isString()
    .trim()
    .isLength({ max: 55 })
    .withMessage('El nombre no debe superar los 55 caracteres')
    .optional(),
  body('lastName')
    .isString()
    .trim()
    .isLength({ max: 55 })
    .withMessage('El apellido no debe superar los 55 caracteres')
    .optional(),
  body('avatar')
    .isString()
    .trim()
    .isURL({ protocols: ['https'] })
    .withMessage('El avatar debe seguir el formato de una URL')
    .optional(),
  body('color')
    .isString()
    .trim()
    .isHexColor()
    .withMessage('El color debe ser enviado en formato hexadecimal')
    .optional(),
  validateRequest,
  updateProfile
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

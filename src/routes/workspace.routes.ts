import { Router } from 'express'
import { body } from 'express-validator'

import {
  authorization,
  protect,
  validateRequest,
  workspaceAuthorization,
} from '../middlewares'

import {
  getOneWorkspace,
  createWorkspace,
  getWorkspaces,
} from '../controllers/workspace.controller'

export const workspaceRouter = Router()

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

workspaceRouter.get('/', protect, authorization('SUPERADMIN'), getWorkspaces)

/**
 * @swagger
 *  /workspaces/{ID}:
 *   get:
 *    summary: Get one Workspace by id
 *    tags: [Workspaces]
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
 *        description: Workspace found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/WorkspaceDto'
 */

workspaceRouter.get(
  '/:ID',
  protect,
  workspaceAuthorization('workspaceId', 'OWNER', 'ADMIN', 'MEMBER', 'CAN_VIEW'),
  getOneWorkspace
)

/**
 * @swagger
 *  /workspaces:
 *   post:
 *    summary: Create one workspace
 *    tags: [Workspaces]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/CreateWorkspaceDto'
 *    responses:
 *      201:
 *        description: Workspace created successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/Workspace'
 */

workspaceRouter.post(
  '/',
  protect,
  body('name').isString().trim().notEmpty().withMessage('Campo requerido'),
  body('icon').isString().trim().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  createWorkspace
)

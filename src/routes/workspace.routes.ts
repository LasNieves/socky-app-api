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
  cleanWorkspaceTrashBin,
} from '../controllers/workspace.controller'

export const workspaceRouter = Router()

/**
 * @swagger
 *  /workspaces:
 *   get:
 *    summary: Get all Workspaces from the app
 *    tags: [Workspaces]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: Workspaces found
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Workspace'
 */

workspaceRouter.get('/', protect(), authorization('SUPERADMIN'), getWorkspaces)

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
  protect(),
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
  protect(),
  body('name').isString().trim().notEmpty().withMessage('Campo requerido'),
  body('icon').isString().trim().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  createWorkspace
)

/**
 * @swagger
 *  /workspaces/{ID}/restore-posts:
 *   patch:
 *    summary: Restore X posts from a workspace trash bin
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
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/RestorePostsDto'
 *    responses:
 *      200:
 *        description: Posts restored successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

workspaceRouter.patch(
  '/:ID/restore-posts',
  protect(),
  workspaceAuthorization('workspaceId', 'OWNER', 'ADMIN'),
  body('posts').isArray().isString().notEmpty().withMessage('Campo requerido'),
  body('categoryId').isNumeric().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  createWorkspace
)

/**
 * @swagger
 *  /workspaces/{ID}/clean-trash-bin:
 *   delete:
 *    summary: Clean workspace's trash bin
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
 *        description: Workspace trash bin cleaned
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

workspaceRouter.delete(
  '/:ID/clean-trash-bin',
  protect(),
  workspaceAuthorization('workspaceId', 'OWNER', 'ADMIN'),
  cleanWorkspaceTrashBin
)

import { Router } from 'express'
import { body } from 'express-validator'

import { protect, validateRequest } from '../middlewares'

import {
  getOneWorkspace,
  createWorkspace,
} from '../controllers/workspace.controller'

export const workspaceRouter = Router()

/**
 * @swagger
 *  /workspaces/{ID}:
 *   get:
 *    summary: Get one Workspace by id
 *    tags: [Workspaces]
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

workspaceRouter.get('/:ID', getOneWorkspace)

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

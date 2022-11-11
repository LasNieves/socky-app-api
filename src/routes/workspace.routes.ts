import { Router } from 'express'

import { getOneWorkspace } from '../controllers/workspace.controller'

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
 *        description: Workspace founded
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/WorkspaceDto'
 */

workspaceRouter.get('/:ID', getOneWorkspace)

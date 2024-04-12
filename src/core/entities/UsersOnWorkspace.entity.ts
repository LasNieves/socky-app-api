/**
 * @swagger
 * components:
 *  schemas:
 *    UsersOnWorkspaces:
 *      description: This is an intermediate table with the aim of associating a user to many workspaces and viceversa
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the register (a mix between userId and workspaceId)
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of the user joined to the workspace (auto-generated too)
 *        userId:
 *           type: string
 *           format: uuid
 *           description: The user's id associated with a specific workspace
 *        workspaceId:
 *           type: string
 *           format: uuid
 *           description: The specific worksapce id
 *        role:
 *           $ref: '#/components/schemas/WorkspaceRoles'
 *      required:
 *        - id
 *        - createdAt
 *        - role
 *        - userId
 *        - workspaceId
 */

import { WorkspaceRole } from '../enums'

export interface UsersOnWorkspaces {
  id: string
  createdAt: Date
  role: WorkspaceRole
  userId: string
  workspaceId: string
}

import { Roles } from "../enums"

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
 *        userId:
 *           type: string
 *           format: uuid
 *           description: The user's id associated with a specific workspace
 *        workspaceId:
 *           type: string
 *           format: uuid
 *           description: The specific worksapce id
 *        role:
 *           $ref: '#/components/schemas/Roles'    
 *      required:
 *        - id
 *        - userId
 *        - workspaceId
 *        - role
 */



export interface UsersOnWorkspaces {
  id: string
  userId: string
  workspaceId: string
  role: Roles
}

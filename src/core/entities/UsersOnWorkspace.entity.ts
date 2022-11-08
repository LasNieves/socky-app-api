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
 *           type: string
 *           enum: [ADMIN]
 *           description: The role of the user within the workspace
 *      required:
 *        - id
 *        - userId
 *        - workspaceId
 *        - role
 */

enum Role {
  ADMIN,
}

export interface UsersOnWorkspaces {
  id: string
  userId: string
  workspaceId: string
  role: Role
}

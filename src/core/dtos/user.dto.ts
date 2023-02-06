import { Profile, Workspace } from '../entities'
import { WorkspaceRole } from '../enums'

/**
 * @swagger
 * components:
 *  schemas:
 *    UsersDto:
 *      description: Data returned when you request for all the Users
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id for the User
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the User
 *        verified:
 *           type: boolean
 *           description: Is the user verified?
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the User (auto-generated)
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date of updated of the User
 *        profile:
 *           $ref: '#/components/schemas/Profile'
 */

export interface UsersDto {
  id: string
  email: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  profile: Omit<Profile, 'userId'> | null
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UserWorkspacesDto:
 *      description: Data returned when you request for one User and yours Workspaces
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id for the User
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the User
 *        workspaces:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             role:
 *              $ref: '#/components/schemas/WorkspaceRole'
 *             workspace:
 *              $ref: '#/components/schemas/Workspace'
 */

export interface UserWorkspacesDto {
  id: string
  email: string
  workspaces: {
    role: WorkspaceRole
    workspace: Workspace
  }[]
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateUserDto:
 *      description: Update user profile data
 *      type: object
 *      properties:
 *        firstName:
 *           type: string
 *           description: The first name of the user
 *        lastName:
 *           type: string
 *           description: The last name of the user
 *        avatar:
 *           type: string
 *           format: uri
 *           description: The user's avatar
 */
export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  avatar?: string
}

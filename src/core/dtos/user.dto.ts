import { Post, Profile, Workspace } from '../entities'

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
  createdAt: Date
  updatedAt: Date
  profile: Omit<Profile, 'userId'> | null
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UserDto:
 *      description: Data returned when you request for one User 
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
 *        posts:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Post'
 */

export interface UserDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  profile: Omit<Profile, 'userId'> | null
  posts: Post[]
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
 *              type: string
 *              enum: [ADMIN]
 *              description: The role of the user within the workspace
 *             workspace:
 *              $ref: '#/components/schemas/Workspace'     
 */

export interface UserWorkspacesDto {
  id: string
  email: string
  workspaces: {
    role: string
    workspace: Workspace
  }[]
}

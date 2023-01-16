import { Category, Post, Workspace } from '../entities'

/**
 * @swagger
 * components:
 *  schemas:
 *    PostDto:
 *      description: Data returned when you request for a single post
 *      type: object
 *      $ref: '#/components/schemas/Post'
 *      properties:
 *        category:
 *          type: object
 *          $ref: '#/components/schemas/Category'
 *          properties:
 *            workspace:
 *              type: object
 *              $ref: '#/components/schemas/Workspace'
 */

type CategoryWithWorkspace = Category & {
  workspace: Workspace
}
export interface PostDto extends Post {
  category: CategoryWithWorkspace
}

/**
 * @swagger
 * components:
 *  schemas:
 *    CreatePostDto:
 *      description: Data required for creating a post
 *      type: object
 *      properties:
 *        title:
 *           type: string
 *           description: The title of the post
 *        description:
 *           type: string
 *           description: The description of the post
 *        categoryId:
 *           type: number
 *           description: What category does the post belong to?
 *        userId:
 *           type: string
 *           format: uuid
 *           description: Who created the post?
 *      required:
 *        - title
 *        - description
 *        - categoryId
 *        - userId
 */

export interface CreatePostDto {
  title: string
  description: string
  categoryId: number
  userId: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdatePostDto:
 *      description: Data required for creating a post
 *      type: object
 *      properties:
 *        title:
 *           type: string
 *           description: The title of the post
 *        description:
 *           type: string
 *           description: The description of the post
 *        categoryId:
 *           type: number
 *           description: What category does the post belong to?
 *        userId:
 *           type: string
 *           format: uuid
 *           description: Who created the post?
 */

export interface UpdatePostDto {
  title?: string
  description?: string
  categoryId?: number
}

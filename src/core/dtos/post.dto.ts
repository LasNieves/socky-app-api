import { Category, Post, Workspace } from '../entities'

/**
 * @swagger
 * components:
 *  schemas:
 *    PostByCategory:
 *      description: Data returned when you request for posts of a category
 *      type: object
 *      $ref: '#/components/schemas/Post'
 *      properties:
 *        user:
 *          type: object
 *          properties:
 *            profile:
 *              type: object
 *              properties:
 *                firstName:
 *                    type: string
 *                avatar:
 *                    type: string
 *                    format: uri
 *                color:
 *                    type: string
 *                    format: hexadecimal
 */

export interface PostByCategory extends Post {
  user: {
    profile: {
      firstName: string
      avatar: string | null
      color: string | null
    }
  }
}

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
 *      required:
 *        - title
 *        - description
 *        - categoryId
 */

export interface CreatePostDto {
  title: string
  description: string
  categoryId: number
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
 */

export interface UpdatePostDto {
  title?: string
  description?: string
  categoryId?: number
}

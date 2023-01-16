import { Post } from '../entities'

/**
 * @swagger
 * components:
 *  schemas:
 *    CategoryDto:
 *      description: Data returned when you request for a single category
 *      type: object
 *      properties:
 *        id:
 *           type: number
 *           description: The auto-generated id of the category (auto-increment)
 *        title:
 *           type: string
 *           description: The title of the category
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the category (auto-generated too)
 *        workspaceId:
 *           type: string
 *           format: uuid
 *           description: What workspace does the category belong to?
 *        posts:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Post'
 */

export interface CategoryDto {
  id: number
  title: string
  createdAt: Date
  workspaceId: string
  posts: Post[]
}

/**
 * @swagger
 * components:
 *  schemas:
 *    CategoriesDto:
 *      description: Data returned when you request for all the categories of a workspace
 *      type: object
 *      properties:
 *        id:
 *           type: number
 *           description: The auto-generated id of the category (auto-increment)
 *        title:
 *           type: string
 *           description: The title of the category
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the category (auto-generated too)
 *      required:
 *        - title
 *        - workspaceId
 */

export interface CategoriesDto {
  id: number
  title: string
  createdAt: Date
}

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateCategoryDto:
 *      description: Data required for creating a category
 *      type: object
 *      properties:
 *        title:
 *           type: string
 *           description: The title of the category
 *        workspaceId:
 *           type: string
 *           format: uuid
 *           description: What workspace does the category belong to?
 *      required:
 *        - title
 *        - workspaceId
 */

export interface CreateCategoryDto {
  title: string
  workspaceId: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateCategoryDto:
 *      description: Data required for update a category
 *      type: object
 *      properties:
 *        title:
 *           type: string
 *           description: The title of the category
 */

export interface UpdateCategoryDto {
  title?: string
}

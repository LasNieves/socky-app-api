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

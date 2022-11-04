/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           description: The auto-generated id of the post (uuid)
 *        title:
 *           type: string
 *           description: The title of the post
 *        description:
 *           type: string
 *           description: The description of the post
 *        createdAt:
 *           type: date
 *           description: The date of creation of the post (auto-generated too)
 *        categoryId:
 *           type: string
 *           description: What category does the post belong to?
 *        userId:
 *           type: string
 *           description: Who created the post?
 *      required:
 *        - id
 *        - title
 *        - description
 *        - createdAt
 *        - categoryId
 *        - userId
 */
export interface Post {
  id: string
  title: string
  description: string
  createdAt: Date
  categoryId: number
  userId: string
}

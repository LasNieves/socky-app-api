/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the post
 *        title:
 *           type: string
 *           description: The title of the post
 *        description:
 *           type: string
 *           description: The description of the post
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the post (auto-generated too)
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last post update (change automatically to the current date when any other field is updated)
 *        categoryId:
 *           type: number
 *           description: What category does the post belong to?
 *        trashBinId:
 *           type: string
 *           format: uuid
 *           description: The post belong to a trash bin?
 *        userId:
 *           type: string
 *           format: uuid
 *           description: Who created the post?
 *      required:
 *        - id
 *        - title
 *        - description
 *        - createdAt
 *        - updatedAt
 *        - userId
 */

export interface Post {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  categoryId: number | null
  trashBinId: string | null
  userId: string
}

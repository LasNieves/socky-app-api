/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
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
 *      required:
 *        - id
 *        - title
 *        - createdAt
 *        - workspaceId
 */
export interface Category {
  id: number
  title: string
  createdAt: Date
  workspaceId: string
}

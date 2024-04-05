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
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last post update (change automatically to the current date when any other field is updated)
 *        workspaceId:
 *           type: string
 *           format: uuid
 *           description: What workspace does the category belong to?
 *      required:
 *        - id
 *        - title
 *        - createdAt
 *        - updatedAt
 *        - workspaceId
 */
export interface Category {
  id: number
  title: string
  createdAt: Date
  updatedAt: Date
  workspaceId: string
}

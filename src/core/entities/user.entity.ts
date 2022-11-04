/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           description: The auto-generated id of the user (uuid)
 *        email:
 *           type: string
 *           description: The email of the user
 *        password:
 *           type: string
 *           description: The password of the user
 *        createdAt:
 *           type: date
 *           description: The date of creation of the user (auto-generated too)
 *        updatedAt:
 *           type: date
 *           description: Last user update (change automatically to the current date when any other field is updated)
 *      required:
 *        - id
 *        - email
 *        - password
 *        - createdAt
 *        - updatedAt
 */

export interface User {
  id: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the user
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *        password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the user (auto-generated too)
 *        updatedAt:
 *           type: string
 *           format: date-time
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

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
 *        verified:
 *           type: boolean
 *           description: Is the user verified?
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the user (auto-generated too)
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last user update (change automatically to the current date when any other field is updated)
 *        role:
 *           $ref: '#/components/schemas/ApplicationRole'
 *      required:
 *        - id
 *        - email
 *        - password
 *        - verified
 *        - createdAt
 *        - updatedAt
 *        - role
 */

import { ApplicationRole } from "../enums"

export interface User {
  id: string
  email: string
  password: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  role: ApplicationRole
}

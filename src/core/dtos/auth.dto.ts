import { Profile } from '../entities'

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    AuthLoginDto:
 *      description: Data required for login
 *      type: object
 *      properties:
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the existing user
 *        password:
 *           type: string
 *           format: password
 *           description: The password of the existing user
 *      required:
 *        - email
 *        - password
 */

export interface AuthLoginDto {
  email: string
  password: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    AuthRegisterDto:
 *      description: Data required for register
 *      type: object
 *      properties:
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *        password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *        firstName:
 *           type: string
 *           description: The first name of the user
 *        lastName:
 *           type: string
 *           description: The last name of the user
 *        avatar:
 *           type: string
 *           format: uri
 *           description: The user's avatar
 *      required:
 *        - email
 *        - password
 *        - firstName
 *        - lastName
 *        - avatar
 */

export interface AuthRegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  avatar: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    AuthDto:
 *      description: Response for every auth endpoints
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id for the user
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the user (auto-generated too)
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last user update (change automatically to the current date when any other field is updated)
 *        token:
 *           type: string
 *           description: The authentication token
 *        profile:
 *           $ref: '#/components/schemas/Profile'
 */

export interface AuthDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date

  profile?: Omit<Profile, 'userId'> | null

  token: string
}

import { Profile } from '../entities'
import { ApplicationRole } from '../enums'

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
 *        isSuperAdmin:
 *           type: boolean
 *           description: Is the user SUPERADMIN or not?
 *      required:
 *        - email
 *        - password
 *        - firstName
 *        - lastName
 */

export interface AuthRegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  avatar?: string
  isSuperAdmin?: boolean
}

/**
 * @swagger
 * components:
 *  schemas:
 *    AuthVerifyAccountDto:
 *      description: Data required for verificate a user
 *      type: object
 *      properties:
 *        code:
 *           type: number
 *           description: The code for validation
 *      required:
 *        - code
 */

export interface AuthVerifyAccountDto {
  code: number
}

/**
 * @swagger
 * components:
 *  schemas:
 *    AuthSendValidationCodeDto:
 *      description: Data required for resend the validation code
 *      type: object
 *      properties:
 *        email:
 *           type: string
 *           format: email
 *           description: The email of the existing user
 *      required:
 *        - email
 */

export interface AuthSendValidationCodeDto {
  email: string
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
 *        role:
 *           $ref: '#/components/schemas/ApplicationRole'
 */

export interface AuthDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  verified: boolean
  role: ApplicationRole

  profile?: Profile | null

  token: string
}

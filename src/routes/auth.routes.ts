import { Router } from 'express'
import { body } from 'express-validator'

import { login, register } from '../controllers/auth.controller'
import { validateRequest } from '../middlewares'

export const authRouter = Router()

/**
 * @swagger
 *  /auth/register:
 *   post:
 *    summary: Register a new user
 *    tags: [Auth]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/AuthRegisterDto'
 *    responses:
 *      201:
 *        description: New user created
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/AuthDto'
 */

authRouter.post(
  '/register',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  body('firstName').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('lastName').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('avatar').trim().isString().notEmpty().withMessage('Campo requerido'),
  validateRequest,
  register
)

/**
 * @swagger
 *  /auth/login:
 *   post:
 *    summary: Login a user
 *    tags: [Auth]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/AuthLoginDto'
 *    responses:
 *      200:
 *        description: The user has been login successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 $ref: '#/components/schemas/AuthDto'
 */

authRouter.post(
  '/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').trim().notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  login
)

import { Router } from 'express'
import { body } from 'express-validator'

import {
  login,
  register,
  resendvalidationCode,
  validateCode,
} from '../controllers/auth.controller'
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
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Contraseña obligatoria')
    .isLength({ min: 6 })
    .withMessage('Mínimo 6 caracteres'),
  body('firstName').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('lastName').trim().isString().notEmpty().withMessage('Campo requerido'),
  body('avatar').trim().isString().optional(),
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

/**
 * @swagger
 *  /auth/validate-code:
 *   post:
 *    summary: Verify a user
 *    tags: [Auth]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/AuthValidateCodeDto'
 *    responses:
 *      200:
 *        description: The user has been verified successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

authRouter.post(
  '/validate-code',
  body('email').isEmail().withMessage('Email inválido'),
  body('code').isNumeric().notEmpty().withMessage('Código obligatorio'),
  validateRequest,
  validateCode
)

/**
 * @swagger
 *  /auth/resend-code:
 *   post:
 *    summary: Resend the validation code
 *    tags: [Auth]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/AuthSendValidationCodeDto'
 *    responses:
 *      200:
 *        description: The email has been sent successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

authRouter.post(
  '/resend-code',
  body('email').isEmail().withMessage('Email inválido'),
  validateRequest,
  resendvalidationCode
)

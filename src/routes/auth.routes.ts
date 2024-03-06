import { Router } from 'express'
import { body } from 'express-validator'
import { rateLimit } from 'express-rate-limit'

import {
  login,
  register,
  resendvalidationCode,
  verifyAccount,
} from '../controllers/auth.controller'
import { protect, validateRequest } from '../middlewares'
import { TooManyRequests } from '../errors'

const authLimiter = rateLimit({
  windowMs: 30 * 1000, // 30s
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(
      new TooManyRequests(
        'Demasiados intentos. Prueba nuevamente en unos segundos'
      )
    ),
})

export const authRouter = Router()
authRouter.use(authLimiter)

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
    .isString()
    .notEmpty()
    .withMessage('Contraseña obligatoria')
    .isLength({ min: 8, max: 64 })
    .withMessage('La contraseña debe ser de, al menos, 8 caracteres')
    .isStrongPassword()
    .withMessage(
      'Incluya al menos 1 minúscula, 1 mayúscula, 1 número y 1 símbolo en la contraseña'
    ),
  body('firstName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Nombre requerido')
    .isLength({ max: 55 })
    .withMessage('El nombre no debe superar los 55 caracteres'),
  body('lastName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Apellido requerido')
    .isLength({ max: 55 })
    .withMessage('El apellido no debe superar los 55 caracteres'),
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
  body('password').notEmpty().withMessage('Contraseña obligatoria'),
  validateRequest,
  login
)

/**
 * @swagger
 *  /auth/verify-account:
 *   post:
 *    summary: Verify an account (2FA Auth)
 *    tags: [Auth]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/AuthVerifyAccountDto'
 *    responses:
 *      200:
 *        description: The account has been verified successfully
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

authRouter.post(
  '/verify-account',
  protect(false),
  body('code').isNumeric().notEmpty().withMessage('Código obligatorio'),
  validateRequest,
  verifyAccount
)

/**
 * @swagger
 *  /auth/resend-code:
 *   post:
 *    summary: Resend the validation code
 *    tags: [Auth]
 *    security:
 *     - bearerAuth: []
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
  protect(false),
  validateRequest,
  resendvalidationCode
)

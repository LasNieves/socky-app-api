import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { BadRequest } from '../errors'

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array()))
  } 
  return next()

  }
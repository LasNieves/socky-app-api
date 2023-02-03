import { Request, Response, NextFunction } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { BadRequestBody } from '../errors'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestedData = matchedData(req, {
    includeOptionals: true,
    onlyValidData: false,
  })

  const invalidFields = Object.keys(req.body).filter(
    (key) => !Object.keys(requestedData).includes(key)
  )

  if (invalidFields.length) {
    return next(
      new BadRequestBody(
        invalidFields.map((invalidKey) => ({
          param: invalidKey,
          msg: `El campo ${invalidKey} no debería existir`,
          location: 'body',
          value: '',
        }))
      )
    )
  }

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new BadRequestBody(errors.array()))
  }
  return next()
}

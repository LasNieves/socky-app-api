import { ValidationError } from 'express-validator'
import { CustomError } from './CustomError'

export class BadRequestBody extends CustomError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super('Validation Errors')

    Object.setPrototypeOf(this, BadRequestBody.prototype)
  }

  serializeErrors() {
    return this.errors.map((err) => ({ message: err.msg, field: err.param }))
  }
}


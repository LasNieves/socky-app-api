import { CustomError } from './CustomError'

export class Conflict extends CustomError {
  statusCode = 409

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, Conflict.prototype)
  }

  serializeErrors() {
    return [{ message: this.message || 'Not found!!' }]
  }
}

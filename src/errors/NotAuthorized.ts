import { CustomError } from './CustomError'

export class NotAuthorized extends CustomError {
  statusCode = 401

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, NotAuthorized.prototype)
  }

  serializeErrors() {
    return [{ message: this.message || 'Not Authorized!!' }]
  }
}

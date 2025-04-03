import { CustomError } from './CustomError'

export class TooManyRequests extends CustomError {
  statusCode = 429

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, TooManyRequests.prototype)
  }

  serializeErrors() {
    return [{ message: this.message || 'Too Many Requests!!' }]
  }
}

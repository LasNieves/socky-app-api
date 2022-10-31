export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)

    /*Esto lo debemos hacer porque estamos usando una clase nativa: Error */
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; field?: string }[]
}

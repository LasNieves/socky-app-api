import { NotFound } from '../NotFoundError'

export class UserEmailNotFound extends NotFound {
  constructor(public readonly email: string) {
    super(`Usuario con email ${email} no encontrado`)
  }
}

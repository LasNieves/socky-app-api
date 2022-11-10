import { CustomError } from '../../errors'
import { AuthLogin, AuthRegister, AuthDto } from '../dtos'

export interface AuthRepository {
  login(data: AuthLogin): Promise<AuthDto | CustomError>
  register(data: AuthRegister): Promise<AuthDto | CustomError>
}

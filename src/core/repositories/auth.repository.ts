import { CustomError } from '../../errors/CustomError'
import { AuthLogin, AuthRegister, AuthDto } from '../dtos'

export interface AuthRepository {
  login(data: AuthLogin): Promise<AuthDto | CustomError>
  register(data: AuthRegister): Promise<AuthDto | CustomError>
  // logout(data: AuthLogout): Promise<string | null>
}

import { CustomError } from '../../errors'
import { AuthLoginDto, AuthRegisterDto, AuthDto } from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto | CustomError>
  register(data: AuthRegisterDto): Promise<AuthDto | CustomError>
}

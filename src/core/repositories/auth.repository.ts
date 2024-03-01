import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthVerifyAccountDto,
} from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto>
  register(data: AuthRegisterDto): Promise<AuthDto>
  verifyAccount(email: string, data: AuthVerifyAccountDto): Promise<string>
  sendValidationCode(email: string): Promise<string>
}

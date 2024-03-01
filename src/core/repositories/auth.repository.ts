import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthVerifyAccountDto,
  AuthSendValidationCodeDto,
} from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto>
  register(data: AuthRegisterDto): Promise<AuthDto>
  verifyAccount(email: string, data: AuthVerifyAccountDto): Promise<string>
  sendValidationCode(data: AuthSendValidationCodeDto): Promise<string>
}

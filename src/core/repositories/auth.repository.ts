import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthValidateCodeDto,
  AuthResendValidationCodeDto,
} from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto>
  register(data: AuthRegisterDto): Promise<AuthDto>
  validateCode(data: AuthValidateCodeDto): Promise<string>
  resendValidationCode(data: AuthResendValidationCodeDto): Promise<string>
}

import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthValidateCodeDto,
  AuthSendValidationCodeDto,
} from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto>
  register(data: AuthRegisterDto): Promise<AuthDto>
  validateCode(data: AuthValidateCodeDto): Promise<string>
  sendValidationCode(data: AuthSendValidationCodeDto): Promise<string>
}

import { CustomError } from '../../errors'
import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthValidateCodeDto,
  AuthResendValidationCodeDto,
} from '../dtos'

export interface AuthRepository {
  login(data: AuthLoginDto): Promise<AuthDto | CustomError>
  register(data: AuthRegisterDto): Promise<AuthDto | CustomError>
  validateCode(data: AuthValidateCodeDto): Promise<string | CustomError>
  resendValidationCode(
    data: AuthResendValidationCodeDto
  ): Promise<string | CustomError>
}

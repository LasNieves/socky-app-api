import { hash, genSalt, compare } from 'bcryptjs'
import SendGrid from '@sendgrid/mail'

import { prisma } from '../config/db'

import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthValidateCodeDto,
  AuthResendValidationCodeDto,
} from '../core/dtos'
import {
  AuthRepository,
  UserRepository,
  JwtRepository,
  MailerRepository,
} from '../core/repositories'
import { CustomError, Conflict, BadRequest } from '../errors'
import { getNumericCode } from '../utils'

export class AuthService implements AuthRepository {
  constructor(
    private readonly userService: UserRepository,
    private readonly jwtService: JwtRepository,
    private readonly mailerService: MailerRepository,
    private mailObj: SendGrid.MailDataRequired = {
      from: 'giulianodamico2019@gmail.com',
      templateId: process.env.VERIFY_USER_TEMPLATE!,
    }
  ) {}

  private async isValidPassword(
    passwordToCompare: string,
    password: string
  ): Promise<boolean> {
    return await compare(passwordToCompare, password)
  }

  private generateCode(): { code: number; expiresAt: Date } {
    const currentDate = new Date().getTime()

    // Se deben agregar 15m a la fecha actual
    // 60 representan los segundos que hay en cada minuto
    // Y en cada segundo hay 1000ms, por lo que multiplicamos por 15000 para obtener el tiempo total en ms

    const msToAdd = 60 * 15000

    const codeObj = {
      code: getNumericCode(),
      expiresAt: new Date(currentDate + msToAdd),
    }

    return codeObj
  }

  async login(data: AuthLoginDto): Promise<AuthDto | CustomError> {
    const { email, password } = data
    const existUser = await this.userService.get({ email })

    if (existUser instanceof CustomError) {
      return existUser
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return new Conflict('Credenciales inválidas')
    }

    const token = this.jwtService.sign({
      id: existUser.id,
      email: existUser.email,
    })

    const { password: userPassword, ...rest } = existUser

    return { ...rest, token }
  }

  async register(data: AuthRegisterDto): Promise<AuthDto | CustomError> {
    const { email, password, ...rest } = data

    const existUser = await this.userService.get({ email })

    if (!(existUser instanceof CustomError)) {
      return new Conflict(`El email ${email} ya está en uso`)
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)

    const { code, expiresAt } = this.generateCode()

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          profile: {
            create: {
              ...rest,
            },
          },
          codes: {
            create: {
              code,
              expiresAt,
            },
          },
          workspaces: {
            create: {
              workspace: {
                create: {
                  name: `${data.firstName}'s workspace`,
                  icon: 'Diego Armando Maradona',
                },
              },
              role: 'OWNER',
            },
          },
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          verified: true,
          profile: true,
        },
      })

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
      })

      this.mailObj = {
        ...this.mailObj,
        to: 'francomusolino55@gmail.com',
        dynamicTemplateData: {
          firstname: rest.firstName,
          code,
        },
      }

      this.mailerService
        .send(this.mailObj)
        .then(() => console.log('Mail enviado correctamente'))
        .catch(() => console.error('Error al enviar el mail'))

      return { ...user, token }
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear el usuario')
    }
  }

  async validateCode({
    code,
    email,
  }: AuthValidateCodeDto): Promise<string | CustomError> {
    const existUser = await this.userService.get({ email })

    if (existUser instanceof CustomError) {
      return existUser
    }

    const userVerficationCode = await prisma.code.findFirst({
      where: { userId: existUser.id },
      orderBy: { createdAt: 'desc' },
    })

    if (
      userVerficationCode?.expiresAt! < new Date() ||
      userVerficationCode?.used
    ) {
      return new Conflict('El código ha expirado o ya ha sido utilizado')
    }

    if (userVerficationCode?.code === code) {
      await prisma.user.update({
        where: { email },
        data: { verified: true },
      })

      await prisma.code.update({
        where: { id: userVerficationCode.id },
        data: { used: true },
      })

      return `Usuario ${email} verificado correctamente`
    }

    return new BadRequest('El código es inválido')
  }

  async resendValidationCode({
    email,
  }: AuthResendValidationCodeDto): Promise<string | CustomError> {
    const existUser = await this.userService.get({ email }, { profile: true })

    if (existUser instanceof CustomError) {
      return existUser
    }

    try {
      const { code, expiresAt } = this.generateCode()

      await prisma.code.create({
        data: {
          code,
          expiresAt,
          userId: existUser.id,
        },
      })

      this.mailObj = {
        ...this.mailObj,
        to: 'francomusolino55@gmail.com',
        dynamicTemplateData: {
          firstname: existUser.profile!.firstName,
          code,
        },
      }

      this.mailerService
        .send(this.mailObj)
        .then(() => console.log('Mail enviado correctamente'))
        .catch(() => console.error('Error al enviar el mail'))

      return `Código reenviado a ${email}`
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al reenviar el código de verificación')
    }
  }
}

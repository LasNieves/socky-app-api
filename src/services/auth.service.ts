import { timingSafeEqual } from './../utils/timeSafeEqual'
import { ApplicationRole } from '@prisma/client'
import { hash, genSalt, compare } from 'bcryptjs'
import SendGrid from '@sendgrid/mail'

import { prisma } from '../config/db'

import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthDto,
  AuthVerifyAccountDto,
} from '../core/dtos'
import { Conflict, BadRequest, UserEmailNotFound } from '../errors'
import { getNumericCode } from '../utils'

// DEPS
import { WorkspaceService, workspaceService } from './workspace.service'
import { UserService, userService } from './user.service'
import { JwtService, jwtService } from './jwt.service'
import { MailerService, mailerService } from './mailer.service'

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private mailObj: SendGrid.MailDataRequired = {
      from: 'giulianodamico2019@gmail.com',
      templateId: process.env.VERIFY_USER_TEMPLATE!,
    }
  ) {}

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

  async login({ email, password }: AuthLoginDto): Promise<AuthDto> {
    const existUser = await this.userService.get({ email }, { profile: true })
    if (!existUser) {
      throw new Conflict('Credenciales inválidas')
    }

    const isValid = await compare(password, existUser.password)
    if (!isValid) {
      throw new Conflict('Credenciales inválidas')
    }

    await this.sendValidationCode(existUser.email)

    const token = this.jwtService.sign({
      id: existUser.id,
      email: existUser.email,
    })

    const { password: userPassword, ...rest } = existUser

    return { ...rest, token }
  }

  async register(data: AuthRegisterDto): Promise<AuthDto> {
    const { email, password, isSuperAdmin = false, ...profile } = data

    const existUser = await this.userService.get({ email })
    if (existUser) {
      throw new Conflict(`El email ${email} ya está en uso`)
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          role: isSuperAdmin
            ? ApplicationRole.SUPERADMIN
            : ApplicationRole.USER,
          profile: {
            create: {
              ...profile,
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
          role: true,
        },
      })

      console.log(`Usuario ${user.id} creado`, { user })

      await this.workspaceService.create({
        name: `${data.firstName}'s workspace`,
        userId: user.id,
        description: `Espacio personal de ${data.firstName} ${data.lastName}`,
        isPersonal: true,
      })

      await this.sendValidationCode(user.email)

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
      })

      return { ...user, token }
    } catch (error) {
      console.log(error)
      throw new BadRequest('Error al crear el usuario')
    }
  }

  async verifyAccount(
    email: string,
    { code }: AuthVerifyAccountDto
  ): Promise<string> {
    const existUser = await this.userService.get({ email })

    if (!existUser) {
      throw new UserEmailNotFound(email)
    }

    const generatedCode = await prisma.code.findFirst({
      where: { userId: existUser.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!generatedCode) {
      throw new Conflict(`No se ha generado ningún código para ${email}`)
    }

    if (generatedCode.expiresAt! < new Date() || generatedCode.used) {
      throw new Conflict('El código ha expirado o ya ha sido utilizado')
    }

    if (!timingSafeEqual(code, generatedCode.code)) {
      throw new BadRequest('El código es inválido')
    }

    if (!existUser.verified) {
      await prisma.user.update({
        where: { email },
        data: { verified: true },
      })
    }

    await prisma.code.update({
      where: { id: generatedCode.id },
      data: { used: true },
    })

    return `Usuario ${email} verificado correctamente`
  }

  async sendValidationCode(email: string): Promise<string> {
    const existUser = await this.userService.get({ email }, { profile: true })

    if (!existUser) {
      throw new UserEmailNotFound(email)
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
        to: email,
        dynamicTemplateData: {
          //@ts-ignore
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
      throw new BadRequest('Error al reenviar el código de verificación')
    }
  }
}

export const authService = new AuthService(
  userService,
  workspaceService,
  jwtService,
  mailerService
)

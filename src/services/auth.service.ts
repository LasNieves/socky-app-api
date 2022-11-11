import { hash, genSalt, compare } from 'bcryptjs'

import { prisma } from '../config/db'

import { AuthLogin, AuthRegister, AuthDto } from '../core/dtos'
import {
  AuthRepository,
  UserRepository,
  JwtRepository,
} from '../core/repositories'
import { CustomError, Conflict, BadRequest } from '../errors'

export class AuthService implements AuthRepository {
  constructor(
    private readonly userService: UserRepository,
    private readonly jwtService: JwtRepository
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
      code: Math.floor(Math.random() * 100000),
      expiresAt: new Date(currentDate + msToAdd),
    }

    return codeObj
  }

  async login(data: AuthLogin): Promise<AuthDto | CustomError> {
    const { email, password } = data
    const existUser = await this.userService.get({ email })

    if (existUser instanceof CustomError) {
      return existUser
    }

    const isValid = await this.isValidPassword(password, existUser.password)

    if (!isValid) {
      return new Conflict('Credenciales inválidas')
    }

    const token = this.jwtService.sign({ id: existUser.id })

    const { password: userPassword, ...rest } = existUser

    return { ...rest, token }
  }

  async register(data: AuthRegister): Promise<AuthDto | CustomError> {
    const { email, password, ...rest } = data

    const existUser = await this.userService.get({ email })

    if (!(existUser instanceof CustomError)) {
      return new Conflict(`El email ${email} ya está en uso`)
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)

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
          workspaces: {
            create: {
              workspace: {
                create: {
                  name: `${data.firstName}'s workspace`,
                  icon: 'Diego Armando Maradona',
                },
              },
              role: 'ADMIN',
            },
          },
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      })

      const token = this.jwtService.sign({ id: user.id })

      return { ...user, token }
    } catch (error) {
      console.log(error)
      return new BadRequest('Error al crear el usuario')
    }
  }
}

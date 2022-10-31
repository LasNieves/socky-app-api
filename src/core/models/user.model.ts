import { UserRepository } from './../repositories';
import { prisma } from '../../config/db'

import { Conflict, CustomError, NotFound } from '../../errors';
import { UserResponse, UsersResponse } from '../entities';
import { compare } from 'bcryptjs';


export class UserModel implements UserRepository {

  private async isValidPassword(
    passwordToCompare: string,
    password: string
  ): Promise<boolean> {
    return await compare(passwordToCompare, password)
  }

 async getAll(): Promise<UsersResponse[]> {
    const users = await prisma.user.findMany({select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true        
        }
      }
    }})
    return users
  }

  async getById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { id },
    select: {
      id: true,
      email: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true        
        }
      },
      workspaces: {include: {
        workspace: true,
      }},
      posts: true
    } })

    return user
  }

  async delete(id: string, password: string): Promise<string | CustomError> {

  const existUser = await this.getById( id )

  if (!existUser) {
    return new NotFound(`Usuario con id ${id} no encontrado`)
  } 

  const isValid = await this.isValidPassword(password, existUser.password)

  if (!isValid) {
    return new Conflict('Credenciales inválidas')
  }

  const deletedUser = await prisma.user.delete({where: {id}})
  return `El usuario con email ${deletedUser.email} fue borrado correctamente` 
  
 } 

}


/* export const updateOneUser = async (
  id: string,
  user: updateUserDto
): Promise<UserEntity> => {
  const { ...rest } = user

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { ...rest },
  })

  return updatedUser
}
 */
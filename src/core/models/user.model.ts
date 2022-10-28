import { UserRepository } from './../repositories';
import { prisma } from '../../config/db'

import { CustomError, NotFound } from '../../errors';
import { UserResponse, UsersResponse } from '../entities';


export class UserModel implements UserRepository {
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

  async getById(id: string): Promise<UserResponse | CustomError> {
    const user = await prisma.user.findUnique({ where: { id },
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
          avatar: true        
        }
      },
      posts: true
    } })

    if ( !user) {
      return new NotFound("Usuario no encontrado")
    }

    return user
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
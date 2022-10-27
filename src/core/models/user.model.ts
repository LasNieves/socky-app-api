import { prisma } from '../../config/db'

import { createUserDto, updateUserDto } from '../../dtos/user.dto'
import { UserEntity } from '../entities'

export const getAllUsers = async (): Promise<UserEntity[]> => {
  const users = await prisma.user.findMany()

  return users
}

export const getUserByID = async (id: string): Promise<UserEntity | null> => {
  const user = await prisma.user.findUnique({ where: { id } })

  return user
}

export const updateOneUser = async (
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

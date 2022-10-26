import { prisma } from '../../config/db'
import { hash, compare } from 'bcryptjs'

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

export const createOneUser = async (
  user: createUserDto
): Promise<UserEntity> => {
  const { email, password } = user
  const hashPassword = await hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
  })

  return newUser
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

export const deleteOneUser = async (
  id: string,
  password: string
): Promise<UserEntity | string> => {
  const user = await getUserByID(id)

  if (!user) {
    return 'usuario no encontrado'
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return 'contraseña incorrecta'
  }

  const deletedUser = await prisma.user.delete({
    where: { id },
  })

  return deletedUser
}

import { prisma } from '../server'
import { hash } from 'bcryptjs'

import { createUserDto } from '../dtos/userDto'

export const getAll = async () => {
  try {
    const data = await prisma.user.findMany()

    return data
  } catch (error) {
    return error
  }
}

export const getByID = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  } catch (error) {
    return error
  }
}

export const create = async (user: createUserDto) => {
  const { email, password } = user
  const hashPassword = await hash(password, 10)

  try {
    const data = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    })

    return data
  } catch (error) {
    return error
  }
}

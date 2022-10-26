export interface createUserDto {
  email: string
  password: string
}

export type updateUserDto = Partial<Omit<createUserDto, 'password'>>

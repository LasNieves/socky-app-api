import { Prisma } from '@prisma/client'

import { CustomError } from '../../errors'
import { Profile, User, Post } from '../entities'
import { UsersDto, UserWorkspacesDto } from './../dtos'

export interface UserRepository {
  getAll(): Promise<UsersDto[]>
  get(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ): Promise<CustomError | (User & { profile?: Profile; posts?: Post[] })>
  getFirstUserOrThrow(where: Prisma.UserWhereUniqueInput): Promise<User>
  delete(id: string, password: string): Promise<User | CustomError>
  getUserWorkspaces(id: string): Promise<UserWorkspacesDto | CustomError>
  getUserRole(
    userId: string,
    workspaceId: string
  ): Promise<string | CustomError>
}

import { Prisma } from '@prisma/client'

import { Profile, User, Post } from '../entities'
import { WorkspaceRole } from '../enums'
import { UserWithoutPassword } from '../types'
import { UpdateUserDto, UsersDto, UserWorkspacesDto } from './../dtos'

export interface UserRepository {
  getAll(): Promise<UsersDto[]>
  get(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ): Promise<(User & { profile?: Profile; posts?: Post[] }) | null>
  getFirstUserOrThrow(where: Prisma.UserWhereUniqueInput): Promise<User>
  update(id: string, data: UpdateUserDto): Promise<UserWithoutPassword>
  delete(id: string, password: string): Promise<User>
  getUserWorkspaces(id: string): Promise<UserWorkspacesDto>
  getUserRoleInWorkspace(
    userId: string,
    workspaceId: string
  ): Promise<WorkspaceRole | null>
}

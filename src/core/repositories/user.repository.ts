import { CustomError } from '../../errors'
import { RequireAtLeastOne } from '../types'
import { User } from '../entities'
import { UsersDto, UserDto, UserWorkspacesDto } from './../dtos'

export interface UserRepository {
  getAll(): Promise<UsersDto[]>
  get(
    field: RequireAtLeastOne<Record<'id' | 'email', string>>
  ): Promise<User | CustomError>
  getById(id: string): Promise<UserDto | CustomError>
  delete(id: string, password: string): Promise<User | CustomError>
  getUserWorkspaces(id: string): Promise<UserWorkspacesDto | CustomError>
  getUserRole(
    userId: string,
    workspaceId: string
  ): Promise<string | CustomError>
}

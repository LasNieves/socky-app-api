import { CustomError } from '../../errors'
import { UsersDto, UserDto, UserWorkspacesDto } from './../dtos'

export interface UserRepository {
  getAll(): Promise<UsersDto[]>
  getById(id: string): Promise<UserDto | null>
  delete(id: string, password: string): Promise<string | CustomError>
  getUserWorkspaces(id: string): Promise<UserWorkspacesDto | CustomError>
}

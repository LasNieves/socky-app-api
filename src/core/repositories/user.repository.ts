import { CustomError } from '../../errors';
import { UsersResponse, UserResponse } from './../entities';

export interface UserRepository {
  getAll(): Promise<UsersResponse[]>,
  getById(id: string): Promise<UserResponse | null>
  delete(id: string, password: string): Promise<string | CustomError>}

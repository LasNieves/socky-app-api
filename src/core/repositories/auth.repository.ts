import { AuthLogin, AuthRegister, AuthLogout, AuthResponse } from '../entities'

export interface AuthRepository {
  login(data: AuthLogin): Promise<AuthResponse | null>
  register(data: AuthRegister): Promise<AuthResponse | null>
  logout(data: AuthLogout): Promise<string | null>
}

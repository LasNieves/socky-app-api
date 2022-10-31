import { Category, User, Workspace } from '../entities'

export type WorkspaceDto = Workspace & {
  categories: Category[]
  users: {
    user: Pick<User, 'id' | 'email'>
  }[]
}

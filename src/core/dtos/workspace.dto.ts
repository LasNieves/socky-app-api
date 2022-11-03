import { Category, User, Workspace } from '../entities'

export type WorkspaceDto = {
  id: string
  name: string
  icon: string
  personal: boolean
  categories: Category[]
  users: {
    user: Pick<User, 'id' | 'email'>
  }[]
}

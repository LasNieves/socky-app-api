import { Post, Profile, Workspace } from '../entities'

export interface UsersDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  profile: Omit<Profile, 'userId'> | null
}

export interface UserDto {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  profile: Omit<Profile, 'userId'> | null
  posts: Post[]
}

export interface UserWorkspacesDto {
  id: string
  email: string
  workspaces: {
    role: string
    workspace: Workspace
  }[]
}

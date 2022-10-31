import { Post, Profile } from '@prisma/client';

export interface UsersResponse {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date 
  profile : Omit<Profile, "userId">  | null
}

export interface UserResponse {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date 
  posts: Post[]
/*   workspaces: Workspace[]
 */  profile : Omit<Profile, "userId"> | null 
}

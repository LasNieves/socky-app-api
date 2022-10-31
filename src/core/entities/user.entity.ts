import { Post, Profile } from '@prisma/client';

/* Hay que cambiar la forma en la que usamos las Entities */

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
  password: string
  createdAt: Date
  updatedAt: Date 
  posts: Post[]
/*   workspaces: Workspace[]
 */  profile : Omit<Profile, "userId"> | null 
}

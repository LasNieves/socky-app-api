import { Prisma } from '@prisma/client'
import { Workspace } from '../entities'
import { CreateWorkspaceDto, WorkspaceDto } from './../dtos'

export interface WorkspaceRepository {
  getAll(): Promise<Workspace[]>
  getFirstWorkspaceOrThrow(
    where: Prisma.WorkspaceWhereUniqueInput
  ): Promise<Workspace>
  get(where: Prisma.WorkspaceWhereUniqueInput): Promise<WorkspaceDto | null>
  create(data: CreateWorkspaceDto, userId: string): Promise<Workspace>
  delete(id: string): Promise<string>
}

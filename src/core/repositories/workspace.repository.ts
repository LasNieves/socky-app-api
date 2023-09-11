import { Prisma } from '@prisma/client'
import { CustomError } from '../../errors'
import { Workspace } from '../entities'
import { CreateWorkspaceDto, WorkspaceDto } from './../dtos'

export interface WorkspaceRepository {
  getAll(): Promise<Workspace[]>
  getFirstWorkspaceOrThrow(
    where: Prisma.WorkspaceWhereUniqueInput
  ): Promise<Workspace>
  get(where: Prisma.WorkspaceWhereUniqueInput): Promise<WorkspaceDto | null>
  create(
    data: CreateWorkspaceDto,
    userId: string
  ): Promise<Workspace | CustomError>
  delete(id: string): Promise<Workspace | CustomError>
}

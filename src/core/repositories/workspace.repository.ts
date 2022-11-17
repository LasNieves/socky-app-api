import { CustomError } from '../../errors'
import { Workspace } from '../entities'
import { CreateWorkspaceDto, WorkspaceDto } from './../dtos'

export interface WorkspaceRepository {
  getAll(): Promise<Workspace[]>
  get(id: string): Promise<WorkspaceDto | CustomError>
  create(
    data: CreateWorkspaceDto,
    userId: string
  ): Promise<Workspace | CustomError>
  delete(id: string): Promise<Workspace | CustomError>
}

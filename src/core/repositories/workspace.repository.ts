import { CustomError } from '../../errors'
import { Workspace } from '../entities'
import { WorkspaceDto } from './../dtos'

export interface WorkspaceRepository {
  getAll(): Promise<Workspace[]>
  get(id: string): Promise<WorkspaceDto | CustomError>
  delete(id: string): Promise<Workspace | CustomError>
}

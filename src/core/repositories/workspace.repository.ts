import { WorkspaceDto } from './../dtos'

export interface WorkspaceRepository {
  getById(id: string): Promise<WorkspaceDto | null>
}

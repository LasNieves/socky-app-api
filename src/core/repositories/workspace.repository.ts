import { CustomError } from '../../errors';
import { WorkspaceResponse } from './../entities/workspace.entity';

export interface WorkspaceRepository {
  getWorkspacesByUser(id: string): Promise<WorkspaceResponse | CustomError>
}

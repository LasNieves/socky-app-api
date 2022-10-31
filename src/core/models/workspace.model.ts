import { User } from '@prisma/client';
import { prisma } from '../../config/db';
import { CustomError, NotFound } from '../../errors';
import { RequireAtLeastOne } from '../../utilities/types';
import { WorkspaceResponse } from '../entities/workspace.entity';
import { WorkspaceRepository } from './../repositories/workspace.repository';

export class WorkspaceModel implements WorkspaceRepository {

    private async existUser(
        field: RequireAtLeastOne<Record<'id' | 'email', string>>
      ): Promise<User | null> {
        const existUser = await prisma.user.findUnique({
          where: { ...field },
        })
    
        return existUser
      }
    
   async getWorkspacesByUser(id: string): Promise<WorkspaceResponse | CustomError> {
    
    const existUser = await this.existUser({id})    
    
        if (!existUser) {
            return new NotFound(`Usuario con ${id} no encontrado`)
        }
        const workspaces = await prisma.usersOnWorkspaces.findMany({where: {userId: id}, include:{workspace: true,}})
        return workspaces 

    }
    
}
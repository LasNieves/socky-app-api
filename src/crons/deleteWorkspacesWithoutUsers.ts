import cron from 'node-cron'
import { prisma } from '../config/db'

import { workspaceService } from '../controllers/workspace.controller'

export const deleteWorkspacesWithoutUsers = cron.schedule(
  '0 1 * * Saturday',
  async () => {
    console.log('Running Task 1')

    const workspaces = await workspaceService.getAll()

    const workspacesToDelete = workspaces
      .filter((workspace) => !workspace.users?.length)
      .map((workspace) => workspace.id)

    await prisma.workspace.deleteMany({
      where: {
        id: {
          in: workspacesToDelete,
        },
      },
    })
  },
  {
    timezone: process.env.TIMEZONE,
  }
)

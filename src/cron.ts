import cron from 'node-cron'

import { workspaceService } from './controllers/workspace.controller'

export const deleteWorkspacesWithoutUsers = cron.schedule(
  '0 1 * * Saturday',
  async () => {
    console.log('Running Task 1')

    const workspaces = await workspaceService.getAll()

    const workspacesToDelete = workspaces.filter(
      (workspace) => !workspace.users?.length
    )

    workspacesToDelete.forEach(async (workspace) => {
      const deletedWorkspace = await workspaceService.delete(workspace.id)

      console.log(deletedWorkspace)
    })
  },
  {
    timezone: 'America/Buenos_Aires',
  }
)

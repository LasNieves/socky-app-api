/**
 * @swagger
 * components:
 *  schemas:
 *    CreateWorkspaceDto:
 *      description: Data required for creating a category
 *      type: object
 *      properties:
 *        name:
 *           type: string
 *           description: The name of the Workspace
 *        description:
 *           type: string
 *           description: The description of the Workspace
 *        isPersonal:
 *           type: boolean
 *           description: Indicates whether the workspace is personal or not
 *      required:
 *        - name
 */

export type CreateWorkspaceDto = {
  name: string
  description?: string
  isPersonal?: boolean
}

import { Category, User } from '../entities'

/**
 * @swagger
 * components:
 *  schemas:
 *    WorkspaceDto:
 *      description: Response for every auth endpoints
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id for the Workspace
 *        name:
 *           type: string
 *           description: The name of the Workspace
 *        icon:
 *           type: string
 *           description: The icon of the Workspace
 *        personal:
 *           type: boolean
 *           description: The field to define if the workspace is personal to the user or shared
 *        categories:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/CategoriesDto'
 */

export type WorkspaceDto = {
  id: string
  name: string
  icon: string
  personal: boolean
  categories: Category[]
  users: {
    user: Pick<User, 'id' | 'email'>
  }[]
}

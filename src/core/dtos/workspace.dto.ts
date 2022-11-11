import { Category, User } from '../entities'

/**
 * @swagger
 * components:
 *  schemas:
 *    WorkspaceDto:
 *      description: Response for the request of one Workspace
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
 *           description: The field to define if the workspace is personal or shared
 *        categories:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Category'
 *        users:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  format: uuid
 *                  description: The auto-generated id for the User          
 *                email:
 *                  type: string
 *                  format: email
 *                  description: The email of the User            
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

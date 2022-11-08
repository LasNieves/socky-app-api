import { UsersOnWorkspaces } from '@prisma/client'
import { Category } from './category.entity'

/**
 * @swagger
 * components:
 *  schemas:
 *    Workspace:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the workspace
 *        name:
 *           type: string
 *           description: The name of the workspace
 *        icon:
 *           type: string
 *           description: The icon of the workspace
 *        personal:
 *           type: boolean
 *           description: Is your personal's workspace or not? (default true)
 *      required:
 *        - id
 *        - name
 *        - icon
 *        - personal
 */

export interface Workspace {
  id: string
  name: string
  icon: string
  personal: boolean
  categories?: Category[]
  users?: UsersOnWorkspaces[]
}

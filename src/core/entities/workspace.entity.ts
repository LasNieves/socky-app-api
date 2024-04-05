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
 *        description:
 *           type: string
 *           description: The description of the workspace
 *        personal:
 *           type: boolean
 *           description: Is your personal's workspace or not? (default true)
 *        createdAt:
 *           type: string
 *           format: date-time
 *           description: The date of creation of the workspace (auto-generated too)
 *        updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last worksapce update (change automatically to the current date when any other field is updated)
 *      required:
 *        - id
 *        - name
 *        - personal
 *        - createdAt
 *        - updatedAt
 */

export interface Workspace {
  id: string
  name: string
  description: string | null
  personal: boolean

  createdAt: Date
  updatedAt: Date

  categories?: Category[]
  users?: UsersOnWorkspaces[]
}

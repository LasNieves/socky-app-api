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
 *        userId:
 *           type: string
 *           format: uuid
 *           description: The user owner of the new Workspace
 *        description:
 *           type: string
 *           description: The description of the Workspace
 *        isPersonal:
 *           type: boolean
 *           description: Indicates whether the workspace is personal or not
 *      required:
 *        - name
 *        - userId
 */

export type CreateWorkspaceDto = {
  name: string
  userId: string
  description?: string
  isPersonal?: boolean
}

/**
 * @swagger
 * components:
 *  schemas:
 *    RestorePostsDto:
 *      description: Data required for restore posts from trash bin
 *      type: object
 *      properties:
 *        posts:
 *           type: array
 *           items:
 *            type: string
 *           description: Array of posts to be restored
 *        categoryId:
 *           type: number
 *           description: What category does the posts restored go?
 *      required:
 *        - posts
 *        - categoryId
 */

export type RestorePostsDto = {
  posts: string[]
  categoryId: number
}

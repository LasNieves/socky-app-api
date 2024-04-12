export interface CreateCategoryDto {
  title: string
  workspaceId: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateCategoryDto:
 *      description: Data required for update a category
 *      type: object
 *      properties:
 *        title:
 *           type: string
 *           description: The title of the category
 */

export interface UpdateCategoryDto {
  title?: string
}

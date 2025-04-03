/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateProfileDto:
 *      description: Update  profile data
 *      type: object
 *      properties:
 *        firstName:
 *           type: string
 *           description: The first name of the user
 *        lastName:
 *           type: string
 *           description: The last name of the user
 *        avatar:
 *           type: string
 *           format: uri
 *           description: The user's avatar
 *        color:
 *           type: string
 *           format: hexadecimal
 *           description: The last name of the user
 */
export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  avatar?: string
  color?: string
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Profile:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the profile
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
 *        userId:
 *           type: string
 *           format: uuid
 *           description: Who is the user associated with this profile?
 *      required:
 *        - id
 *        - firstName
 *        - lastName
 *        - userId
 */

export interface Profile {
  id: string
  firstName: string
  lastName: string
  avatar?: string | null
  userId: string
}

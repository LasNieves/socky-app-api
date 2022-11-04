/**
 * @swagger
 * components:
 *  schemas:
 *    Profile:
 *      type: object
 *      properties:
 *        id:
 *           type: string
 *           description: The auto-generated id of the profile (uuid)
 *        firstName:
 *           type: string
 *           description: The first name of the user
 *        lastName:
 *           type: string
 *           description: The last name of the user
 *        avatar:
 *           type: string
 *           description: The user's avatar
 *        userId:
 *           type: string
 *           description: Who is the user associated with this profile?
 *      required:
 *        - id
 *        - firstName
 *        - lastName
 *        - avatar
 *        - userId
 */

export interface Profile {
  id: string
  firstName: string
  lastName: string
  avatar: string
  userId: string
}

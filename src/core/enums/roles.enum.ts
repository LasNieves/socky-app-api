/**
 * @swagger
 * components:
 *  schemas:
 *    Roles:
 *      description: Roles inside a Workspace
 *      type: string
 *      enum: [OWNER, ADMIN, MEMBER, CAN_VIEW]
 */

export enum Roles {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  CAN_VIEW = 'CAN_VIEW',
}

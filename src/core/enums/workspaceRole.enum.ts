/**
 * @swagger
 * components:
 *  schemas:
 *    WorkspaceRole:
 *      description: Roles inside a Workspace
 *      type: string
 *      enum: [OWNER, ADMIN, MEMBER, CAN_VIEW]
 */

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'CAN_VIEW'

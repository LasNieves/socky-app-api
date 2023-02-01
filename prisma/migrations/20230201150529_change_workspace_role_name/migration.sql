/*
  Warnings:

  - Changed the type of `role` on the `users_workspaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'CAN_VIEW');

-- AlterTable
ALTER TABLE "users_workspaces" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";

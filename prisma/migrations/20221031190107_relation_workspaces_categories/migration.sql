/*
  Warnings:

  - You are about to drop the column `workspace_id` on the `posts` table. All the data in the column will be lost.
  - Added the required column `workspaceId` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_workspace_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "workspace_id";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `UsersOnWorkspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnWorkspaces" DROP CONSTRAINT "UsersOnWorkspaces_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnWorkspaces" DROP CONSTRAINT "UsersOnWorkspaces_workspace_id_fkey";

-- DropTable
DROP TABLE "UsersOnWorkspaces";

-- CreateTable
CREATE TABLE "users_workspaces" (
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_workspaces_pkey" PRIMARY KEY ("user_id","workspace_id")
);

-- AddForeignKey
ALTER TABLE "users_workspaces" ADD CONSTRAINT "users_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces" ADD CONSTRAINT "users_workspaces_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

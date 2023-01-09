-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

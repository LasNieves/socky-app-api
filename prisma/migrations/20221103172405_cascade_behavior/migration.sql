-- DropForeignKey
ALTER TABLE "users_workspaces" DROP CONSTRAINT "users_workspaces_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users_workspaces" ADD CONSTRAINT "users_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

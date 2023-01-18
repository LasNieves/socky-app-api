-- DropForeignKey
ALTER TABLE "codes" DROP CONSTRAINT "codes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

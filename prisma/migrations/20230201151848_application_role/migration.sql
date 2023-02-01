-- CreateEnum
CREATE TYPE "ApplicationRole" AS ENUM ('SUPERADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "ApplicationRole" NOT NULL DEFAULT 'USER';

/*
  Warnings:

  - Added the required column `view` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `view` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "view" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "view" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hash" DROP NOT NULL;

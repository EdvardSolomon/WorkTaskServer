/*
  Warnings:

  - Added the required column `destination` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

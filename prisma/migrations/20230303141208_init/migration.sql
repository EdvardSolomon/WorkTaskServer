-- DropForeignKey
ALTER TABLE "EditorsOnFile" DROP CONSTRAINT "EditorsOnFile_fileId_fkey";

-- DropForeignKey
ALTER TABLE "EditorsOnFile" DROP CONSTRAINT "EditorsOnFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "EditorsOnFolder" DROP CONSTRAINT "EditorsOnFolder_folderId_fkey";

-- DropForeignKey
ALTER TABLE "EditorsOnFolder" DROP CONSTRAINT "EditorsOnFolder_userId_fkey";

-- DropForeignKey
ALTER TABLE "ViewersOnFile" DROP CONSTRAINT "ViewersOnFile_fileId_fkey";

-- DropForeignKey
ALTER TABLE "ViewersOnFile" DROP CONSTRAINT "ViewersOnFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ViewersOnFolder" DROP CONSTRAINT "ViewersOnFolder_folderId_fkey";

-- DropForeignKey
ALTER TABLE "ViewersOnFolder" DROP CONSTRAINT "ViewersOnFolder_userId_fkey";

-- AddForeignKey
ALTER TABLE "EditorsOnFolder" ADD CONSTRAINT "EditorsOnFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFolder" ADD CONSTRAINT "EditorsOnFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFolder" ADD CONSTRAINT "ViewersOnFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFolder" ADD CONSTRAINT "ViewersOnFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFile" ADD CONSTRAINT "EditorsOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFile" ADD CONSTRAINT "EditorsOnFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFile" ADD CONSTRAINT "ViewersOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFile" ADD CONSTRAINT "ViewersOnFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

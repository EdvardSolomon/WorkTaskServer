-- CreateTable
CREATE TABLE "EditorsOnFolder" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorsOnFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewersOnFolder" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewersOnFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorsOnFile" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorsOnFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewersOnFile" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewersOnFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditorsOnFolder" ADD CONSTRAINT "EditorsOnFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFolder" ADD CONSTRAINT "EditorsOnFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFolder" ADD CONSTRAINT "ViewersOnFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFolder" ADD CONSTRAINT "ViewersOnFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFile" ADD CONSTRAINT "EditorsOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorsOnFile" ADD CONSTRAINT "EditorsOnFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFile" ADD CONSTRAINT "ViewersOnFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewersOnFile" ADD CONSTRAINT "ViewersOnFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

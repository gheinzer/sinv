/*
  Warnings:

  - You are about to drop the `AttachementType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `attachementTypeId` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `attachmentTypeId` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AttachementType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AttachementType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RepositoryPermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repositoryId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "RepositoryPermission_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RepositoryPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttachmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "id", "objectTypeId") SELECT "creatorID", "id", "objectTypeId" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
CREATE UNIQUE INDEX "Object_id_key" ON "Object"("id");
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    "objectId" TEXT NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("comment", "id", "mimeType", "objectId") SELECT "comment", "id", "mimeType", "objectId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_key" ON "Repository"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AttachmentType_name_key" ON "AttachmentType"("name");

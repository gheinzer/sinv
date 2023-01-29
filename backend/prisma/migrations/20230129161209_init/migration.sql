/*
  Warnings:

  - You are about to alter the column `object1ID` on the `ObjectRelation` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `object2ID` on the `ObjectRelation` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `objectId` on the `Attachment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Object` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Object` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `description` to the `Object` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userDefinedID` to the `Object` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ObjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relationTypeId" INTEGER NOT NULL,
    "object1ID" INTEGER NOT NULL,
    "object2ID" INTEGER NOT NULL,
    CONSTRAINT "ObjectRelation_relationTypeId_fkey" FOREIGN KEY ("relationTypeId") REFERENCES "RelationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object1ID_fkey" FOREIGN KEY ("object1ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object2ID_fkey" FOREIGN KEY ("object2ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ObjectRelation" ("id", "object1ID", "object2ID", "relationTypeId") SELECT "id", "object1ID", "object2ID", "relationTypeId" FROM "ObjectRelation";
DROP TABLE "ObjectRelation";
ALTER TABLE "new_ObjectRelation" RENAME TO "ObjectRelation";
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    "objectId" INTEGER NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachmentTypeId", "comment", "id", "mimeType", "objectId") SELECT "attachmentTypeId", "comment", "id", "mimeType", "objectId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
CREATE TABLE "new_Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userDefinedID" TEXT NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repositoryId" INTEGER,
    "description" TEXT NOT NULL,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "id", "lastAccessed", "objectTypeId", "repositoryId") SELECT "creatorID", "id", "lastAccessed", "objectTypeId", "repositoryId" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

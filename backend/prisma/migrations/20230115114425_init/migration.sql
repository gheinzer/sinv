/*
  Warnings:

  - The primary key for the `Object` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `objectTypeId` on table `Object` required. This step will fail if there are existing NULL values in that column.
  - Made the column `relationTypeId` on table `ObjectRelation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `attachementTypeId` on table `Attachment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `objectId` on table `Attachment` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "id", "objectTypeId") SELECT "creatorID", "id", "objectTypeId" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
CREATE TABLE "new_ObjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relationTypeId" INTEGER NOT NULL,
    "object1ID" TEXT NOT NULL,
    "object2ID" TEXT NOT NULL,
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
    "attachementTypeId" INTEGER NOT NULL,
    "objectId" TEXT NOT NULL,
    CONSTRAINT "Attachment_attachementTypeId_fkey" FOREIGN KEY ("attachementTypeId") REFERENCES "AttachementType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachementTypeId", "comment", "id", "mimeType", "objectId") SELECT "attachementTypeId", "comment", "id", "mimeType", "objectId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

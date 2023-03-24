/*
  Warnings:

  - You are about to drop the column `creatorID` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessed` on the `Object` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userDefinedID" TEXT NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    "repositoryId" INTEGER,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Object_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Object_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("description", "id", "name", "objectTypeId", "repositoryId", "userDefinedID") SELECT "description", "id", "name", "objectTypeId", "repositoryId", "userDefinedID" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

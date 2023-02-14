/*
  Warnings:

  - Added the required column `name` to the `Object` table without a default value. This is not possible if the table is not empty.
  - Made the column `repositoryId` on table `ObjectType` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userDefinedID" TEXT NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repositoryId" INTEGER,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "description", "id", "lastAccessed", "objectTypeId", "repositoryId", "userDefinedID") SELECT "creatorID", "description", "id", "lastAccessed", "objectTypeId", "repositoryId", "userDefinedID" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
CREATE TABLE "new_ObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "ObjectType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ObjectType" ("id", "name", "repositoryId") SELECT "id", "name", "repositoryId" FROM "ObjectType";
DROP TABLE "ObjectType";
ALTER TABLE "new_ObjectType" RENAME TO "ObjectType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

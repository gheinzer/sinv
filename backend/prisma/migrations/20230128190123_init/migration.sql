-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "ObjectType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ObjectType" ("id", "name") SELECT "id", "name" FROM "ObjectType";
DROP TABLE "ObjectType";
ALTER TABLE "new_ObjectType" RENAME TO "ObjectType";
CREATE UNIQUE INDEX "ObjectType_name_key" ON "ObjectType"("name");
CREATE TABLE "new_RelationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "RelationType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RelationType" ("id", "name") SELECT "id", "name" FROM "RelationType";
DROP TABLE "RelationType";
ALTER TABLE "new_RelationType" RENAME TO "RelationType";
CREATE UNIQUE INDEX "RelationType_name_key" ON "RelationType"("name");
CREATE TABLE "new_AttachmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "AttachmentType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AttachmentType" ("id", "name") SELECT "id", "name" FROM "AttachmentType";
DROP TABLE "AttachmentType";
ALTER TABLE "new_AttachmentType" RENAME TO "AttachmentType";
CREATE UNIQUE INDEX "AttachmentType_name_key" ON "AttachmentType"("name");
CREATE TABLE "new_Object" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER NOT NULL,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repositoryId" INTEGER,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "id", "lastAccessed", "objectTypeId") SELECT "creatorID", "id", "lastAccessed", "objectTypeId" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
CREATE UNIQUE INDEX "Object_id_key" ON "Object"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateTable
CREATE TABLE "ObjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relationTypeId" INTEGER,
    "object1ID" INTEGER NOT NULL,
    "object2ID" INTEGER NOT NULL,
    CONSTRAINT "ObjectRelation_relationTypeId_fkey" FOREIGN KEY ("relationTypeId") REFERENCES "RelationType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object1ID_fkey" FOREIGN KEY ("object1ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object2ID_fkey" FOREIGN KEY ("object2ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AttachementType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachementTypeId" INTEGER,
    "objectId" INTEGER,
    CONSTRAINT "Attachment_attachementTypeId_fkey" FOREIGN KEY ("attachementTypeId") REFERENCES "AttachementType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "creatorID" INTEGER NOT NULL,
    "objectTypeId" INTEGER,
    CONSTRAINT "Object_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "id") SELECT "creatorID", "id" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "RelationType_name_key" ON "RelationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectType_name_key" ON "ObjectType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AttachementType_name_key" ON "AttachementType"("name");

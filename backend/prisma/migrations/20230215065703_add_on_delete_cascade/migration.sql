-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RelationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "RelationType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RelationType" ("id", "name", "repositoryId") SELECT "id", "name", "repositoryId" FROM "RelationType";
DROP TABLE "RelationType";
ALTER TABLE "new_RelationType" RENAME TO "RelationType";
CREATE UNIQUE INDEX "RelationType_name_key" ON "RelationType"("name");
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    "objectId" INTEGER NOT NULL,
    "fileExtension" TEXT NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachmentTypeId", "comment", "fileExtension", "id", "mimeType", "objectId") SELECT "attachmentTypeId", "comment", "fileExtension", "id", "mimeType", "objectId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
CREATE TABLE "new_UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSession" ("id", "opened", "userId") SELECT "id", "opened", "userId" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
CREATE TABLE "new_ObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "ObjectType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ObjectType" ("id", "name", "repositoryId") SELECT "id", "name", "repositoryId" FROM "ObjectType";
DROP TABLE "ObjectType";
ALTER TABLE "new_ObjectType" RENAME TO "ObjectType";
CREATE TABLE "new_RepositoryPermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repositoryId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "RepositoryPermission_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RepositoryPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RepositoryPermission" ("id", "repositoryId", "userId") SELECT "id", "repositoryId", "userId" FROM "RepositoryPermission";
DROP TABLE "RepositoryPermission";
ALTER TABLE "new_RepositoryPermission" RENAME TO "RepositoryPermission";
CREATE TABLE "new_AttachmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "AttachmentType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AttachmentType" ("id", "name", "repositoryId") SELECT "id", "name", "repositoryId" FROM "AttachmentType";
DROP TABLE "AttachmentType";
ALTER TABLE "new_AttachmentType" RENAME TO "AttachmentType";
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
    CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Object_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Object" ("creatorID", "description", "id", "lastAccessed", "name", "objectTypeId", "repositoryId", "userDefinedID") SELECT "creatorID", "description", "id", "lastAccessed", "name", "objectTypeId", "repositoryId", "userDefinedID" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
CREATE TABLE "new_ObjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relationTypeId" INTEGER NOT NULL,
    "object1ID" INTEGER NOT NULL,
    "object2ID" INTEGER NOT NULL,
    CONSTRAINT "ObjectRelation_relationTypeId_fkey" FOREIGN KEY ("relationTypeId") REFERENCES "RelationType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object1ID_fkey" FOREIGN KEY ("object1ID") REFERENCES "Object" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object2ID_fkey" FOREIGN KEY ("object2ID") REFERENCES "Object" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ObjectRelation" ("id", "object1ID", "object2ID", "relationTypeId") SELECT "id", "object1ID", "object2ID", "relationTypeId" FROM "ObjectRelation";
DROP TABLE "ObjectRelation";
ALTER TABLE "new_ObjectRelation" RENAME TO "ObjectRelation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

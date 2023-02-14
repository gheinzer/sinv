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
CREATE TABLE "Object" (
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

-- CreateTable
CREATE TABLE "ObjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relationTypeId" INTEGER NOT NULL,
    "object1ID" INTEGER NOT NULL,
    "object2ID" INTEGER NOT NULL,
    CONSTRAINT "ObjectRelation_relationTypeId_fkey" FOREIGN KEY ("relationTypeId") REFERENCES "RelationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object1ID_fkey" FOREIGN KEY ("object1ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ObjectRelation_object2ID_fkey" FOREIGN KEY ("object2ID") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelationType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "RelationType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    CONSTRAINT "ObjectType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttachmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repositoryId" INTEGER,
    CONSTRAINT "AttachmentType_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    "objectId" INTEGER NOT NULL,
    "fileExtension" TEXT NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "permissionString" TEXT NOT NULL DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_key" ON "Repository"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RelationType_name_key" ON "RelationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

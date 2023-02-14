/*
  Warnings:

  - Added the required column `fileExtension` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mimeType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "attachmentTypeId" INTEGER NOT NULL,
    "objectId" INTEGER NOT NULL,
    "fileExtension" TEXT NOT NULL,
    CONSTRAINT "Attachment_attachmentTypeId_fkey" FOREIGN KEY ("attachmentTypeId") REFERENCES "AttachmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("attachmentTypeId", "comment", "id", "mimeType", "objectId") SELECT "attachmentTypeId", "comment", "id", "mimeType", "objectId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

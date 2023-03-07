/*
  Warnings:

  - Made the column `userId` on table `UserSession` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "PasswordResetRequests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "PasswordResetRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSession" ("id", "opened", "userId") SELECT "id", "opened", "userId" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

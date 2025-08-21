/*
  Warnings:

  - You are about to drop the column `shlinkId` on the `ShortLinks` table. All the data in the column will be lost.
  - Added the required column `shLinkCode` to the `ShortLinks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShortLinks" DROP COLUMN "shlinkId",
ADD COLUMN     "deviceInfo" JSONB,
ADD COLUMN     "shLinkCode" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `postId` to the `NewestInstagramReels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewestInstagramReels" ADD COLUMN     "postId" TEXT NOT NULL;

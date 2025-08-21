/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `NewestInstagramReels` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `NewestInstagramReels` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `NewestInstagramReels` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `NewestInstagramReels` table. All the data in the column will be lost.
  - Added the required column `media_url` to the `NewestInstagramReels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewestInstagramReels" DROP COLUMN "commentsCount",
DROP COLUMN "likeCount",
DROP COLUMN "mediaUrl",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "comments_count" INTEGER,
ADD COLUMN     "like_count" INTEGER,
ADD COLUMN     "media_url" TEXT NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT;

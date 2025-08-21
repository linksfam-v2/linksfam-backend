/*
  Warnings:

  - You are about to drop the column `facebook_username` on the `InfluencerSocialAccount` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_username` on the `InfluencerSocialAccount` table. All the data in the column will be lost.
  - You are about to drop the column `x_username` on the `InfluencerSocialAccount` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_username` on the `InfluencerSocialAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InfluencerSocialAccount" DROP COLUMN "facebook_username",
DROP COLUMN "instagram_username",
DROP COLUMN "x_username",
DROP COLUMN "youtube_username",
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "x" TEXT,
ADD COLUMN     "youtube" TEXT;

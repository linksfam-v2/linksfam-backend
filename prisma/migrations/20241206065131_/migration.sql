/*
  Warnings:

  - You are about to drop the column `influencerSocialAccountId` on the `Influencer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[influencerId]` on the table `InfluencerSocialAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `influencerId` to the `InfluencerSocialAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Influencer" DROP CONSTRAINT "Influencer_influencerSocialAccountId_fkey";

-- DropIndex
DROP INDEX "Influencer_influencerSocialAccountId_key";

-- AlterTable
ALTER TABLE "Influencer" DROP COLUMN "influencerSocialAccountId";

-- AlterTable
ALTER TABLE "InfluencerSocialAccount" ADD COLUMN     "influencerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InfluencerSocialAccount_influencerId_key" ON "InfluencerSocialAccount"("influencerId");

-- AddForeignKey
ALTER TABLE "InfluencerSocialAccount" ADD CONSTRAINT "InfluencerSocialAccount_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

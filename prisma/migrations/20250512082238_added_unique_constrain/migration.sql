/*
  Warnings:

  - A unique constraint covering the columns `[userId,socialMediaType]` on the table `InfluencerSocialDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InfluencerSocialDetails_userId_socialMediaType_key" ON "InfluencerSocialDetails"("userId", "socialMediaType");

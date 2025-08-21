/*
  Warnings:

  - Added the required column `influencerId` to the `ShopPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShopPost" ADD COLUMN     "influencerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopPost" ADD CONSTRAINT "ShopPost_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

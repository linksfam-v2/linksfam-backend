/*
  Warnings:

  - Added the required column `updatedAt` to the `Influencer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Influencer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ShortLinks" (
    "id" SERIAL NOT NULL,
    "linkId" INTEGER NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "shlinkId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLinks_influencerId_key" ON "ShortLinks"("influencerId");

-- AddForeignKey
ALTER TABLE "ShortLinks" ADD CONSTRAINT "ShortLinks_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortLinks" ADD CONSTRAINT "ShortLinks_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

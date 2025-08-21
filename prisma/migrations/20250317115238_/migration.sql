-- AlterTable
ALTER TABLE "Brands" ADD COLUMN     "campaignId" TEXT;

-- CreateTable
CREATE TABLE "Affiliate" (
    "id" SERIAL NOT NULL,
    "params" TEXT,
    "influencerParams" TEXT,
    "fixedParams" TEXT,
    "affiliateLink" TEXT,
    "name" TEXT,
    "note" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

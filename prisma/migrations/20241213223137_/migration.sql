-- CreateEnum
CREATE TYPE "INFLUENCER_TRANS_TYPE" AS ENUM ('EARNING', 'REDEEM');

-- CreateTable
CREATE TABLE "InfluencerWallet" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "walletBalance" DECIMAL(65,30) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerWallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InfluencerWallet" ADD CONSTRAINT "InfluencerWallet_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

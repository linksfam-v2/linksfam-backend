-- CreateTable
CREATE TABLE "MiscShortLinks" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "shLinkCode" TEXT NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "otherInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiscShortLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MiscShortLinks" ADD CONSTRAINT "MiscShortLinks_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiscShortLinks" ADD CONSTRAINT "MiscShortLinks_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "PartnerBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

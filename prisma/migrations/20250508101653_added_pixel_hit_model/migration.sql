-- CreateTable
CREATE TABLE "PixelHit" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "influencerId" INTEGER,
    "event" TEXT NOT NULL DEFAULT 'signup',
    "value" DOUBLE PRECISION DEFAULT 0,
    "ip" TEXT NOT NULL,
    "ua" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PixelHit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PixelHit" ADD CONSTRAINT "PixelHit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PixelHit" ADD CONSTRAINT "PixelHit_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

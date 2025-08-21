-- CreateTable
CREATE TABLE "RequestRefund" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestRefund_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestRefund" ADD CONSTRAINT "RequestRefund_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

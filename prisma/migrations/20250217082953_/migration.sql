-- CreateTable
CREATE TABLE "TrackTemporaryTransaction" (
    "id" SERIAL NOT NULL,
    "transId" TEXT,
    "amount" DECIMAL(65,30) DEFAULT 0.00,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackTemporaryTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackTemporaryTransaction" ADD CONSTRAINT "TrackTemporaryTransaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

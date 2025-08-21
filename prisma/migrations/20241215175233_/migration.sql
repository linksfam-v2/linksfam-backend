-- CreateTable
CREATE TABLE "InfluencerLedger" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "dateScheduled" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountRecieved" DECIMAL(65,30) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfluencerInvoice" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL,
    "invoiceSerialNo" TEXT,
    "invoiceAmount" DECIMAL(65,30) DEFAULT 0.00,
    "transType" "INFLUENCER_TRANS_TYPE" NOT NULL DEFAULT 'EARNING',
    "creditInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfluencerBankInfo" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "upi" TEXT,
    "accountNumber" TEXT,
    "ifsc" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerBankInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InfluencerLedger" ADD CONSTRAINT "InfluencerLedger_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfluencerInvoice" ADD CONSTRAINT "InfluencerInvoice_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfluencerBankInfo" ADD CONSTRAINT "InfluencerBankInfo_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

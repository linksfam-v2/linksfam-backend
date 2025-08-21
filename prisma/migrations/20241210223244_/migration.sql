-- CreateTable
CREATE TABLE "CompanyBankInfo" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "gst" TEXT,
    "accountNumber" TEXT,
    "ifsc" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyBankInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyBankInfo" ADD CONSTRAINT "CompanyBankInfo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

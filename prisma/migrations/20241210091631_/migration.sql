-- CreateTable
CREATE TABLE "CompanyLedger" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "dateScheduled" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountSpent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInvoice" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL,
    "invoiceNo" TEXT,
    "amountSpent" TEXT,
    "isSettled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyWallet" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "rechargeAmount" TEXT NOT NULL,
    "rechargeTransId" TEXT,
    "recharge3rdParty" TEXT,
    "invoiceId" INTEGER NOT NULL,
    "invoiceAmount" TEXT,
    "balanceAmount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyWallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyLedger" ADD CONSTRAINT "CompanyLedger_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInvoice" ADD CONSTRAINT "CompanyInvoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyWallet" ADD CONSTRAINT "CompanyWallet_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyWallet" ADD CONSTRAINT "CompanyWallet_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "CompanyInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

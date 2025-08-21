/*
  Warnings:

  - The `amountSpent` column on the `CompanyInvoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amountSpent` column on the `CompanyLedger` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rechargeAmount` column on the `CompanyWallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `invoiceAmount` column on the `CompanyWallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balanceAmount` column on the `CompanyWallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TRANS_TYPE" AS ENUM ('CREDIT', 'DEBIT');

-- DropForeignKey
ALTER TABLE "CompanyWallet" DROP CONSTRAINT "CompanyWallet_invoiceId_fkey";

-- AlterTable
ALTER TABLE "CompanyInvoice" DROP COLUMN "amountSpent",
ADD COLUMN     "amountSpent" DECIMAL(65,30) DEFAULT 0.00;

-- AlterTable
ALTER TABLE "CompanyLedger" DROP COLUMN "amountSpent",
ADD COLUMN     "amountSpent" DECIMAL(65,30) DEFAULT 0.00;

-- AlterTable
ALTER TABLE "CompanyWallet" ADD COLUMN     "transType" "TRANS_TYPE" NOT NULL DEFAULT 'CREDIT',
DROP COLUMN "rechargeAmount",
ADD COLUMN     "rechargeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ALTER COLUMN "invoiceId" DROP NOT NULL,
DROP COLUMN "invoiceAmount",
ADD COLUMN     "invoiceAmount" DECIMAL(65,30) DEFAULT 0.00,
DROP COLUMN "balanceAmount",
ADD COLUMN     "balanceAmount" DECIMAL(65,30) DEFAULT 0.00;

-- AddForeignKey
ALTER TABLE "CompanyWallet" ADD CONSTRAINT "CompanyWallet_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "CompanyInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

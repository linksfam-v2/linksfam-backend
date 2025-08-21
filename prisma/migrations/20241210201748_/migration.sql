/*
  Warnings:

  - You are about to drop the column `amountSpent` on the `CompanyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNo` on the `CompanyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `isSettled` on the `CompanyInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `balanceAmount` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceAmount` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `recharge3rdParty` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `rechargeAmount` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `rechargeTransId` on the `CompanyWallet` table. All the data in the column will be lost.
  - You are about to drop the column `transType` on the `CompanyWallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyWallet" DROP CONSTRAINT "CompanyWallet_invoiceId_fkey";

-- AlterTable
ALTER TABLE "CompanyInvoice" DROP COLUMN "amountSpent",
DROP COLUMN "invoiceNo",
DROP COLUMN "isSettled",
ADD COLUMN     "creditInfo" JSONB,
ADD COLUMN     "invoiceAmount" DECIMAL(65,30) DEFAULT 0.00,
ADD COLUMN     "invoiceSerialNo" TEXT,
ADD COLUMN     "transType" "TRANS_TYPE" NOT NULL DEFAULT 'CREDIT';

-- AlterTable
ALTER TABLE "CompanyWallet" DROP COLUMN "balanceAmount",
DROP COLUMN "invoiceAmount",
DROP COLUMN "invoiceId",
DROP COLUMN "recharge3rdParty",
DROP COLUMN "rechargeAmount",
DROP COLUMN "rechargeTransId",
DROP COLUMN "transType",
ADD COLUMN     "walletBalance" DECIMAL(65,30) DEFAULT 0.00;

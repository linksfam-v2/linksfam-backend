/*
  Warnings:

  - You are about to drop the column `influencerId` on the `RequestRefund` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `RequestRefund` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RequestRefund" DROP CONSTRAINT "RequestRefund_influencerId_fkey";

-- AlterTable
ALTER TABLE "RequestRefund" DROP COLUMN "influencerId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RequestRefund" ADD CONSTRAINT "RequestRefund_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

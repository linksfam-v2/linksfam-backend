/*
  Warnings:

  - Added the required column `logoUrl` to the `PartnerBrand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartnerBrand" ADD COLUMN     "logoUrl" TEXT NOT NULL;

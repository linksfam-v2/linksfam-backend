/*
  Warnings:

  - You are about to drop the column `url` on the `AmazonConversion` table. All the data in the column will be lost.
  - Added the required column `ig_url` to the `AmazonConversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AmazonConversion" DROP COLUMN "url",
ADD COLUMN     "ig_url" TEXT NOT NULL;

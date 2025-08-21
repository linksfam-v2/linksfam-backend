/*
  Warnings:

  - You are about to drop the column `productUrl` on the `ShopPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopPost" DROP COLUMN "productUrl",
ADD COLUMN     "productUrls" TEXT[];

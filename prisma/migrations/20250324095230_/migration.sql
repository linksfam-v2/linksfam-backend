-- AlterTable
ALTER TABLE "Brands" ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Brands" ADD CONSTRAINT "Brands_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

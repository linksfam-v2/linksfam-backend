-- CreateTable
CREATE TABLE "PartnerBrand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "heroMediaUrl" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerBrandProduct" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "heroTitle" TEXT NOT NULL,
    "size" TEXT,
    "otherInfo" TEXT,
    "redirectUrl" TEXT NOT NULL,
    "productImage" TEXT[],
    "partnerBrandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerBrandProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartnerBrandProduct" ADD CONSTRAINT "PartnerBrandProduct_partnerBrandId_fkey" FOREIGN KEY ("partnerBrandId") REFERENCES "PartnerBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

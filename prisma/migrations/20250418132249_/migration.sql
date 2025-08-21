-- CreateTable
CREATE TABLE "AmazonConversion" (
    "id" SERIAL NOT NULL,
    "fees" TEXT NOT NULL,
    "clicks" TEXT NOT NULL,
    "itemsOrdered" TEXT NOT NULL,
    "itemsShipped" TEXT NOT NULL,
    "revenue" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmazonConversion_pkey" PRIMARY KEY ("id")
);

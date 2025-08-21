-- CreateTable
CREATE TABLE "Advertistment" (
    "id" SERIAL NOT NULL,
    "source" TEXT,
    "brand" TEXT,
    "category" TEXT,
    "keyword" TEXT,
    "url" TEXT,
    "email_creds" TEXT,
    "username_creds" TEXT,
    "password_creds" TEXT,
    "affiliate_page_link" TEXT,
    "payment_strategy" TEXT,
    "product_link" TEXT,
    "note" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertistment_pkey" PRIMARY KEY ("id")
);

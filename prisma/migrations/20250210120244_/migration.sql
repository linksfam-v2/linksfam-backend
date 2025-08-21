-- CreateTable
CREATE TABLE "Source" (
    "id" SERIAL NOT NULL,
    "source_name" TEXT,
    "source_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStrategy" (
    "id" SERIAL NOT NULL,
    "strategy_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brands" (
    "id" SERIAL NOT NULL,
    "brand_name" TEXT,
    "brand_email" TEXT,
    "brand_url" TEXT,
    "person_name" TEXT,
    "person_email" TEXT,
    "person_phone" TEXT,
    "emp_count" INTEGER,
    "max_spend" DECIMAL(65,30) DEFAULT 0.00,
    "min_spend" DECIMAL(65,30) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brands_pkey" PRIMARY KEY ("id")
);

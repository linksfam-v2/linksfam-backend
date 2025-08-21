-- CreateTable
CREATE TABLE "Creators" (
    "id" SERIAL NOT NULL,
    "URL" TEXT,
    "Name" TEXT,
    "Type" TEXT,
    "Platforms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creators_pkey" PRIMARY KEY ("id")
);

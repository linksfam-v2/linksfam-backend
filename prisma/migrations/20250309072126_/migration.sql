-- CreateTable
CREATE TABLE "InfluencerSocialDetails" (
    "id" SERIAL NOT NULL,
    "socialMediaType" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InfluencerSocialDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InfluencerSocialDetails" ADD CONSTRAINT "InfluencerSocialDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

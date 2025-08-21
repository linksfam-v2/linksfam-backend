-- CreateTable
CREATE TABLE "InfluencerSocialAccount" (
    "id" SERIAL NOT NULL,
    "instagram_username" TEXT,
    "instagram_phyllo_account_id" TEXT,
    "youtube_username" TEXT,
    "youtube_phyllo_account_id" TEXT,
    "facebook_username" TEXT,
    "facebook_phyllo_account_id" TEXT,
    "x_username" TEXT,
    "x_phyllo_account_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfluencerSocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Influencer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "influencerSocialAccountId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Influencer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_userId_key" ON "Influencer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_influencerSocialAccountId_key" ON "Influencer"("influencerSocialAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_categoryId_key" ON "Influencer"("categoryId");

-- AddForeignKey
ALTER TABLE "Influencer" ADD CONSTRAINT "Influencer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Influencer" ADD CONSTRAINT "Influencer_influencerSocialAccountId_fkey" FOREIGN KEY ("influencerSocialAccountId") REFERENCES "InfluencerSocialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Influencer" ADD CONSTRAINT "Influencer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

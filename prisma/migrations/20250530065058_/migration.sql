-- CreateTable
CREATE TABLE "NewestInstagramReels" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "likeCount" INTEGER,
    "commentsCount" INTEGER,
    "socialId" INTEGER NOT NULL,

    CONSTRAINT "NewestInstagramReels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewestInstagramReels" ADD CONSTRAINT "NewestInstagramReels_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "InfluencerSocialDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

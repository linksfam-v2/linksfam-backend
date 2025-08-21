-- CreateTable
CREATE TABLE "NewestYoutubeVideos" (
    "id" SERIAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER,
    "comments" INTEGER,
    "viewCount" INTEGER,
    "socialId" INTEGER NOT NULL,

    CONSTRAINT "NewestYoutubeVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewestYoutubeVideos" ADD CONSTRAINT "NewestYoutubeVideos_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "InfluencerSocialDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

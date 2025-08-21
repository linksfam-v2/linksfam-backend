-- AlterTable
ALTER TABLE "Influencer" ADD COLUMN     "is_insta_eligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_yt_eligible" BOOLEAN NOT NULL DEFAULT false;

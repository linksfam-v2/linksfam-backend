-- AlterTable
ALTER TABLE "ShopPost" ADD COLUMN     "igPostId" TEXT,
ADD COLUMN     "mediaExpiry" TIMESTAMP(3),
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserPhyllo" (
    "id" SERIAL NOT NULL,
    "phyllo_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserPhyllo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPhyllo" ADD CONSTRAINT "UserPhyllo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

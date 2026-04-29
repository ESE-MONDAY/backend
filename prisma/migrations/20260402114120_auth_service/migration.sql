-- CreateTable
CREATE TABLE "AuthTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthTransaction_refreshToken_key" ON "AuthTransaction"("refreshToken");

-- AddForeignKey
ALTER TABLE "AuthTransaction" ADD CONSTRAINT "AuthTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

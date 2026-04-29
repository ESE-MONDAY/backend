-- DropForeignKey
ALTER TABLE "AuthTransaction" DROP CONSTRAINT "AuthTransaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "AuthTransaction" ADD CONSTRAINT "AuthTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `studentName` on the `Score` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_studentName_fkey";

-- DropIndex
DROP INDEX "Student_name_key";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "studentName",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

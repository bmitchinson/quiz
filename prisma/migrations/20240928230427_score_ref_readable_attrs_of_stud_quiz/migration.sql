/*
  Warnings:

  - You are about to drop the column `quizId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Score` table. All the data in the column will be lost.
  - Added the required column `quizCode` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_studentId_fkey";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "quizId",
DROP COLUMN "studentId",
ADD COLUMN     "quizCode" VARCHAR(6) NOT NULL,
ADD COLUMN     "studentName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_studentName_fkey" FOREIGN KEY ("studentName") REFERENCES "Student"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_quizCode_fkey" FOREIGN KEY ("quizCode") REFERENCES "Quiz"("accessCode") ON DELETE CASCADE ON UPDATE CASCADE;

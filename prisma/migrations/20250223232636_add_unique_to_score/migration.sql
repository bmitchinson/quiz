/*
  Warnings:

  - A unique constraint covering the columns `[quizCode,studentId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Score_quizCode_studentId_key" ON "Score"("quizCode", "studentId");

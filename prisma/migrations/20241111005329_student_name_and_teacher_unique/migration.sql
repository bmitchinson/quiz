/*
  Warnings:

  - A unique constraint covering the columns `[name,teacherId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_name_teacherId_key" ON "Student"("name", "teacherId");

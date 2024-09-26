/*
  Warnings:

  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_lastName_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_key" ON "Student"("name");

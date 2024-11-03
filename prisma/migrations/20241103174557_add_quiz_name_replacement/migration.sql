/*
  Warnings:

  - Added the required column `grade` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarter` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequenceLetter` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "quarter" INTEGER NOT NULL,
ADD COLUMN     "sequenceLetter" VARCHAR(1) NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

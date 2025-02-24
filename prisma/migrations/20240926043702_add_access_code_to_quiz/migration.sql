/*
  Warnings:

  - Added the required column `accessCode` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "accessCode" VARCHAR(6) NOT NULL;

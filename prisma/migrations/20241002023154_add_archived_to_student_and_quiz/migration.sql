-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

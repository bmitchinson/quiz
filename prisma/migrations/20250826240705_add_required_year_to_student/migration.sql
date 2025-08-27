-- CreateEnum
-- CreateTable
-- Migration file to add required year field to Student table

-- Step 1: Add year column as nullable first
ALTER TABLE "Student" ADD COLUMN "year" INTEGER;

-- Step 2: Update all existing students to have year = 2425
UPDATE "Student" SET "year" = 2425 WHERE "year" IS NULL;

-- Step 3: Make the year column NOT NULL (required)
ALTER TABLE "Student" ALTER COLUMN "year" SET NOT NULL;

-- Step 4: Add the unique constraint for (name, year, teacherId)
CREATE UNIQUE INDEX "Student_name_year_teacherId_key" ON "Student"("name", "year", "teacherId");

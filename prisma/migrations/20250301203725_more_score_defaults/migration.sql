-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "correctAnswers" SET DEFAULT 0,
ALTER COLUMN "answers" SET DEFAULT ARRAY[]::TEXT[];

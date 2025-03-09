-- CreateTable
CREATE TABLE "Drawing" (
    "id" SERIAL NOT NULL,
    "jpgBase64" VARCHAR(409600) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "accessCode" VARCHAR(6) NOT NULL,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drawing_accessCode_studentId_key" ON "Drawing"("accessCode", "studentId");

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_accessCode_fkey" FOREIGN KEY ("accessCode") REFERENCES "Quiz"("accessCode") ON DELETE CASCADE ON UPDATE CASCADE;

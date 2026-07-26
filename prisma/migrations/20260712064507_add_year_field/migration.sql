/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FeeStructure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeeStructure" DROP COLUMN "createdAt",
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "effectiveFrom" SET DEFAULT CURRENT_TIMESTAMP;

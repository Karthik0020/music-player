/*
  Warnings:

  - Added the required column `extractedId` to the `Strem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Strem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Strem" ADD COLUMN     "extractedId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

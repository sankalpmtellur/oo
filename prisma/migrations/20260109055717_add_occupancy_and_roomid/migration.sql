/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Classroom` ADD COLUMN `roomId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Occupancy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroomId` INTEGER NOT NULL,
    `peopleCount` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Classroom_roomId_key` ON `Classroom`(`roomId`);

-- AddForeignKey
ALTER TABLE `Occupancy` ADD CONSTRAINT `Occupancy_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

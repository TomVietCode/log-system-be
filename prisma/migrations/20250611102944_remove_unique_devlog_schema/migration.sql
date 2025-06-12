/*
  Warnings:

  - You are about to drop the `_ProjectMembers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `task_id` to the `dev_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ProjectMembers` DROP FOREIGN KEY `_ProjectMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProjectMembers` DROP FOREIGN KEY `_ProjectMembers_B_fkey`;

-- AlterTable
ALTER TABLE `dev_logs` ADD COLUMN `is_overtime` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `task_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_hour` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `_ProjectMembers`;

-- AddForeignKey
ALTER TABLE `dev_logs` ADD CONSTRAINT `dev_logs_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

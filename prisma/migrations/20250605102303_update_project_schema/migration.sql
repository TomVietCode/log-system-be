/*
  Warnings:

  - You are about to drop the column `projectId` on the `dev_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `dev_logs` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `dev_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `dev_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dev_logs` DROP FOREIGN KEY `dev_logs_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_projectId_fkey`;

-- DropIndex
DROP INDEX `dev_logs_projectId_fkey` ON `dev_logs`;

-- DropIndex
DROP INDEX `tasks_projectId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `dev_logs` DROP COLUMN `projectId`,
    DROP COLUMN `userId`,
    ADD COLUMN `log_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `project_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `projectId`,
    ADD COLUMN `project_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `_ProjectMembers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectMembers_AB_unique`(`A`, `B`),
    INDEX `_ProjectMembers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dev_logs` ADD CONSTRAINT `dev_logs_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dev_logs` ADD CONSTRAINT `dev_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectMembers` ADD CONSTRAINT `_ProjectMembers_A_fkey` FOREIGN KEY (`A`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectMembers` ADD CONSTRAINT `_ProjectMembers_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

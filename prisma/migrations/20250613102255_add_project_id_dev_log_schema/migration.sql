/*
  Warnings:

  - Added the required column `project_id` to the `dev_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dev_logs` ADD COLUMN `project_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `dev_logs` ADD CONSTRAINT `dev_logs_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

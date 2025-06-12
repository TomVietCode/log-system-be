/*
  Warnings:

  - You are about to drop the column `project_id` on the `dev_logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `dev_logs` DROP FOREIGN KEY `dev_logs_project_id_fkey`;

-- DropIndex
DROP INDEX `dev_logs_project_id_fkey` ON `dev_logs`;

-- AlterTable
ALTER TABLE `dev_logs` DROP COLUMN `project_id`;

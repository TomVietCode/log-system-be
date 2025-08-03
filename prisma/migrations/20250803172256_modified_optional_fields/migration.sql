-- AlterTable
ALTER TABLE `project_members` MODIFY `log_date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `white_list_emails` ADD COLUMN `domain` VARCHAR(100) NULL;

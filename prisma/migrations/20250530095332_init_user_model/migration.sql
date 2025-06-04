-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `employee_code` VARCHAR(5) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `dob` DATE NULL,
    `account_number` VARCHAR(50) NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `citizen_id` VARCHAR(50) NOT NULL,
    `personal_email` VARCHAR(255) NOT NULL,
    `liscence_plate` VARCHAR(20) NULL,
    `role` ENUM('ADMIN', 'LEADER', 'HCNS', 'DEV') NOT NULL DEFAULT 'DEV',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

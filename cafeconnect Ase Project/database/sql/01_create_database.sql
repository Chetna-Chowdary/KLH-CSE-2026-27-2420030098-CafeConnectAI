-- =====================================================================
-- CAFE CONNECT — PRODUCTION-GRADE DATABASE INITIALIZATION SCRIPT
-- MySQL 8.0+ Compatible
-- Target Database: cafe_connect_db
-- Character Set: utf8mb4
-- Collation: utf8mb4_0900_ai_ci
-- =====================================================================

-- Set session parameters for safe, repeatable setup
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS `cafe_connect_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE `cafe_connect_db`;

-- Restore session variables
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

-- =====================================================================
-- Verification Note:
-- This script safely initializes the database schema container without
-- dropping existing databases or destroying existing data.
-- =====================================================================

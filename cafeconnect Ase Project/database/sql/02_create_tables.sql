-- =====================================================================
-- CAFE CONNECT — RELATIONAL TABLES DEFINITION SCRIPT
-- MySQL 8.0+ / InnoDB Engine
-- Target Database: cafe_connect_db
-- =====================================================================

USE `cafe_connect_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. IDENTITY, USERS AND ACCESS CONTROL (RBAC)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(64) NOT NULL,
    `email` VARCHAR(128) NULL,
    `password_hash` VARCHAR(255) NULL,
    `full_name` VARCHAR(128) NOT NULL,
    `roll_number` VARCHAR(64) NULL,
    `phone_number` VARCHAR(32) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_guest` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    UNIQUE KEY `uk_users_roll_number` (`roll_number`),
    KEY `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
    `user_id` VARCHAR(64) NOT NULL,
    `role_id` VARCHAR(32) NOT NULL,
    `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `staff_profiles` (
    `user_id` VARCHAR(64) NOT NULL,
    `employee_id` VARCHAR(64) NOT NULL,
    `department` VARCHAR(64) NOT NULL DEFAULT 'Cafeteria Kitchen',
    `shift_timing` VARCHAR(64) NULL,
    `primary_station_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_staff_employee_id` (`employee_id`),
    CONSTRAINT `fk_staff_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
    `id` VARCHAR(128) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `refresh_token_hash` VARCHAR(255) NULL,
    `ip_address` VARCHAR(64) NULL,
    `user_agent` VARCHAR(255) NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_sessions_user_id` (`user_id`),
    KEY `idx_sessions_expires_at` (`expires_at`),
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------
-- 2. KITCHEN STATIONS & PREPARATION QUEUE CONFIGURATION
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `kitchen_stations` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `description` VARCHAR(255) NULL,
    `active_capacity` INT NOT NULL DEFAULT 3 COMMENT 'Maximum concurrent preparation slots',
    `batch_capacity` INT NOT NULL DEFAULT 2 COMMENT 'Maximum items cooked in single batch',
    `avg_preparation_minutes` INT NOT NULL DEFAULT 6,
    `is_paused` BOOLEAN NOT NULL DEFAULT FALSE,
    `active_workers` INT NOT NULL DEFAULT 2,
    `operating_hours` VARCHAR(64) NOT NULL DEFAULT '7:30 AM - 9:30 PM',
    `delay_warning_threshold_mins` INT NOT NULL DEFAULT 15,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `station_workload_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `station_id` VARCHAR(64) NOT NULL,
    `workload_percent` DECIMAL(5,2) NOT NULL,
    `in_queue_count` INT NOT NULL,
    `active_tickets_count` INT NOT NULL,
    `logged_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_station_logs_station_date` (`station_id`, `logged_at`),
    CONSTRAINT `fk_station_logs_station` FOREIGN KEY (`station_id`) REFERENCES `kitchen_stations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------
-- 3. FOOD CATALOGUE, CATEGORIES & ADD-ONS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(512) NULL,
    `display_order` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_slug` (`slug`),
    KEY `idx_categories_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `menu_items` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `description` TEXT NULL,
    `category_id` VARCHAR(64) NOT NULL,
    `sub_category` VARCHAR(64) NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `image_url` VARCHAR(512) NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
    `base_prep_minutes` INT NOT NULL DEFAULT 6,
    `station_id` VARCHAR(64) NOT NULL,
    `is_bestseller` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_chefs_special` BOOLEAN NOT NULL DEFAULT FALSE,
    `rating` DECIMAL(3,2) NOT NULL DEFAULT 4.50,
    `review_count` INT NOT NULL DEFAULT 0,
    `inventory_item_id` VARCHAR(64) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_menu_items_category` (`category_id`),
    KEY `idx_menu_items_station` (`station_id`),
    KEY `idx_menu_items_available` (`is_available`, `is_active`),
    CONSTRAINT `fk_menu_items_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_menu_items_station` FOREIGN KEY (`station_id`) REFERENCES `kitchen_stations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `product_variants` (
    `id` VARCHAR(64) NOT NULL,
    `menu_item_id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `price_delta` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `sku` VARCHAR(64) NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_variants_menu_item` (`menu_item_id`),
    CONSTRAINT `fk_variants_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `add_ons` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `menu_item_add_ons` (
    `menu_item_id` VARCHAR(64) NOT NULL,
    `add_on_id` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`menu_item_id`, `add_on_id`),
    CONSTRAINT `fk_item_addons_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_item_addons_addon` FOREIGN KEY (`add_on_id`) REFERENCES `add_ons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dietary_tags` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `menu_item_dietary_tags` (
    `menu_item_id` VARCHAR(64) NOT NULL,
    `dietary_tag_id` VARCHAR(32) NOT NULL,
    PRIMARY KEY (`menu_item_id`, `dietary_tag_id`),
    CONSTRAINT `fk_item_tags_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_item_tags_tag` FOREIGN KEY (`dietary_tag_id`) REFERENCES `dietary_tags` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `combo_offers` (
    `id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `description` TEXT NULL,
    `combo_price` DECIMAL(10,2) NOT NULL,
    `savings_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `image_url` VARCHAR(512) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `combo_components` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `combo_id` VARCHAR(64) NOT NULL,
    `menu_item_id` VARCHAR(64) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_combo_components_combo` (`combo_id`),
    CONSTRAINT `fk_combo_components_combo` FOREIGN KEY (`combo_id`) REFERENCES `combo_offers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_combo_components_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------
-- 4. INVENTORY, RECIPES, SUPPLIERS AND RESTOCKING
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `suppliers` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `contact_person` VARCHAR(128) NULL,
    `phone` VARCHAR(32) NULL,
    `email` VARCHAR(128) NULL,
    `lead_time_days` INT NOT NULL DEFAULT 2,
    `payment_terms` VARCHAR(128) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `inventory_items` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `sku` VARCHAR(64) NULL,
    `category` ENUM('raw_material', 'packaged_product', 'dairy', 'beverage') NOT NULL DEFAULT 'raw_material',
    `unit` VARCHAR(32) NOT NULL COMMENT 'kg, liters, packets, pieces',
    `current_stock` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `reorder_point` DECIMAL(12,2) NOT NULL DEFAULT 10.00,
    `safety_stock` DECIMAL(12,2) NOT NULL DEFAULT 5.00,
    `avg_daily_usage` DECIMAL(12,2) NOT NULL DEFAULT 5.00,
    `supplier_lead_days` INT NOT NULL DEFAULT 2,
    `suggested_reorder_quantity` DECIMAL(12,2) NOT NULL DEFAULT 20.00,
    `cost_per_unit` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `primary_supplier_id` VARCHAR(64) NULL,
    `last_restocked_date` DATE NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_inventory_sku` (`sku`),
    KEY `idx_inventory_reorder` (`current_stock`, `reorder_point`),
    CONSTRAINT `fk_inventory_supplier` FOREIGN KEY (`primary_supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `recipes` (
    `id` VARCHAR(64) NOT NULL,
    `menu_item_id` VARCHAR(64) NOT NULL,
    `instructions` TEXT NULL,
    `yield_portions` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_recipes_menu_item` (`menu_item_id`),
    CONSTRAINT `fk_recipes_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recipe_id` VARCHAR(64) NOT NULL,
    `inventory_item_id` VARCHAR(64) NOT NULL,
    `quantity_required` DECIMAL(10,3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_recipe_ingredients_recipe` (`recipe_id`),
    CONSTRAINT `fk_recipe_ing_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_recipe_ing_inventory` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `stock_movements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `inventory_item_id` VARCHAR(64) NOT NULL,
    `movement_type` ENUM('order_deduction', 'restock', 'manual_adjustment', 'spoilage') NOT NULL,
    `quantity_delta` DECIMAL(12,2) NOT NULL,
    `balance_after` DECIMAL(12,2) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `reference_order_id` VARCHAR(64) NULL,
    `performed_by_user_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_movements_item_date` (`inventory_item_id`, `created_at`),
    KEY `idx_movements_order` (`reference_order_id`),
    CONSTRAINT `fk_movements_item` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `purchase_orders` (
    `id` VARCHAR(64) NOT NULL,
    `supplier_id` VARCHAR(64) NOT NULL,
    `po_number` VARCHAR(64) NOT NULL,
    `status` ENUM('draft', 'ordered', 'received', 'cancelled') NOT NULL DEFAULT 'draft',
    `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `expected_delivery_date` DATE NULL,
    `actual_delivery_date` DATE NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_po_number` (`po_number`),
    CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `purchase_order_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `purchase_order_id` VARCHAR(64) NOT NULL,
    `inventory_item_id` VARCHAR(64) NOT NULL,
    `quantity_ordered` DECIMAL(12,2) NOT NULL,
    `quantity_received` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `unit_price` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_po_items_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_po_items_inv` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------
-- 5. ORDERS, ITEMS, CUSTOMIZATIONS & PAYMENTS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(64) NOT NULL COMMENT 'e.g. CC2547',
    `pickup_number` VARCHAR(32) NOT NULL COMMENT 'e.g. P-47',
    `user_id` VARCHAR(64) NULL,
    `customer_name` VARCHAR(128) NOT NULL,
    `roll_number` VARCHAR(64) NULL,
    `status` ENUM('placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'placed',
    `subtotal` DECIMAL(10,2) NOT NULL,
    `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `payment_method` ENUM('pay_at_counter', 'upi') NOT NULL DEFAULT 'pay_at_counter',
    `is_paid` BOOLEAN NOT NULL DEFAULT FALSE,
    `estimated_wait_min` INT NOT NULL DEFAULT 8,
    `estimated_wait_max` INT NOT NULL DEFAULT 12,
    `estimated_ready_time` VARCHAR(32) NOT NULL,
    `actual_ready_time` TIMESTAMP NULL,
    `completed_time` TIMESTAMP NULL,
    `special_instructions` VARCHAR(512) NULL,
    `is_delayed` BOOLEAN NOT NULL DEFAULT FALSE,
    `delay_reason` VARCHAR(255) NULL,
    `idempotency_key` VARCHAR(128) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_orders_idempotency` (`idempotency_key`),
    KEY `idx_orders_status_created` (`status`, `created_at`),
    KEY `idx_orders_user` (`user_id`),
    KEY `idx_orders_pickup` (`pickup_number`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
    `id` VARCHAR(64) NOT NULL,
    `order_id` VARCHAR(64) NOT NULL,
    `menu_item_id` VARCHAR(64) NOT NULL,
    `historical_item_name` VARCHAR(128) NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `station_id` VARCHAR(64) NOT NULL,
    `prep_status` ENUM('pending', 'preparing', 'ready') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (`id`),
    KEY `idx_order_items_order` (`order_id`),
    KEY `idx_order_items_station` (`station_id`, `prep_status`),
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_order_items_station` FOREIGN KEY (`station_id`) REFERENCES `kitchen_stations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `order_item_customizations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_item_id` VARCHAR(64) NOT NULL,
    `customization_type` VARCHAR(64) NOT NULL COMMENT 'chutney, spice, addon, variant',
    `name` VARCHAR(128) NOT NULL,
    `price_charged` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`id`),
    KEY `idx_item_customizations_item` (`order_item_id`),
    CONSTRAINT `fk_item_customizations_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(64) NOT NULL,
    `order_id` VARCHAR(64) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `payment_method` ENUM('cash', 'counter_card', 'counter_upi', 'online_upi') NOT NULL,
    `transaction_reference` VARCHAR(128) NULL,
    `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'completed',
    `received_by_user_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_payments_order` (`order_id`),
    CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `order_status_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(64) NOT NULL,
    `status` ENUM('placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled') NOT NULL,
    `note` VARCHAR(255) NULL,
    `changed_by_user_id` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_status_hist_order` (`order_id`, `created_at`),
    CONSTRAINT `fk_status_hist_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `order_cancellations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(64) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `cancelled_by_user_id` VARCHAR(64) NULL,
    `cancelled_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_cancellation_order` (`order_id`),
    CONSTRAINT `fk_cancellations_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------
-- 6. OPERATIONAL ALERTS & AUDIT LOGS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `operational_alerts` (
    `id` VARCHAR(64) NOT NULL,
    `alert_type` ENUM('low_stock', 'critical_stock', 'station_overload', 'long_wait', 'delayed_order', 'station_outage') NOT NULL,
    `severity` ENUM('info', 'warning', 'critical') NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `message` TEXT NOT NULL,
    `target_id` VARCHAR(64) NULL,
    `suggested_action` VARCHAR(255) NULL,
    `is_acknowledged` BOOLEAN NOT NULL DEFAULT FALSE,
    `acknowledged_by_user_id` VARCHAR(64) NULL,
    `acknowledged_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_alerts_severity_ack` (`severity`, `is_acknowledged`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `application_settings` (
    `setting_key` VARCHAR(64) NOT NULL,
    `setting_value` TEXT NOT NULL,
    `description` VARCHAR(255) NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(64) NULL,
    `action` VARCHAR(64) NOT NULL,
    `entity_type` VARCHAR(64) NOT NULL,
    `entity_id` VARCHAR(64) NOT NULL,
    `previous_value` JSON NULL,
    `new_value` JSON NULL,
    `ip_address` VARCHAR(64) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_audit_entity` (`entity_type`, `entity_id`),
    KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;

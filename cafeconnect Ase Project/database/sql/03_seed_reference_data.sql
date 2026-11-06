-- =====================================================================
-- CAFE CONNECT — REFERENCE DATA SEED SCRIPT
-- MySQL 8.0+ / Idempotent Reference Data
-- Target Database: cafe_connect_db
-- =====================================================================

USE `cafe_connect_db`;

-- 1. ROLES
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('ROLE_STUDENT', 'Student / Campus Customer', 'Campus student or guest placing food orders'),
('ROLE_KITCHEN_STAFF', 'Kitchen Line Chef', 'Kitchen station operator managing queues, tickets, and prep timers'),
('ROLE_ADMIN', 'Cafeteria Administrator', 'Cafeteria manager overseeing inventory, pricing, analytics, and staff'),
('ROLE_SUPER_ADMIN', 'System Operations Lead', 'Platform super administrator with unrestricted governance')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- 2. DIETARY TAGS
INSERT INTO `dietary_tags` (`id`, `name`) VALUES
('veg', 'Vegetarian (Green Dot)'),
('non-veg', 'Non-Vegetarian'),
('vegan', 'Plant-Based 100% Vegan'),
('gluten-free', 'Gluten Free Certified')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. KITCHEN STATIONS
INSERT INTO `kitchen_stations` 
(`id`, `name`, `description`, `active_capacity`, `batch_capacity`, `avg_preparation_minutes`, `is_paused`, `active_workers`, `operating_hours`, `delay_warning_threshold_mins`) 
VALUES
('dosa_breakfast', 'Dosa & South Indian Station', 'Commercial flat griddles for fermented dosas, idli steamers and vada fryers', 3, 3, 8, FALSE, 2, '7:30 AM - 9:00 PM', 15),
('hot_meals', 'Hot Meals & Fast Food Station', 'Woks, induction ranges for fried rice, hakka noodles, rolls and pav bhaji', 3, 2, 9, FALSE, 2, '11:00 AM - 9:00 PM', 18),
('snacks_frying', 'Snacks & Sandwich Station', 'Deep fryers, commercial sandwich contact grills and samosa warmers', 3, 2, 6, FALSE, 1, '9:00 AM - 9:30 PM', 12),
('beverages', 'Beverages & Filter Coffee Station', 'South Indian decoction drippers, espresso machine, milk steamers, blenders', 4, 4, 3, FALSE, 2, '7:30 AM - 10:00 PM', 8),
('packaged_pickup', 'Packaged Goods & Quick Pick Counter', 'Confectionery racks, display chillers for instant barcode scanning & handoff', 6, 4, 1, FALSE, 1, '7:30 AM - 10:30 PM', 5)
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `active_capacity` = VALUES(`active_capacity`),
    `avg_preparation_minutes` = VALUES(`avg_preparation_minutes`);

-- 4. FOOD CATEGORIES
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `display_order`, `is_active`) VALUES
('south_indian', 'South Indian', 'south-indian', 'Authentic Flavours. Always a Favourite.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', 1, TRUE),
('meals_fastfood', 'North Indian & Meals', 'meals-fastfood', 'Hearty fried rice, noodles, rolls & wholesome curries', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', 2, TRUE),
('burgers_sandwiches', 'Burgers & Sandwiches', 'burgers-sandwiches', 'Grilled sandwiches, artisan burgers & fresh rolls', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 3, TRUE),
('hot_snacks', 'Snacks', 'hot-snacks', 'Crispy samosas, loaded fries, puffs and fritters', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 4, TRUE),
('packaged_snacks', 'Packaged Snacks', 'packaged-snacks', 'Chips, chocolates, cookies & grab-and-go treats', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80', 5, TRUE),
('hot_beverages', 'Tea & Coffee', 'tea-coffee', 'Fresh filter coffee, masala chai, cappuccinos', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 6, TRUE),
('cold_drinks', 'Beverages', 'beverages', 'Cold coffees, milkshakes, juices & refreshments', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', 7, TRUE),
('desserts_bakery', 'Desserts', 'desserts-bakery', 'Brownies, muffins, donuts and pastries', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 8, TRUE),
('combos', 'Combos & Deals', 'combos', 'Student favorite hunger buster bundles', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 9, TRUE)
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `description` = VALUES(`description`),
    `display_order` = VALUES(`display_order`);

-- 5. APPLICATION SETTINGS
INSERT INTO `application_settings` (`setting_key`, `setting_value`, `description`) VALUES
('cafeteria_name', 'Cafe Connect', 'Primary brand display name'),
('cafeteria_operating_status', 'OPEN', 'Global operating status: OPEN, CLOSED, MAINTENANCE'),
('queue_buffer_minutes', '2', 'Estimated uncertainty buffer added to kitchen wait time'),
('allow_guest_ordering', 'true', 'Enable students to browse and order without mandatory login registration'),
('pickup_counter_label', 'Counter A & B (Student Center)', 'Counter collection point name'),
('max_cart_item_limit', '15', 'Maximum food items allowed in a single checkout order')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

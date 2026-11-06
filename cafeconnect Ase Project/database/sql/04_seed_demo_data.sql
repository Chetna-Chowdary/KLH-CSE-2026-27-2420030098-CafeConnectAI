-- =====================================================================
-- CAFE CONNECT — DEMO DATA SEED SCRIPT
-- MySQL 8.0+ / Idempotent Realistic Sample Catalogue & Orders
-- Target Database: cafe_connect_db
-- =====================================================================

USE `cafe_connect_db`;

-- 1. DEMO USERS & ROLES
-- Passwords represented as standard BCrypt format hash tokens for Spring Security
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `roll_number`, `phone_number`, `is_active`, `is_guest`) VALUES
('usr_admin_01', 'admin@cafeconnect.edu', '$2a$12$e68Zk7e/n45i1P0pP3yD.OU45nQv6u8R/sWz8I3WJ2E3D.91i3W1.', 'Cafeteria Manager', 'FAC-ADMIN-01', '+91 98765 43210', TRUE, FALSE),
('usr_kitchen_01', 'kitchen@cafeconnect.edu', '$2a$12$V.oGZ6bF4FfO.4vj0w2c6uYn4P.o3K5E7b4r9p5j6s2r8d3w1e5q.', 'Chef Ramesh Kumar', 'EMP-KITCH-04', '+91 98765 43211', TRUE, FALSE),
('usr_student_01', 'chaitanya@student.campus.edu', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Chaitanya', 'CS23B104', '+91 98765 43212', TRUE, FALSE)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
('usr_admin_01', 'ROLE_ADMIN'),
('usr_kitchen_01', 'ROLE_KITCHEN_STAFF'),
('usr_student_01', 'ROLE_STUDENT')
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

INSERT INTO `staff_profiles` (`user_id`, `employee_id`, `department`, `shift_timing`, `primary_station_id`) VALUES
('usr_kitchen_01', 'EMP-KITCH-04', 'Hot Kitchen Line', 'Morning: 07:00 AM - 03:30 PM', 'dosa_breakfast')
ON DUPLICATE KEY UPDATE `shift_timing` = VALUES(`shift_timing`);

-- 2. SUPPLIERS
INSERT INTO `suppliers` (`id`, `name`, `contact_person`, `phone`, `email`, `lead_time_days`) VALUES
('sup_nandini', 'Nandini Karnataka Co-op Milk Federation', 'Mr. S. Gowda', '+91 80 2839 0000', 'dairy@nandini.coop', 1),
('sup_itc', 'ITC Campus Wholesale Distribution', 'Vikram Mehra', '+91 80 2222 1111', 'orders@itcdist.com', 3),
('sup_veggie', 'Green Field Campus Fresh Produce Ltd', 'Murugan K', '+91 94440 12345', 'fresh@greenfield.in', 1),
('sup_nestle', 'Nestle India Vending & Retail Depot', 'Anand Joshi', '+91 80 4455 6677', 'supply@nestle.in', 2)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. INVENTORY ITEMS (Packaged Goods & Raw Kitchen Ingredients)
INSERT INTO `inventory_items` 
(`id`, `name`, `sku`, `category`, `unit`, `current_stock`, `reorder_point`, `safety_stock`, `avg_daily_usage`, `supplier_lead_days`, `suggested_reorder_quantity`, `cost_per_unit`, `primary_supplier_id`, `last_restocked_date`) 
VALUES
('inv_dosa_batter', 'Fermented Dosa Batter', 'SKU-RAW-BATTER', 'raw_material', 'kg', 18.50, 15.00, 8.00, 25.00, 1, 30.00, 45.00, 'sup_veggie', '2026-10-22'),
('inv_potatoes', 'Fresh Potatoes (Masala Grade)', 'SKU-RAW-POTATO', 'raw_material', 'kg', 24.00, 20.00, 10.00, 18.00, 1, 40.00, 22.00, 'sup_veggie', '2026-10-21'),
('inv_fresh_milk', 'Full Cream Cow Milk', 'SKU-DAIRY-MILK', 'dairy', 'liters', 32.00, 25.00, 12.00, 45.00, 1, 50.00, 58.00, 'sup_nandini', '2026-10-23'),
('inv_coffee_powder', 'South Indian Filter Coffee Blend', 'SKU-BEV-COFFEE', 'raw_material', 'kg', 6.20, 4.00, 2.00, 3.50, 2, 10.00, 420.00, 'sup_itc', '2026-10-18'),
('inv_cheese_slices', 'Amul Cheese Slices (Pack of 50)', 'SKU-CHZ-002', 'dairy', 'packets', 2.00, 5.00, 3.00, 4.00, 2, 10.00, 340.00, 'sup_nandini', '2026-10-15'),
('inv_bread_loaves', 'Sandwich Bread Jumbo Loaf', 'SKU-RAW-BREAD', 'raw_material', 'pieces', 14.00, 10.00, 5.00, 12.00, 1, 20.00, 35.00, 'sup_itc', '2026-10-23'),
('inv_lays_chips', 'Lays Magic Masala 50g', 'SKU-LAYS-BLU', 'packaged_product', 'packets', 48.00, 30.00, 15.00, 25.00, 3, 60.00, 16.00, 'sup_itc', '2026-10-20'),
('inv_bingo_chips', 'Bingo Mad Angles Achaari 40g', 'SKU-BNG-ACH', 'packaged_product', 'packets', 28.00, 20.00, 10.00, 14.00, 3, 40.00, 16.00, 'sup_itc', '2026-10-20'),
('inv_kurkure', 'Kurkure Masala Munch 45g', 'SKU-KK-MUNCH', 'packaged_product', 'packets', 35.00, 25.00, 12.00, 18.00, 3, 50.00, 16.00, 'sup_itc', '2026-10-20'),
('inv_dairy_milk', 'Cadbury Dairy Milk 24g', 'SKU-CDM-24G', 'packaged_product', 'pieces', 3.00, 25.00, 15.00, 20.00, 2, 50.00, 16.00, 'sup_itc', '2026-10-18'),
('inv_kitkat', 'Nestle KitKat 4-Finger', 'SKU-NK-4F', 'packaged_product', 'pieces', 32.00, 20.00, 10.00, 15.00, 2, 40.00, 24.00, 'sup_nestle', '2026-10-21'),
('inv_5star', 'Cadbury 5 Star 22g', 'SKU-5ST-22G', 'packaged_product', 'pieces', 22.00, 15.00, 8.00, 12.00, 2, 30.00, 16.00, 'sup_itc', '2026-10-19'),
('inv_water_bottle', 'Aquafina Mineral Water 500ml', 'SKU-AQ-500', 'packaged_product', 'pieces', 85.00, 40.00, 20.00, 50.00, 1, 100.00, 12.00, 'sup_itc', '2026-10-22')
ON DUPLICATE KEY UPDATE 
    `current_stock` = VALUES(`current_stock`),
    `reorder_point` = VALUES(`reorder_point`);

-- 4. MENU ITEMS
INSERT INTO `menu_items` 
(`id`, `name`, `description`, `category_id`, `sub_category`, `price`, `image_url`, `is_available`, `base_prep_minutes`, `station_id`, `is_bestseller`, `is_chefs_special`, `rating`, `review_count`, `inventory_item_id`, `is_active`) 
VALUES
('item_plain_dosa', 'Plain Dosa', 'Golden crispy thin crepe made with fermented lentil & rice batter, served with fresh coconut chutney & piping hot sambar.', 'south_indian', 'Dosa', 40.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', TRUE, 6, 'dosa_breakfast', FALSE, FALSE, 4.60, 840, NULL, TRUE),
('item_masala_dosa', 'Masala Dosa', 'Crispy rice crepe filled with spiced potato masala, served with freshly grated coconut chutney, tomato chutney & homestyle sambar.', 'south_indian', 'Dosa', 60.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, 8, 'dosa_breakfast', TRUE, TRUE, 4.70, 1240, NULL, TRUE),
('item_mysore_masala_dosa', 'Mysore Masala Dosa', 'Crisp crepe lined with signature fiery Mysore red garlic chili paste, packed with spiced potato filling & butter.', 'south_indian', 'Dosa', 70.00, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', TRUE, 9, 'dosa_breakfast', FALSE, FALSE, 4.80, 910, NULL, TRUE),
('item_idli_2pcs', 'Idli (2 pcs)', 'Pillowy soft steamed rice cakes, gentle on the stomach, served with piping hot dal sambar and fresh coconut dip.', 'south_indian', 'Idli', 30.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, 4, 'dosa_breakfast', TRUE, FALSE, 4.50, 650, NULL, TRUE),
('item_medu_vada_2pcs', 'Medu Vada (2 pcs)', 'Golden crunchy black-gram donuts infused with crushed peppercorns, curry leaves, ginger & green chilies.', 'south_indian', 'Vada', 35.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', TRUE, 4, 'dosa_breakfast', FALSE, FALSE, 4.70, 780, NULL, TRUE),
('item_podi_idli', 'Podi Idli', 'Bite-sized soft idlis tossed generously in aromatic roasted gun powder (milagai podi) and pure melted ghee.', 'south_indian', 'Idli', 45.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, 5, 'dosa_breakfast', FALSE, FALSE, 4.90, 520, NULL, TRUE),
('item_uttapam', 'Uttapam', 'Thick savoury fermented pancake topped with caramelized red onions, juicy tomatoes, and fresh coriander leaves.', 'south_indian', 'Uttapam', 55.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, 8, 'dosa_breakfast', FALSE, FALSE, 4.40, 310, NULL, TRUE),

('item_veg_fried_rice', 'Veg Fried Rice', 'Fragrant wok-tossed basmati rice with crunchy seasonal veggies, spring onion, and aromatic Asian seasonings.', 'meals_fastfood', NULL, 80.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', TRUE, 9, 'hot_meals', TRUE, FALSE, 4.60, 880, NULL, TRUE),
('item_veg_noodles', 'Veg Hakka Noodles', 'Classic Kolkata street-style wok tossed noodles with shredded cabbage, bell peppers, carrots, and light soy glaze.', 'meals_fastfood', NULL, 70.00, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', TRUE, 8, 'hot_meals', FALSE, FALSE, 4.50, 620, NULL, TRUE),
('item_paneer_roll', 'Paneer Kathi Roll', 'Soft flaky paratha wrapped with marinated chargrilled paneer tikka cubes, spiced pickled onions, and mint yogurt dip.', 'meals_fastfood', NULL, 80.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', TRUE, 8, 'hot_meals', TRUE, FALSE, 4.80, 940, NULL, TRUE),
('item_pav_bhaji', 'Butter Pav Bhaji', 'Rich spiced mashed vegetable gravy simmered in butter on a tawa, served with two hot toasted butter pavs and chopped onions.', 'meals_fastfood', NULL, 70.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80', TRUE, 7, 'hot_meals', FALSE, TRUE, 4.70, 1100, NULL, TRUE),

('item_veg_sandwich', 'Veg Club Sandwich', 'Triple layer jumbo bread filled with crisp cucumber, ripe tomatoes, potato slices, spiced mint chutney, and fresh butter.', 'burgers_sandwiches', NULL, 50.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', TRUE, 5, 'snacks_frying', TRUE, FALSE, 4.60, 790, NULL, TRUE),
('item_grilled_cheese_sandwich', 'Grilled Cheese Sandwich', 'Golden grilled sandwich oozing with melted mozzarella & cheddar, sprinkled with oregano and chili flakes.', 'burgers_sandwiches', NULL, 65.00, 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80', TRUE, 6, 'snacks_frying', FALSE, FALSE, 4.70, 680, NULL, TRUE),
('item_veg_burger', 'Crispy Veg Burger', 'Golden vegetable patty served in toasted sesame bun with crisp iceberg lettuce, sliced tomatoes, and creamy house mayo.', 'burgers_sandwiches', NULL, 70.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', TRUE, 7, 'snacks_frying', TRUE, FALSE, 4.70, 950, NULL, TRUE),

('item_samosa', 'Punjabi Samosa (1 pc)', 'Flaky deep-fried triangle pastry stuffed with cumin spiced potato and green peas, served with sweet tamarind & green dip.', 'hot_snacks', NULL, 20.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, 3, 'snacks_frying', TRUE, FALSE, 4.80, 1600, NULL, TRUE),
('item_french_fries', 'Salted French Fries', 'Classic crisp golden potato batons tossed in sea salt. Served hot with tomato ketchup.', 'hot_snacks', NULL, 60.00, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', TRUE, 6, 'snacks_frying', FALSE, FALSE, 4.50, 820, NULL, TRUE),

('item_lays_classic', 'Lays Potato Chips', 'Crispy wafer-thin potato chips. Available in India’s Magic Masala or Classic Salted.', 'packaged_snacks', NULL, 20.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', TRUE, 1, 'packaged_pickup', TRUE, FALSE, 4.80, 1400, 'inv_lays_chips', TRUE),
('item_dairy_milk', 'Cadbury Dairy Milk', 'Smooth, creamy melt-in-mouth milk chocolate bar. Perfect quick study booster.', 'packaged_snacks', NULL, 20.00, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80', TRUE, 1, 'packaged_pickup', TRUE, FALSE, 4.90, 2200, 'inv_dairy_milk', TRUE),
('item_kitkat', 'Nestle KitKat (4 Finger)', 'Crisp wafer fingers enrobed in smooth milk chocolate. Have a break, have a KitKat.', 'packaged_snacks', NULL, 30.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', TRUE, 1, 'packaged_pickup', FALSE, FALSE, 4.80, 1100, 'inv_kitkat', TRUE),

('item_masala_chai', 'Desi Masala Chai', 'Aromatic strong Assam tea brewed with crushed cardamom, ginger, cloves, cinnamon and whole cow milk.', 'hot_beverages', NULL, 15.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', TRUE, 3, 'beverages', TRUE, FALSE, 4.90, 2800, NULL, TRUE),
('item_filter_coffee', 'Authentic Filter Coffee', 'South Indian brass-filtered decoction blended with frothy hot milk, served piping hot in traditional tumbler.', 'hot_beverages', NULL, 25.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', TRUE, 3, 'beverages', TRUE, FALSE, 4.80, 1950, NULL, TRUE),
('item_cold_coffee', 'Signature Cold Coffee', 'Thick, creamy blended iced coffee with espresso, milk, and chocolate syrup drizzle.', 'cold_drinks', NULL, 60.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', TRUE, 4, 'beverages', TRUE, FALSE, 4.80, 1350, NULL, TRUE)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`);

-- 5. ADD-ONS
INSERT INTO `add_ons` (`id`, `name`, `price`, `is_available`) VALUES
('addon_extra_sambar', 'Extra Sambar', 10.00, TRUE),
('addon_extra_aloo', 'Extra Potato Masala', 15.00, TRUE),
('addon_cheese', 'Cheese Slice Upgrade', 15.00, TRUE),
('addon_butter', 'Extra Amul Butter', 15.00, TRUE),
('addon_ghee_roast', 'Ghee Roast Upgrade', 15.00, TRUE)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`);

INSERT INTO `menu_item_add_ons` (`menu_item_id`, `add_on_id`) VALUES
('item_masala_dosa', 'addon_extra_sambar'),
('item_masala_dosa', 'addon_extra_aloo'),
('item_masala_dosa', 'addon_cheese'),
('item_plain_dosa', 'addon_extra_sambar'),
('item_plain_dosa', 'addon_ghee_roast'),
('item_veg_sandwich', 'addon_cheese')
ON DUPLICATE KEY UPDATE `add_on_id` = VALUES(`add_on_id`);

-- 6. RECIPES FOR LIVE INVENTORY CONSUMPTION
INSERT INTO `recipes` (`id`, `menu_item_id`, `instructions`, `yield_portions`) VALUES
('rec_masala_dosa', 'item_masala_dosa', 'Lentil batter poured on hot griddle, potato sabzi folded in center', 1),
('rec_plain_dosa', 'item_plain_dosa', 'Thin crisp crepe rolled without filling', 1),
('rec_filter_coffee', 'item_filter_coffee', 'Steam milk mixed with brass drip coffee decoction', 1),
('rec_veg_sandwich', 'item_veg_sandwich', 'Bread slices buttered, cucumber tomato layered, toasted', 1)
ON DUPLICATE KEY UPDATE `instructions` = VALUES(`instructions`);

INSERT INTO `recipe_ingredients` (`recipe_id`, `inventory_item_id`, `quantity_required`) VALUES
('rec_masala_dosa', 'inv_dosa_batter', 0.150),
('rec_masala_dosa', 'inv_potatoes', 0.100),
('rec_plain_dosa', 'inv_dosa_batter', 0.150),
('rec_filter_coffee', 'inv_fresh_milk', 0.150),
('rec_veg_sandwich', 'inv_bread_loaves', 1.000)
ON DUPLICATE KEY UPDATE `quantity_required` = VALUES(`quantity_required`);

-- 7. INITIAL DEMO ORDERS MATCHING REFERENCE SCREEN 8 & 9
INSERT INTO `orders` 
(`id`, `pickup_number`, `user_id`, `customer_name`, `roll_number`, `status`, `subtotal`, `tax`, `total_amount`, `payment_method`, `is_paid`, `estimated_wait_min`, `estimated_wait_max`, `estimated_ready_time`, `special_instructions`, `idempotency_key`) 
VALUES
('CC2547', 'P-47', 'usr_student_01', 'Chaitanya', 'CS23B104', 'preparing', 140.00, 0.00, 140.00, 'pay_at_counter', FALSE, 12, 18, '10:48 AM', 'Less spicy chutney please', 'IDEMP-CC2547-01'),
('CC2548', 'P-48', NULL, 'Aarav Patel', 'EC22B019', 'placed', 50.00, 0.00, 50.00, 'upi', TRUE, 8, 12, '10:44 AM', NULL, 'IDEMP-CC2548-02'),
('CC2549', 'P-49', NULL, 'Sneha Rao', 'ME21B088', 'preparing', 50.00, 0.00, 50.00, 'pay_at_counter', FALSE, 10, 15, '10:49 AM', 'Well grilled', 'IDEMP-CC2549-03'),
('CC2550', 'P-50', NULL, 'Vikram Singh', 'EE24B012', 'preparing', 80.00, 0.00, 80.00, 'pay_at_counter', FALSE, 15, 20, '10:55 AM', NULL, 'IDEMP-CC2550-04'),
('CC2551', 'P-51', NULL, 'Ananya Sharma', 'BT23B045', 'placed', 65.00, 0.00, 65.00, 'upi', TRUE, 5, 8, '10:47 AM', NULL, 'IDEMP-CC2551-05')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `historical_item_name`, `unit_price`, `quantity`, `subtotal`, `station_id`, `prep_status`) VALUES
('oi_2547_1', 'CC2547', 'item_masala_dosa', 'Masala Dosa', 60.00, 1, 60.00, 'dosa_breakfast', 'preparing'),
('oi_2547_2', 'CC2547', 'item_filter_coffee', 'Filter Coffee', 30.00, 1, 30.00, 'beverages', 'ready'),
('oi_2547_3', 'CC2547', 'item_veg_sandwich', 'Veg Sandwich', 50.00, 1, 50.00, 'snacks_frying', 'preparing'),
('oi_2548_1', 'CC2548', 'item_filter_coffee', 'Filter Coffee', 25.00, 2, 50.00, 'beverages', 'pending'),
('oi_2549_1', 'CC2549', 'item_veg_sandwich', 'Veg Sandwich', 50.00, 1, 50.00, 'snacks_frying', 'preparing'),
('oi_2550_1', 'CC2550', 'item_plain_dosa', 'Plain Dosa', 40.00, 2, 80.00, 'dosa_breakfast', 'preparing'),
('oi_2551_1', 'CC2551', 'item_idli_2pcs', 'Idli (2 pcs)', 30.00, 1, 30.00, 'dosa_breakfast', 'pending'),
('oi_2551_2', 'CC2551', 'item_medu_vada_2pcs', 'Medu Vada (2 pcs)', 35.00, 1, 35.00, 'dosa_breakfast', 'pending')
ON DUPLICATE KEY UPDATE `prep_status` = VALUES(`prep_status`);

INSERT INTO `order_status_history` (`order_id`, `status`, `note`) VALUES
('CC2547', 'placed', 'Order placed via Web App'),
('CC2547', 'accepted', 'Accepted by Dosa Station'),
('CC2547', 'preparing', 'Masala Dosa on griddle');

-- =====================================================================
-- CAFE CONNECT — PERFORMANCE INDEXES & CONSTRAINTS AUDIT SCRIPT
-- MySQL 8.0+
-- Target Database: cafe_connect_db
-- =====================================================================

USE `cafe_connect_db`;

-- Procedure to safely add index if it does not already exist
DROP PROCEDURE IF EXISTS `AddIndexIfNotExists`;
DELIMITER $$
CREATE PROCEDURE `AddIndexIfNotExists`(
    IN p_table VARCHAR(64),
    IN p_index VARCHAR(64),
    IN p_columns VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = p_table
          AND index_name = p_index
    ) THEN
        SET @sql = CONCAT('CREATE INDEX `', p_index, '` ON `', p_table, '` (', p_columns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

-- 1. Orders Optimization for Live Kitchen Queue & Status Queries
CALL AddIndexIfNotExists('orders', 'idx_perf_orders_active_queue', 'status, created_at, id');
CALL AddIndexIfNotExists('orders', 'idx_perf_orders_analytics_date', 'created_at, total_amount, status');

-- 2. Order Items per Kitchen Station Filter (Screen 9 Queue Tabs)
CALL AddIndexIfNotExists('order_items', 'idx_perf_order_items_station_prep', 'station_id, prep_status, order_id');

-- 3. Stock Level & Automated Reorder Alert Check (Runs on every order completion)
CALL AddIndexIfNotExists('inventory_items', 'idx_perf_inv_stock_reorder', 'current_stock, reorder_point, safety_stock');

-- 4. Fast SKU Barcode Lookup for Packaged Snacks Counter
CALL AddIndexIfNotExists('inventory_items', 'idx_perf_inv_sku_lookup', 'sku');

-- 5. Station Workload Logs Time-Series Aggregation
CALL AddIndexIfNotExists('station_workload_logs', 'idx_perf_station_workload_ts', 'station_id, logged_at DESC');

-- 6. Menu Items Active Category Browsing
CALL AddIndexIfNotExists('menu_items', 'idx_perf_menu_active_cat', 'category_id, is_active, is_available, display_order ASC' );

DROP PROCEDURE IF EXISTS `AddIndexIfNotExists`;

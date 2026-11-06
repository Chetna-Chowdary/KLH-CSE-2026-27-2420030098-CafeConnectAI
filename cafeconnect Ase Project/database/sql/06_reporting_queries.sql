-- =====================================================================
-- CAFE CONNECT — OPERATIONAL & BUSINESS REPORTING QUERIES
-- MySQL 8.0+
-- NOTE: FOR FILE GENERATION & DOCUMENTATION PURPOSES ONLY. DO NOT EXECUTE.
-- =====================================================================

USE `cafe_connect_db`;

-- ---------------------------------------------------------------------
-- QUERY 1: Hourly Order Volume and Peak Demand Window (Screen 10 Area Chart)
-- ---------------------------------------------------------------------
SELECT 
    DATE_FORMAT(o.created_at, '%l %p') AS order_hour,
    HOUR(o.created_at) AS hour_24,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS hourly_revenue,
    ROUND(AVG(o.total_amount), 2) AS hourly_aov
FROM orders o
WHERE DATE(o.created_at) = CURRENT_DATE
  AND o.status != 'cancelled'
GROUP BY HOUR(o.created_at), DATE_FORMAT(o.created_at, '%l %p')
ORDER BY hour_24 ASC;

-- ---------------------------------------------------------------------
-- QUERY 2: Daily Executive Performance Indicators (KPI Cards)
-- ---------------------------------------------------------------------
SELECT 
    COUNT(o.id) AS total_orders_today,
    SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
    COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total_amount ELSE 0 END), 0.00) AS total_gross_revenue,
    ROUND(COALESCE(AVG(CASE WHEN o.status != 'cancelled' THEN o.total_amount ELSE NULL END), 0.00), 2) AS average_order_value,
    SUM(CASE WHEN o.is_delayed = TRUE THEN 1 ELSE 0 END) AS delayed_orders_count
FROM orders o
WHERE DATE(o.created_at) = CURRENT_DATE;

-- ---------------------------------------------------------------------
-- QUERY 3: Category Distribution & Contribution (Screen 10 Donut Chart)
-- ---------------------------------------------------------------------
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(oi.id) AS items_sold_count,
    COALESCE(SUM(oi.subtotal), 0.00) AS total_category_sales,
    ROUND(
        (SUM(oi.subtotal) / (SELECT SUM(subtotal) FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE status != 'cancelled' AND DATE(created_at) = CURRENT_DATE))) * 100, 
        1
    ) AS percentage_share
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN categories c ON mi.category_id = c.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
  AND DATE(o.created_at) = CURRENT_DATE
GROUP BY c.id, c.name
ORDER BY total_category_sales DESC;

-- ---------------------------------------------------------------------
-- QUERY 4: Top 10 Best-Selling Menu Items
-- ---------------------------------------------------------------------
SELECT 
    mi.id AS product_id,
    oi.historical_item_name AS product_name,
    c.name AS category_name,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.subtotal) AS gross_sales_amount,
    ROUND(AVG(oi.unit_price), 2) AS avg_selling_price
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN categories c ON mi.category_id = c.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
  AND o.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY mi.id, oi.historical_item_name, c.name
ORDER BY total_units_sold DESC
LIMIT 10;

-- ---------------------------------------------------------------------
-- QUERY 5: Kitchen Station Workload & Queue Backlog (Screen 9 Line Status)
-- ---------------------------------------------------------------------
SELECT 
    ks.id AS station_id,
    ks.name AS station_name,
    ks.active_capacity,
    ks.is_paused,
    COUNT(oi.id) AS pending_tickets_in_queue,
    COALESCE(SUM(oi.quantity), 0) AS total_items_to_cook,
    ROUND(COALESCE(SUM(oi.quantity) / NULLIF(ks.active_capacity, 0) * ks.avg_preparation_minutes, 0), 1) AS estimated_backlog_minutes
FROM kitchen_stations ks
LEFT JOIN order_items oi ON ks.id = oi.station_id AND oi.prep_status IN ('pending', 'preparing')
LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('placed', 'accepted', 'preparing')
GROUP BY ks.id, ks.name, ks.active_capacity, ks.is_paused, ks.avg_preparation_minutes
ORDER BY total_items_to_cook DESC;

-- ---------------------------------------------------------------------
-- QUERY 6: Automated Reorder Recommendations & Predicted Shortages
-- ---------------------------------------------------------------------
SELECT 
    i.id AS inventory_id,
    i.name AS item_name,
    i.sku,
    i.unit,
    i.current_stock,
    i.reorder_point,
    i.safety_stock,
    i.avg_daily_usage,
    i.supplier_lead_days,
    -- Baseline calculation validation
    ROUND((i.avg_daily_usage * i.supplier_lead_days) + i.safety_stock, 2) AS calculated_reorder_point,
    i.suggested_reorder_quantity,
    s.name AS supplier_name,
    s.phone AS supplier_contact,
    CASE 
        WHEN i.current_stock <= 0 THEN 'OUT_OF_STOCK'
        WHEN i.current_stock <= i.safety_stock THEN 'CRITICAL'
        WHEN i.current_stock <= i.reorder_point THEN 'REORDER_NOW'
        ELSE 'OPTIMAL'
    END AS stock_health_status
FROM inventory_items i
LEFT JOIN suppliers s ON i.primary_supplier_id = s.id
WHERE i.current_stock <= i.reorder_point
ORDER BY (i.current_stock / NULLIF(i.reorder_point, 0)) ASC;

-- ---------------------------------------------------------------------
-- QUERY 7: Order Fulfillment Latency & Kitchen Delay Rate
-- ---------------------------------------------------------------------
SELECT 
    DATE(created_at) AS business_date,
    COUNT(id) AS total_fulfilled_orders,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, actual_ready_time)), 1) AS avg_actual_fulfillment_mins,
    ROUND(AVG(estimated_wait_max), 1) AS avg_predicted_fulfillment_mins,
    ROUND(
        (SUM(CASE WHEN is_delayed = TRUE THEN 1 ELSE 0 END) / COUNT(id)) * 100, 
        2
    ) AS percentage_delayed_orders
FROM orders
WHERE status = 'completed'
  AND actual_ready_time IS NOT NULL
  AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY business_date DESC;

-- ---------------------------------------------------------------------
-- QUERY 8: Recipe Ingredient Deduction Audit for a Completed Order
-- ---------------------------------------------------------------------
SELECT 
    o.id AS order_id,
    oi.historical_item_name AS food_item,
    oi.quantity AS portions_ordered,
    ii.name AS ingredient_consumed,
    ROUND(ri.quantity_required * oi.quantity, 3) AS total_ingredient_deducted,
    ii.unit,
    ii.current_stock AS stock_balance_remaining
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN recipes r ON oi.menu_item_id = r.menu_item_id
JOIN recipe_ingredients ri ON r.id = ri.recipe_id
JOIN inventory_items ii ON ri.inventory_item_id = ii.id
WHERE o.id = 'CC2547';

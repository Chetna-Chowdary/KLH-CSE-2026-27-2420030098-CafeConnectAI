# Cafe Connect — Relational Data Dictionary

This data dictionary provides a table-by-table reference for the **Cafe Connect** MySQL database.

---

## 1. `users`
Stores student customers, kitchen staff, and cafeteria administrators.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | No | — | Primary Key. UUID or unique user ID (`usr_*`). |
| `email` | `VARCHAR(128)` | Yes | NULL | Optional student or staff email address. Unique. |
| `password_hash` | `VARCHAR(255)` | Yes | NULL | BCrypt password hash. Null for anonymous guest sessions. |
| `full_name` | `VARCHAR(128)` | No | — | Customer or staff display name. |
| `roll_number` | `VARCHAR(64)` | Yes | NULL | Student roll or campus identifier. Unique when set. |
| `phone_number` | `VARCHAR(32)` | Yes | NULL | Contact phone for SMS/WhatsApp pickup pings. |
| `is_active` | `BOOLEAN` | No | `TRUE` | Soft-deactivation status. |
| `is_guest` | `BOOLEAN` | No | `FALSE` | Identifies orders placed without account registration. |
| `created_at` | `TIMESTAMP` | No | `CURRENT_TIMESTAMP` | Account creation timestamp. |
| `updated_at` | `TIMESTAMP` | No | `CURRENT_TIMESTAMP` | Last updated timestamp. |

---

## 2. `kitchen_stations`
Defines independent preparation lines (Dosa, Hot Meals, Snacks, Beverages, Packaged Goods).

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | No | — | Primary Key (e.g. `dosa_breakfast`, `beverages`). |
| `name` | `VARCHAR(128)` | No | — | Line display name (e.g. `Dosa Station`). |
| `active_capacity` | `INT` | No | `3` | Maximum simultaneous preparation slots (e.g. griddle space). |
| `batch_capacity` | `INT` | No | `2` | Items processed concurrently per batch. |
| `avg_preparation_minutes` | `INT` | No | `6` | Base duration per standard portion. |
| `is_paused` | `BOOLEAN` | No | `FALSE` | Maintenance or rush-hour line pause flag. |
| `active_workers` | `INT` | No | `2` | Headcount assigned to this station. |
| `operating_hours` | `VARCHAR(64)` | No | — | Shift hours for this station. |
| `delay_warning_threshold_mins` | `INT` | No | `15` | Threshold to trigger automated station overload alert. |

---

## 3. `menu_items`
Central catalog for prepared foods, beverages, and packaged goods.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | No | — | Primary Key (`item_*`). |
| `name` | `VARCHAR(128)` | No | — | Item title (e.g. `Masala Dosa`). |
| `description` | `TEXT` | Yes | NULL | Detailed ingredients, preparation, and allergen notes. |
| `category_id` | `VARCHAR(64)` | No | — | FK to `categories.id`. |
| `sub_category` | `VARCHAR(64)` | Yes | NULL | Sub-filter tag (e.g. `Dosa`, `Idli`, `Vada`). |
| `price` | `DECIMAL(10,2)` | No | — | Price in INR (₹). |
| `image_url` | `VARCHAR(512)` | Yes | NULL | High-resolution food photography asset URL. |
| `is_available` | `BOOLEAN` | No | `TRUE` | Live counter availability toggle. |
| `base_prep_minutes` | `INT` | No | `6` | Unloaded preparation duration. |
| `station_id` | `VARCHAR(64)` | No | — | FK to `kitchen_stations.id`. |
| `is_bestseller` | `BOOLEAN` | No | `FALSE` | Featured badge flag. |
| `is_chefs_special` | `BOOLEAN` | No | `FALSE` | Chef special spotlight. |
| `rating` | `DECIMAL(3,2)` | No | `4.50` | Average customer review score. |
| `inventory_item_id` | `VARCHAR(64)` | Yes | NULL | FK to `inventory_items.id` for direct SKU-level products. |
| `is_active` | `BOOLEAN` | No | `TRUE` | Soft deletion / catalog active status. |

---

## 4. `orders`
Authoritative order tickets created upon customer checkout.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | No | — | Primary Key (e.g. `CC2547`). |
| `pickup_number` | `VARCHAR(32)` | No | — | Short token called at counter (e.g. `P-47`). |
| `user_id` | `VARCHAR(64)` | Yes | NULL | FK to `users.id` (null for anonymous guests). |
| `customer_name` | `VARCHAR(128)` | No | — | Pickup identifier name. |
| `roll_number` | `VARCHAR(64)` | Yes | NULL | Student college roll number. |
| `status` | `ENUM` | No | `placed` | `placed`, `accepted`, `preparing`, `ready`, `completed`, `cancelled`. |
| `subtotal` | `DECIMAL(10,2)` | No | — | Cart total before discounts or delivery fees. |
| `total_amount` | `DECIMAL(10,2)` | No | — | Final billed amount in INR. |
| `payment_method` | `ENUM` | No | `pay_at_counter` | `pay_at_counter` or `upi`. |
| `is_paid` | `BOOLEAN` | No | `FALSE` | Payment settlement flag. |
| `estimated_wait_min` | `INT` | No | `8` | Minimum estimated wait minutes calculated at checkout. |
| `estimated_wait_max` | `INT` | No | `12` | Maximum estimated wait minutes calculated at checkout. |
| `estimated_ready_time` | `VARCHAR(32)` | No | — | Human-readable target ready time (e.g. `10:48 AM`). |
| `is_delayed` | `BOOLEAN` | No | `FALSE` | Flagged if kitchen reports station bottlenecks. |
| `delay_reason` | `VARCHAR(255)` | Yes | NULL | Broadcast message explaining delay to customer. |
| `idempotency_key` | `VARCHAR(128)` | Yes | NULL | Unique client token preventing double submission. |

---

## 5. `inventory_items`
Tracks raw recipe ingredients and packaged retail SKUs.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | No | — | Primary Key (`inv_*`). |
| `name` | `VARCHAR(128)` | No | — | Item title (e.g. `Fermented Dosa Batter`). |
| `sku` | `VARCHAR(64)` | Yes | NULL | Barcode / SKU code for retail items. |
| `category` | `ENUM` | No | `raw_material` | `raw_material`, `packaged_product`, `dairy`, `beverage`. |
| `unit` | `VARCHAR(32)` | No | — | Unit of measurement (`kg`, `liters`, `packets`, `pieces`). |
| `current_stock` | `DECIMAL(12,2)` | No | `0.00` | Physical stock balance remaining in pantry. |
| `reorder_point` | `DECIMAL(12,2)` | No | `10.00` | Minimum threshold triggering reorder alert. |
| `safety_stock` | `DECIMAL(12,2)` | No | `5.00` | Emergency buffer to prevent stockouts. |
| `avg_daily_usage` | `DECIMAL(12,2)` | No | `5.00` | Historical daily consumption velocity. |
| `supplier_lead_days` | `INT` | No | `2` | Days required for supplier delivery. |
| `suggested_reorder_quantity` | `DECIMAL(12,2)` | No | `20.00` | Economic order quantity recommendation. |
| `cost_per_unit` | `DECIMAL(10,2)` | No | `0.00` | Purchase cost per unit in INR. |
| `primary_supplier_id` | `VARCHAR(64)` | Yes | NULL | FK to `suppliers.id`. |

---

## 6. `stock_movements`
Immutable audit log recording every inventory change.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | No | AUTO_INC | Primary Key. |
| `inventory_item_id` | `VARCHAR(64)` | No | — | FK to `inventory_items.id`. |
| `movement_type` | `ENUM` | No | — | `order_deduction`, `restock`, `manual_adjustment`, `spoilage`. |
| `quantity_delta` | `DECIMAL(12,2)` | No | — | Negative for consumption, positive for restock. |
| `balance_after` | `DECIMAL(12,2)` | No | — | Stock balance immediately after this transaction. |
| `reason` | `VARCHAR(255)` | No | — | Audit explanation (e.g. `Sold in order #CC2547`). |
| `reference_order_id` | `VARCHAR(64)` | Yes | NULL | Associated order ID if triggered by sale. |
| `created_at` | `TIMESTAMP` | No | `CURRENT_TIMESTAMP` | Event timestamp. |

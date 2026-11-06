# Cafe Connect — Entity Relationship Diagram (ERD)

The following Mermaid entity relationship diagram documents the complete normalized relational data model for **Cafe Connect**.

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    USERS ||--o| STAFF_PROFILES : profile
    USERS ||--o{ USER_SESSIONS : maintains
    USERS ||--o{ ORDERS : places

    CATEGORIES ||--o{ MENU_ITEMS : contains
    KITCHEN_STATIONS ||--o{ MENU_ITEMS : routed_to
    MENU_ITEMS ||--o{ PRODUCT_VARIANTS : has
    MENU_ITEMS ||--o{ MENU_ITEM_ADD_ONS : configures
    ADD_ONS ||--o{ MENU_ITEM_ADD_ONS : included_in
    MENU_ITEMS ||--o{ MENU_ITEM_DIETARY_TAGS : tagged_with
    DIETARY_TAGS ||--o{ MENU_ITEM_DIETARY_TAGS : categorizes
    MENU_ITEMS ||--o| RECIPES : prepared_by
    RECIPES ||--o{ RECIPE_INGREDIENTS : requires

    SUPPLIERS ||--o{ INVENTORY_ITEMS : supplies
    INVENTORY_ITEMS ||--o{ RECIPE_INGREDIENTS : consumed_in
    INVENTORY_ITEMS ||--o{ STOCK_MOVEMENTS : logs
    INVENTORY_ITEMS ||--o| MENU_ITEMS : packaged_sku

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDER_ITEMS ||--o{ ORDER_ITEM_CUSTOMIZATIONS : customizes
    ORDERS ||--o{ ORDER_STATUS_HISTORY : tracks
    ORDERS ||--o{ PAYMENTS : settles
    ORDERS ||--o| ORDER_CANCELLATIONS : records
    KITCHEN_STATIONS ||--o{ ORDER_ITEMS : cooks
    KITCHEN_STATIONS ||--o{ STATION_WORKLOAD_LOGS : records

    USERS {
        string id PK
        string email UK
        string full_name
        string roll_number UK
        boolean is_active
        boolean is_guest
        timestamp created_at
    }

    ROLES {
        string id PK
        string name UK
        string description
    }

    KITCHEN_STATIONS {
        string id PK
        string name
        int active_capacity
        int batch_capacity
        int avg_preparation_minutes
        boolean is_paused
        int active_workers
    }

    CATEGORIES {
        string id PK
        string name
        string slug UK
        int display_order
        boolean is_active
    }

    MENU_ITEMS {
        string id PK
        string name
        string category_id FK
        decimal price
        int base_prep_minutes
        string station_id FK
        boolean is_available
        boolean is_bestseller
        string inventory_item_id FK
    }

    INVENTORY_ITEMS {
        string id PK
        string name
        string sku UK
        string unit
        decimal current_stock
        decimal reorder_point
        decimal safety_stock
        decimal suggested_reorder_quantity
        string primary_supplier_id FK
    }

    ORDERS {
        string id PK
        string pickup_number
        string user_id FK
        string customer_name
        string roll_number
        enum status
        decimal total_amount
        string payment_method
        boolean is_paid
        int estimated_wait_min
        int estimated_wait_max
        string estimated_ready_time
        boolean is_delayed
        string idempotency_key UK
        timestamp created_at
    }

    ORDER_ITEMS {
        string id PK
        string order_id FK
        string menu_item_id FK
        string historical_item_name
        decimal unit_price
        int quantity
        decimal subtotal
        string station_id FK
        enum prep_status
    }

    STOCK_MOVEMENTS {
        bigint id PK
        string inventory_item_id FK
        enum movement_type
        decimal quantity_delta
        decimal balance_after
        string reason
        string reference_order_id
        timestamp created_at
    }
```

---

## 🔗 Key Architectural Highlights

1. **Historical Immutability**:
   `order_items` stores `historical_item_name` and `unit_price` at the moment of order placement. If an admin modifies product prices or renames a dish, existing receipts and financial reporting remain 100% accurate.
2. **Station Decoupling**:
   Each `order_item` tracks its own `station_id` and `prep_status`. In a mixed order (e.g. Masala Dosa + Filter Coffee), the beverages station and breakfast griddle operate in parallel without locking each other.
3. **Automated Inventory Audit**:
   Every completion of an order writes to `stock_movements` with `movement_type = 'order_deduction'` and the exact delta, maintaining an audit trail for inventory tracking.

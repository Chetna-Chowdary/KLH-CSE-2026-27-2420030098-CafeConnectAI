# Cafe Connect — Spring Boot 3 & MySQL Backend Integration Guide

This guide details the transition architecture from the current standalone React prototype to a high-throughput, enterprise **Spring Boot 3 (Java 21)** microservice backed by the **MySQL 8.0+** schema.

---

## 1. Domain Entity & DTO Mapping Architecture

| React Frontend Interface (`src/types/index.ts`) | Spring Boot JPA Entity (`com.cafeconnect.entity`) | MySQL 8.0 Table (`cafe_connect_db`) |
| :--- | :--- | :--- |
| `MenuItem` | `MenuItemEntity.java` | `menu_items` |
| `KitchenStation` | `KitchenStationEntity.java` | `kitchen_stations` |
| `Order` | `OrderEntity.java` | `orders` |
| `OrderItem` | `OrderItemEntity.java` | `order_items` |
| `InventoryItem` | `InventoryItemEntity.java` | `inventory_items` |
| `StockMovement` | `StockMovementEntity.java` | `stock_movements` |
| `OperationalAlert` | `OperationalAlertEntity.java` | `operational_alerts` |
| `User` | `UserEntity.java` | `users` |

---

## 2. Recommended REST API Contracts

### A. Customer & Menu APIs
- `GET /api/v1/menu` — Retrieve active menu catalogue grouped by category with live availability.
- `GET /api/v1/menu/{id}` — Single item details with add-ons and real-time station workload.
- `POST /api/v1/orders/quote-wait-time` — Calculate authoritatively estimated wait time for arbitrary cart payloads before checkout.
- `POST /api/v1/orders/checkout` — Atomic order placement with idempotency check.
  - **Headers**: `Idempotency-Key: <UUID>`
  - **Payload**:
    ```json
    {
      "customerName": "Chaitanya",
      "rollNumber": "CS23B104",
      "paymentMethod": "PAY_AT_COUNTER",
      "specialInstructions": "Less spicy chutney",
      "items": [
        {
          "menuItemId": "item_masala_dosa",
          "quantity": 1,
          "customization": { "chutney": "Coconut Chutney", "addOnIds": ["addon_extra_sambar"] }
        }
      ]
    }
    ```
- `GET /api/v1/orders/{orderId}/track` — Live order progression and status history.

### B. Kitchen Operations APIs
- `GET /api/v1/kitchen/tickets?station={stationId}` — Live incoming orders queue.
- `PATCH /api/v1/kitchen/tickets/{orderId}/status` — Advance status (`ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`).
- `POST /api/v1/kitchen/tickets/{orderId}/flag-delay` — Broadcast delay advisory notice to waiting student.
- `POST /api/v1/kitchen/stations/{stationId}/toggle-pause` — Pause/resume preparation line.

### C. Admin & Inventory APIs
- `GET /api/v1/admin/dashboard/kpis?period=today` — Executive metrics (Revenue, Orders, AOV, Low Stock).
- `GET /api/v1/admin/inventory/items` — SKU stock ledger with calculated reorder points.
- `POST /api/v1/admin/inventory/restock` — Record PO replenishment receipt.
- `PATCH /api/v1/admin/menu/{id}/price` — Instant price adjustments.

---

## 3. High-Concurrency Transaction & Locking Strategy

During campus lunchtime rushes (12:30 PM - 2:00 PM), dozens of students simultaneously order popular items like Masala Dosa or packaged snacks.

### A. Preventing Negative Inventory (Pessimistic Locking)
In Spring Data JPA, prevent overselling and race conditions when deducting recipe ingredients or packaged SKUs:

```java
@Repository
public interface InventoryRepository extends JpaRepository<InventoryItemEntity, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItemEntity i WHERE i.id = :id")
    Optional<InventoryItemEntity> findByIdForUpdate(@Param("id") String id);
}
```

```java
@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
public class InventoryDeductionService {

    public void deductStock(String inventoryItemId, BigDecimal quantity, String orderId) {
        InventoryItemEntity item = inventoryRepository.findByIdForUpdate(inventoryItemId)
            .orElseThrow(() -> new EntityNotFoundException("Item not found: " + inventoryItemId));

        if (item.getCurrentStock().compareTo(quantity) < 0) {
            throw new InsufficientStockException("Insufficient stock for " + item.getName());
        }

        BigDecimal newBalance = item.getCurrentStock().subtract(quantity);
        item.setCurrentStock(newBalance);
        inventoryRepository.save(item);

        // Record immutable audit entry
        stockMovementRepository.save(new StockMovementEntity(
            item, MovementType.ORDER_DEDUCTION, quantity.negate(), newBalance, "Order #" + orderId
        ));
    }
}
```

### B. Double-Submission Idempotency Guard
Use the `idempotency_key` column with a unique database constraint (`uk_orders_idempotency`). If a client network timeout causes an automatic retry, the duplicate request returns the existing order record rather than charging twice or incrementing kitchen tickets.

---

## 4. Real-Time Push Notifications (WebSocket / SSE)

Replace frontend polling with **Server-Sent Events (SSE)** or **STOMP over WebSocket**:
- When kitchen staff call `PATCH /api/v1/kitchen/tickets/{orderId}/status` to `READY`, the server emits an SSE event to `topic/order/{orderId}`.
- The student's browser immediately triggers celebratory pickup feedback without refreshing the page.

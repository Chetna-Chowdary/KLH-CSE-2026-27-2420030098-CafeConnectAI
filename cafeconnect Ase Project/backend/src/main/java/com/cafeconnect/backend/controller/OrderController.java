
package com.cafeconnect.backend.controller;

import com.cafeconnect.backend.entity.Order;
import com.cafeconnect.backend.entity.OrderItem;
import com.cafeconnect.backend.entity.OrderStatusHistory;
import com.cafeconnect.backend.repository.OrderRepository;
import com.cafeconnect.backend.repository.OrderItemRepository;
import com.cafeconnect.backend.repository.OrderStatusHistoryRepository;
import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepository;
    private final EntityManager entityManager;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;

public OrderController(
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        OrderStatusHistoryRepository historyRepository,
        EntityManager entityManager) {
            this.entityManager = entityManager;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.historyRepository = historyRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllOrders() {

        return orderRepository.findAll().stream().map(order -> {

            Map<String, Object> result = new HashMap<>();

            result.put("id", order.getId());
            result.put("pickupNumber", order.getPickupNumber());
            result.put("customerName", order.getCustomerName());
            result.put("rollNumber", order.getRollNumber());
            result.put("status", order.getStatus());
            result.put("subtotal", order.getSubtotal());
            result.put("tax", order.getTax());
            result.put("totalAmount", order.getTotalAmount());
            result.put("paymentMethod", order.getPaymentMethod());
            result.put("isPaid", order.getIsPaid());
            result.put("createdAt", order.getCreatedAt());
            result.put("updatedAt", order.getUpdatedAt());
            result.put("estimatedReadyTime", order.getEstimatedReadyTime());
            result.put("actualReadyTime", order.getActualReadyTime());
            result.put("specialInstructions", order.getSpecialInstructions());
            result.put("isDelayed", order.getIsDelayed());
            result.put("delayReason", order.getDelayReason());

            Map<String, Integer> wait = new HashMap<>();
            wait.put("min", order.getEstimatedWaitMin());
            wait.put("max", order.getEstimatedWaitMax());
            result.put("estimatedReadyMinutes", wait);

            List<Map<String, Object>> items =
                    orderItemRepository.findByOrderId(order.getId())
                    .stream().map(item -> {
                        Map<String, Object> itemMap = new HashMap<>();
                        itemMap.put("id", item.getId());
                        itemMap.put("menuItemId", item.getMenuItemId());
                        itemMap.put("name", item.getHistoricalItemName());
                        itemMap.put("price", item.getUnitPrice());
                        itemMap.put("quantity", item.getQuantity());
                        itemMap.put("subtotal", item.getSubtotal());
                        itemMap.put("stationId", item.getStationId());
                        itemMap.put("prepStatus", item.getPrepStatus());
                        return itemMap;
                    }).toList();

            result.put("items", items);

            List<OrderStatusHistory> history =
                    historyRepository.findByOrderIdOrderByCreatedAtAsc(order.getId());

            result.put("statusHistory", history);

            return result;

        }).toList();
    }

    @PostMapping
    @Transactional
    public Map<String, Object> createOrder(@RequestBody OrderRequest request) {

        if (request.id == null || request.id.isBlank()
                || request.items == null || request.items.isEmpty()) {
            throw new IllegalArgumentException("Order ID and items are required");
        }

        if (orderRepository.existsById(request.id)) {
            throw new IllegalArgumentException("Order ID already exists");
        }

        Order order = new Order();

        order.setId(request.id);
        order.setPickupNumber(request.pickupNumber);
        order.setCustomerName(request.customerName);
        order.setRollNumber(request.rollNumber);
        order.setStatus("placed");
        order.setSubtotal(request.subtotal);
        order.setTax(request.tax != null ? request.tax : BigDecimal.ZERO);
        order.setTotalAmount(request.totalAmount);
        order.setPaymentMethod(request.paymentMethod);
        order.setIsPaid("upi".equals(request.paymentMethod));
        order.setEstimatedWaitMin(request.estimatedWaitMin);
        order.setEstimatedWaitMax(request.estimatedWaitMax);
        order.setEstimatedReadyTime(request.estimatedReadyTime);
        order.setSpecialInstructions(request.specialInstructions);
        order.setIsDelayed(false);

        entityManager.persist(order);

        for (ItemRequest itemRequest : request.items) {

            OrderItem item = new OrderItem();
            item.setId(java.util.UUID.randomUUID().toString());

            item.setOrderId(request.id);
            item.setMenuItemId(itemRequest.menuItemId);
            item.setHistoricalItemName(itemRequest.name);
            item.setUnitPrice(itemRequest.price);
            item.setQuantity(itemRequest.quantity);
            item.setSubtotal(itemRequest.subtotal);
            item.setStationId(itemRequest.stationId);
            item.setPrepStatus("pending");

            orderItemRepository.save(item);
        }

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(request.id);
        history.setStatus("placed");
        history.setNote("Order placed via Web App");

        historyRepository.save(history);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order created successfully");
        response.put("orderId", request.id);
        response.put("status", "placed");

        return response;
    }

    public static class OrderRequest {
        public String id;
        public String pickupNumber;
        public String customerName;
        public String rollNumber;
        public BigDecimal subtotal;
        public BigDecimal tax;
        public BigDecimal totalAmount;
        public String paymentMethod;
        public Integer estimatedWaitMin;
        public Integer estimatedWaitMax;
        public String estimatedReadyTime;
        public String specialInstructions;
        public List<ItemRequest> items;
    }

    public static class ItemRequest {
        public String menuItemId;
        public String name;
        public BigDecimal price;
        public Integer quantity;
        public BigDecimal subtotal;
        public String stationId;
    }
}

package com.cafeconnect.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
@Id
@Column(name = "id", nullable = false)
private String id;
    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "menu_item_id", nullable = false)
    private String menuItemId;

    @Column(name = "historical_item_name", nullable = false)
    private String historicalItemName;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal subtotal;

    @Column(name = "station_id")
    private String stationId;

    @Column(name = "prep_status")
    private String prepStatus;

    public OrderItem() {}

  public String getId() { return id; }
public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getMenuItemId() { return menuItemId; }
    public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }

    public String getHistoricalItemName() { return historicalItemName; }
    public void setHistoricalItemName(String name) { this.historicalItemName = name; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal price) { this.unitPrice = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }

    public String getPrepStatus() { return prepStatus; }
    public void setPrepStatus(String prepStatus) { this.prepStatus = prepStatus; }
}
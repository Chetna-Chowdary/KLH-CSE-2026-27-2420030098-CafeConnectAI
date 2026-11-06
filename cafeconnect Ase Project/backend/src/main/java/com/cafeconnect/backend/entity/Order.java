
package com.cafeconnect.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

@Id
@Column(name = "id", nullable = false)
private String id;
    @Column(name = "pickup_number", nullable = false)
    private String pickupNumber;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "roll_number")
    private String rollNumber;

    private String status = "placed";

    @Column(nullable = false)
    private BigDecimal subtotal;

    private BigDecimal tax;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Column(name = "estimated_wait_min")
    private Integer estimatedWaitMin;

    @Column(name = "estimated_wait_max")
    private Integer estimatedWaitMax;

    @Column(name = "estimated_ready_time")
    private String estimatedReadyTime;

    @Column(name = "actual_ready_time")
    private LocalDateTime actualReadyTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    @Column(name = "special_instructions")
    private String specialInstructions;

    @Column(name = "is_delayed")
    private Boolean isDelayed;

    @Column(name = "delay_reason")
    private String delayReason;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Order() {}

    // Getters and setters

public String getId() { return id; }
public void setId(String id) { this.id = id; }

    public String getPickupNumber() { return pickupNumber; }
    public void setPickupNumber(String value) { this.pickupNumber = value; }

    public String getUserId() { return userId; }
    public void setUserId(String value) { this.userId = value; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String value) { this.customerName = value; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String value) { this.rollNumber = value; }

    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal value) { this.subtotal = value; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal value) { this.tax = value; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal value) { this.totalAmount = value; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String value) { this.paymentMethod = value; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean value) { this.isPaid = value; }

    public Integer getEstimatedWaitMin() { return estimatedWaitMin; }
    public void setEstimatedWaitMin(Integer value) { this.estimatedWaitMin = value; }

    public Integer getEstimatedWaitMax() { return estimatedWaitMax; }
    public void setEstimatedWaitMax(Integer value) { this.estimatedWaitMax = value; }

    public String getEstimatedReadyTime() { return estimatedReadyTime; }
    public void setEstimatedReadyTime(String value) { this.estimatedReadyTime = value; }

    public LocalDateTime getActualReadyTime() { return actualReadyTime; }
    public void setActualReadyTime(LocalDateTime value) { this.actualReadyTime = value; }

    public LocalDateTime getCompletedTime() { return completedTime; }
    public void setCompletedTime(LocalDateTime value) { this.completedTime = value; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String value) { this.specialInstructions = value; }

    public Boolean getIsDelayed() { return isDelayed; }
    public void setIsDelayed(Boolean value) { this.isDelayed = value; }

    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String value) { this.delayReason = value; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String value) { this.idempotencyKey = value; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

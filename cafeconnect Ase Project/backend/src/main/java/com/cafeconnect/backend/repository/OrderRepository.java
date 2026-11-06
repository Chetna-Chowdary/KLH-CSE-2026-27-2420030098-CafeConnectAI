package com.cafeconnect.backend.repository;
import com.cafeconnect.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
}
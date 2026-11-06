package com.cafeconnect.backend.repository;

import com.cafeconnect.backend.entity.KitchenStation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KitchenStationRepository extends JpaRepository<KitchenStation, String> {
}
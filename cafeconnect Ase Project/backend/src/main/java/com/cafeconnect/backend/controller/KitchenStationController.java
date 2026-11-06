package com.cafeconnect.backend.controller;

import com.cafeconnect.backend.entity.KitchenStation;
import com.cafeconnect.backend.repository.KitchenStationRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/kitchen-stations")
@CrossOrigin(origins = "http://localhost:3000")
public class KitchenStationController {

    private final KitchenStationRepository repository;

    public KitchenStationController(KitchenStationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<KitchenStation> getAllStations() {
        return repository.findAll();
    }
}
package com.cafeconnect.backend.controller;

import com.cafeconnect.backend.entity.MenuItem;
import com.cafeconnect.backend.repository.MenuItemRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;

    public MenuItemController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem item) {

        if (item.getId() == null || item.getId().isBlank()) {
            item.setId(java.util.UUID.randomUUID().toString());
        }

        LocalDateTime now = LocalDateTime.now();

        item.setCreatedAt(now);
        item.setUpdatedAt(now);

        if (item.getIsBestseller() == null) {
            item.setIsBestseller(false);
        }

        if (item.getIsChefsSpecial() == null) {
            item.setIsChefsSpecial(false);
        }

        if (item.getRating() == null) {
            item.setRating(new java.math.BigDecimal("4.50"));
        }

        if (item.getReviewCount() == null) {
            item.setReviewCount(0);
        }

        if (item.getIsActive() == null) {
            item.setIsActive(true);
        }

        return menuItemRepository.save(item);
    }
}
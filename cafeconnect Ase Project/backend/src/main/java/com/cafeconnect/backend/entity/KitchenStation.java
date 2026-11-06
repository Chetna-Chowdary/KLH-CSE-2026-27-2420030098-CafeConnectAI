package com.cafeconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "kitchen_stations")
public class KitchenStation {

    @Id
    private String id;

    private String name;

    @Column(name = "active_capacity")
    private Integer activeCapacity;

    @Column(name = "batch_capacity")

    private Integer batchCapacity;


    @Column(name = "avg_preparation_minutes")
    private Integer avgPreparationMinutes;

    @Column(name = "is_paused")
    private Boolean isPaused;

    @Column(name = "active_workers")
    private Integer activeWorkers;

    @Column(name = "operating_hours")
    private String operatingHours;

    public KitchenStation() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getActiveCapacity() { return activeCapacity; }
    public void setActiveCapacity(Integer value) { this.activeCapacity = value; }

    public Integer getBatchCapacity() { return batchCapacity; }
    public void setBatchCapacity(Integer value) { this.batchCapacity = value; }

    

    public Integer getAvgPreparationMinutes() { return avgPreparationMinutes; }
    public void setAvgPreparationMinutes(Integer value) { this.avgPreparationMinutes = value; }

    public Boolean getIsPaused() { return isPaused; }
    public void setIsPaused(Boolean value) { this.isPaused = value; }

    public Integer getActiveWorkers() { return activeWorkers; }
    public void setActiveWorkers(Integer value) { this.activeWorkers = value; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String value) { this.operatingHours = value; }
}
package com.carprice360.carprice360.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "CarImages")
public class CarImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "car_id", nullable = false)
    private Integer carId;

    @Column(name = "image_index", nullable = false)
    private Integer imageIndex;

    @Column(name = "content_type")
    private String contentType;

    @Lob
    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
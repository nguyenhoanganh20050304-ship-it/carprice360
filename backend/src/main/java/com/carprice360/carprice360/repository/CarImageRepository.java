package com.carprice360.carprice360.repository;

import com.carprice360.carprice360.entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Integer> {
    Optional<CarImage> findByCarIdAndImageIndex(Integer carId, Integer imageIndex);
    void deleteByCarId(Integer carId);
}
package com.carprice360.carprice360.repository;

import com.carprice360.carprice360.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

    // Tìm theo thương hiệu
    List<Car> findByThuongHieu(String thuongHieu);

    // Tìm theo loại xe
    List<Car> findByLoaiXe(String loaiXe);

    // Tìm theo nhiên liệu
    List<Car> findByNhienLieu(String nhienLieu);

    // Tìm theo tên xe (chứa từ khóa)
    List<Car> findByTenXeContainingIgnoreCase(String keyword);

    // Tìm theo khoảng giá
    List<Car> findByGiaBetween(java.math.BigDecimal min, java.math.BigDecimal max);
}
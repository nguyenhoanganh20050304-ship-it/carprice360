package com.carprice360.carprice360.service;

import com.carprice360.carprice360.entity.Car;
import com.carprice360.carprice360.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    // Lấy tất cả xe
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // Lấy xe theo id
    public Optional<Car> getCarById(Integer id) {
        return carRepository.findById(id);
    }

    // Tìm theo tên
    public List<Car> searchByName(String keyword) {
        return carRepository.findByTenXeContainingIgnoreCase(keyword);
    }

    // Tìm theo thương hiệu
    public List<Car> getByBrand(String brand) {
        return carRepository.findByThuongHieu(brand);
    }

    // Tìm theo loại xe
    public List<Car> getByType(String type) {
        return carRepository.findByLoaiXe(type);
    }

    // Tìm theo nhiên liệu
    public List<Car> getByFuel(String fuel) {
        return carRepository.findByNhienLieu(fuel);
    }

    // Tìm theo khoảng giá
    public List<Car> getByPriceRange(BigDecimal min, BigDecimal max) {
        return carRepository.findByGiaBetween(min, max);
    }

    // Thêm xe mới (admin)
    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    // Sửa xe (admin)
    public Car updateCar(Integer id, Car car) {
        car.setId(id);
        return carRepository.save(car);
    }

    // Xóa xe (admin)
    public void deleteCar(Integer id) {
        carRepository.deleteById(id);
    }
}

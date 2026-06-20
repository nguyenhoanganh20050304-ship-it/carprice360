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
        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Xe không tồn tại: " + id));
        existing.setTenXe(car.getTenXe());
        existing.setThuongHieu(car.getThuongHieu());
        existing.setLoaiXe(car.getLoaiXe());
        existing.setGia(car.getGia());
        existing.setSoCho(car.getSoCho());
        existing.setNhienLieu(car.getNhienLieu());
        existing.setMaLuc(car.getMaLuc());
        existing.setTieuThu(car.getTieuThu());
        existing.setDanDong(car.getDanDong());
        existing.setHopSo(car.getHopSo());
        existing.setSoTuiKhi(car.getSoTuiKhi());
        existing.setAbsSystem(car.getAbsSystem());
        existing.setEbdSystem(car.getEbdSystem());
        existing.setHacSystem(car.getHacSystem());
        existing.setCameraLui(car.getCameraLui());
        existing.setCamBienDoXe(car.getCamBienDoXe());
        existing.setCruiseControl(car.getCruiseControl());
        existing.setManHinh(car.getManHinh());
        existing.setDieuHoa(car.getDieuHoa());
        existing.setGheDien(car.getGheDien());
        existing.setCuaSoTroi(car.getCuaSoTroi());
        existing.setSmartEntry(car.getSmartEntry());
        existing.setSacKd(car.getSacKd());
        if (car.getHinhAnh() != null && !car.getHinhAnh().isBlank()) {
            existing.setHinhAnh(car.getHinhAnh());
        }
        return carRepository.save(existing);
    }

    // Xóa xe (admin)
    public void deleteCar(Integer id) {
        carRepository.deleteById(id);
    }
}

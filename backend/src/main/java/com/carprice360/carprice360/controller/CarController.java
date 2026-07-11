package com.carprice360.carprice360.controller;

import com.carprice360.carprice360.entity.Car;
import com.carprice360.carprice360.entity.CarImage;
import com.carprice360.carprice360.repository.CarImageRepository;
import com.carprice360.carprice360.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;
    private final CarImageRepository carImageRepository;

    // GET /api/cars - Lấy tất cả xe
    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    // GET /api/cars/{id} - Lấy xe theo id
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Integer id) {
        return carService.getCarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/cars/search?keyword=toyota
    @GetMapping("/search")
    public ResponseEntity<List<Car>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(carService.searchByName(keyword));
    }

    // GET /api/cars/brand?name=BMW
    @GetMapping("/brand")
    public ResponseEntity<List<Car>> getByBrand(@RequestParam String name) {
        return ResponseEntity.ok(carService.getByBrand(name));
    }

    // GET /api/cars/type?name=SUV
    @GetMapping("/type")
    public ResponseEntity<List<Car>> getByType(@RequestParam String name) {
        return ResponseEntity.ok(carService.getByType(name));
    }

    // GET /api/cars/fuel?type=Điện
    @GetMapping("/fuel")
    public ResponseEntity<List<Car>> getByFuel(@RequestParam String type) {
        return ResponseEntity.ok(carService.getByFuel(type));
    }

    // GET /api/cars/price?min=500&max=2000
    @GetMapping("/price")
    public ResponseEntity<List<Car>> getByPrice(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return ResponseEntity.ok(carService.getByPriceRange(min, max));
    }

    // POST /api/cars - Thêm xe (admin)
    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.addCar(car));
    }

    // PUT /api/cars/{id} - Sửa xe (admin)
    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Integer id, @RequestBody Car car) {
        return ResponseEntity.ok(carService.updateCar(id, car));
    }

    // DELETE /api/cars/{id} - Xóa xe (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Integer id) {
        carService.deleteCar(id);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/cars/{id}/images - Upload 5 ảnh cho xe
     * Ảnh được lưu trực tiếp vào DB (bảng CarImages) dưới dạng byte[]
     * @Transactional đảm bảo xóa ảnh cũ + lưu 5 ảnh mới thành công toàn bộ hoặc rollback
     */
    @Transactional
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable Integer id,
            @RequestParam("images") MultipartFile[] images) throws IOException {

        Optional<Car> carOpt = carService.getCarById(id);
        if (carOpt.isEmpty()) return ResponseEntity.notFound().build();
        if (images == null || images.length != 5) {
            return ResponseEntity.badRequest().body("Vui lòng upload đúng 5 ảnh");
        }

        carImageRepository.deleteByCarId(id); // xóa ảnh cũ nếu có

        for (int i = 0; i < 5; i++) {
            CarImage img = new CarImage();
            img.setCarId(id);
            img.setImageIndex(i + 1);
            img.setContentType(images[i].getContentType());
            img.setImageData(images[i].getBytes());
            img.setCreatedAt(LocalDateTime.now());
            carImageRepository.save(img);
        }

        // Đánh dấu xe đã có ảnh (optional)
        Car car = carOpt.get();
        car.setHinhAnh("db");
        carService.addCar(car);

        return ResponseEntity.ok(Map.of("success", true, "message", "Đã lưu 5 ảnh vào database"));
    }

    // GET /api/cars/{id}/images/{index} - Lấy 1 ảnh theo index
    @GetMapping("/{id}/images/{index}")
    public ResponseEntity<byte[]> getImage(
            @PathVariable Integer id,
            @PathVariable Integer index) {
        return carImageRepository.findByCarIdAndImageIndex(id, index)
                .map(img -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(img.getContentType()))
                        .body(img.getImageData()))
                .orElse(ResponseEntity.notFound().build());
    }
}
package com.carprice360.carprice360.controller;

import com.carprice360.carprice360.entity.Car;
import com.carprice360.carprice360.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    // Thư mục lưu ảnh, cấu hình trong application.properties
    @Value("${upload.path:uploads/}")
    private String uploadPath;

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
     * Frontend gửi multipart/form-data với các file img1..img5
     * Ảnh được lưu vào {upload.path}/{brand}/{carName}/1.png .. 5.png
     * Field hinhAnh của xe được cập nhật thành đường dẫn thư mục đó
     */
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable Integer id,
            @RequestParam("images") MultipartFile[] images) {

        Optional<Car> carOpt = carService.getCarById(id);
        if (carOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (images == null || images.length != 5) {
            return ResponseEntity.badRequest().body("Vui lòng upload đúng 5 ảnh");
        }

        Car car = carOpt.get();

        // Tạo tên thư mục an toàn: chuyển thành chữ thường, thay ký tự đặc biệt
        String brand = sanitize(car.getThuongHieu());
        String carName = sanitize(car.getTenXe());

        // Đường dẫn thư mục lưu ảnh
        String folderPath = uploadPath + brand + "/" + carName + "/";
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        try {
            for (int i = 0; i < 5; i++) {
                MultipartFile file = images[i];
                String extension = getExtension(file.getOriginalFilename());
                File dest = new File(folder, (i + 1) + "." + extension);
                file.transferTo(dest);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Lỗi lưu ảnh: " + e.getMessage());
        }

        // Lưu đường dẫn thư mục vào DB (dùng relative path cho frontend)
        // Ví dụ: "image/cars/bmw/320i-sport-line/"
        String relativePath = "image/cars/" + brand + "/" + carName + "/";
        car.setHinhAnh(relativePath);
        Car saved = carService.addCar(car);

        return ResponseEntity.ok(saved);
    }

    // Chuẩn hóa tên thành folder-safe string
    private String sanitize(String name) {
        if (name == null) return "unknown";
        return name.toLowerCase()
                .replaceAll("[^a-z0-9 ]", "")   // ← chỉ giữ chữ, số, dấu cách
                .replaceAll(" {2,}", " ")         // ← nhiều cách liên tiếp → 1 cách
                .trim();
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "png";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}

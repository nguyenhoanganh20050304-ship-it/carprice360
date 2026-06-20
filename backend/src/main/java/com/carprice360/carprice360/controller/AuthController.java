package com.carprice360.carprice360.controller;

import com.carprice360.carprice360.entity.User;
import com.carprice360.carprice360.repository.UserRepository;
import com.carprice360.carprice360.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository; // Inject thêm UserRepository vào đây để xài ngầm

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = authService.register(
                    request.get("hoTen"),
                    request.get("email"),
                    request.get("matKhau")
            );
            response.put("success", true);
            response.put("message", "Đăng ký thành công!");
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> user = authService.login(
                request.get("email"),
                request.get("matKhau")
        );

        if (user.isPresent()) {
            // KIỂM TRA: Nếu tài khoản bị khóa (isBlocked = true) thì chặn luôn không cho đăng nhập
            if (Boolean.TRUE.equals(user.get().getIsBlocked())) {
                response.put("success", false);
                response.put("message", "Tài khoản của bạn đã bị khóa bởi Admin!");
                return ResponseEntity.badRequest().body(response);
            }

            response.put("success", true);
            response.put("message", "Đăng nhập thành công!");
            response.put("userId", user.get().getId());
            response.put("hoTen", user.get().getHoTen());
            response.put("vaiTro", user.get().getVaiTro());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Email hoặc mật khẩu không đúng!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // GET /api/auth/api/users -> Đổi lại đường dẫn cho khớp hoàn toàn với cấu trúc Class
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();

        // Xóa mật khẩu đã băm trước khi gửi về Frontend để tăng tính bảo mật
        users.forEach(user -> user.setMatKhau(null));

        return ResponseEntity.ok(users);
    }

    // PUT /api/auth/api/users/{id}/block -> Xử lý bật/tắt khóa tài khoản thực tế trong DB
    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Integer id) {
        return userRepository.findById(id).map(user -> {

            // Đảo trạng thái: đang false (bình thường) -> true (khóa) và ngược lại
            user.setIsBlocked(!user.getIsBlocked());
            userRepository.save(user);

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Đã thay đổi trạng thái khóa tài khoản thành công!",
                    "currentStatus",user.getIsBlocked()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
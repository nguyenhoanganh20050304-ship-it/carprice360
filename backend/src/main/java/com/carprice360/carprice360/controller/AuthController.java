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
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

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

    // GET /api/auth/users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setMatKhau(null));
        return ResponseEntity.ok(users);
    }

    // PUT /api/auth/users/{id}/block
    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setIsBlocked(true);
            userRepository.save(user);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Đã khóa tài khoản thành công!",
                    "currentStatus", true
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/auth/users/{id}/unblock
    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setIsBlocked(false);
            userRepository.save(user);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Đã mở khóa tài khoản thành công!",
                    "currentStatus", false
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/auth/users/{id}/delete -> THÊM LẠI HÀM NÀY (Dùng POST để tránh lỗi CORS đường DELETE)
    @PostMapping("/users/{id}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        return userRepository.findById(id).map(user -> {
            if ("ADMIN".equals(user.getVaiTro())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Không thể xóa tài khoản ADMIN!"
                ));
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Đã xóa tài khoản thành công!"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
package com.carprice360.carprice360.service;

import com.carprice360.carprice360.entity.User;
import com.carprice360.carprice360.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Đăng ký
    public User register(String hoTen, String email, String matKhau) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        User user = new User();
        user.setHoTen(hoTen);
        user.setEmail(email);
        user.setMatKhau(passwordEncoder.encode(matKhau));

        // FIX CỨNG  email này đăng ký thì tự động cấp quyền ADMIN
        if ("admin360@gmail.com".equalsIgnoreCase(email.trim())) {
            user.setVaiTro("ADMIN");
        } else {
            user.setVaiTro("USER"); // Các email khác mặc định là USER
        }

        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Đăng nhập
    public Optional<User> login(String email, String matKhau) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(matKhau, user.get().getMatKhau())) {
            return user;
        }
        return Optional.empty();
    }
}
package com.carprice360.carprice360.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @Column(name = "vai_tro", nullable = false)
    private String vaiTro = "USER";

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "is_blocked")
    private Boolean isBlocked = false;
}
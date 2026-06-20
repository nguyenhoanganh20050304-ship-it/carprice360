package com.carprice360.carprice360.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_xe", nullable = false)
    private String tenXe;

    @Column(name = "gia", nullable = false)
    private BigDecimal gia;

    @Column(name = "loai_xe", nullable = false)
    private String loaiXe;

    @Column(name = "so_cho", nullable = false)
    private Integer soCho;

    @Column(name = "nhien_lieu", nullable = false)
    private String nhienLieu;

    @Column(name = "ma_luc", nullable = false)
    private Integer maLuc;

    @Column(name = "tieu_thu", nullable = false)
    private BigDecimal tieuThu;

    @Column(name = "thuong_hieu", nullable = false)
    private String thuongHieu;

    @Column(name = "hop_so")
    private String hopSo;

    @Column(name = "dan_dong")
    private String danDong;

    @Column(name = "so_tui_khi")
    private Integer soTuiKhi;

    @Column(name = "abs_system")
    private String absSystem;

    @Column(name = "ebd_system")
    private String ebdSystem;

    @Column(name = "hac_system")
    private String hacSystem;

    @Column(name = "camera_lui")
    private String cameraLui;

    @Column(name = "cam_bien_do_xe")
    private String camBienDoXe;

    @Column(name = "cruise_control")
    private String cruiseControl;

    @Column(name = "man_hinh")
    private String manHinh;

    @Column(name = "dieu_hoa")
    private String dieuHoa;

    @Column(name = "ghe_dien")
    private String gheDien;

    @Column(name = "cua_so_troi")
    private String cuaSoTroi;

    @Column(name = "smart_entry")
    private String smartEntry;

    @Column(name = "sac_kd")
    private String sacKd;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ✅ Cột mới: lưu đường dẫn thư mục ảnh, VD: "image/cars/bmw/320/"
    @Column(name = "hinh_anh")
    private String hinhAnh;
}

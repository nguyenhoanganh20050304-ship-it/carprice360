-- Tao database
CREATE DATABASE carprice360db;
GO
-- Su dung database
USE carprice360db;
GO

-- Tao bang Cars
CREATE TABLE Cars (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    ten_xe      NVARCHAR(100)   NOT NULL,
    gia         DECIMAL(10,3)   NOT NULL,
    loai_xe     NVARCHAR(50)    NOT NULL,
    so_cho      INT             NOT NULL,
    nhien_lieu  NVARCHAR(30)    NOT NULL,
    ma_luc      INT             NOT NULL,
    tieu_thu    DECIMAL(5,2)    NOT NULL,
    thuong_hieu NVARCHAR(50)    NOT NULL,
    created_at  DATETIME        DEFAULT GETDATE(),
);
GO

-- Tao bang Users
CREATE TABLE Users (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    ho_ten          NVARCHAR(100)   NOT NULL,
    email           NVARCHAR(100)   NOT NULL UNIQUE,
    mat_khau        NVARCHAR(255)   NOT NULL,
    vai_tro         NVARCHAR(20)    NOT NULL DEFAULT 'USER',
	is_blocked BIT DEFAULT 0,
    created_at      DATETIME        DEFAULT GETDATE()
);
GO

-- Tao bang Favorites (xe yeu thich)
CREATE TABLE Favorites (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    user_id     INT NOT NULL,
    car_id      INT NOT NULL,
    created_at  DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (car_id)  REFERENCES Cars(id)
);
GO

CREATE TABLE CarImages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    car_id INT NOT NULL,
    image_index INT NOT NULL,
    content_type VARCHAR(100) NULL,
    image_data VARBINARY(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (car_id) REFERENCES Cars(id)
);
-
-- INSERT du lieu xe

INSERT INTO Cars (ten_xe, gia, loai_xe, so_cho, nhien_lieu, ma_luc, tieu_thu, thuong_hieu) VALUES
-- Mercedes
(N'Mercedes C300 AMG',          2099.000, N'Sedan',  5, N'Xăng',  258, 9.07,  N'Mercedes'),
(N'Mercedes E300 AMG',          3209.000, N'Sedan',  5, N'Xăng',  258, 8.90,  N'Mercedes'),
(N'Mercedes GLC 300 4MATIC',    2799.000, N'SUV',    5, N'Xăng',  258, 10.48, N'Mercedes'),
(N'Mercedes AMG GT R',         11590.000, N'Coupe',  2, N'Xăng',  585, 11.74, N'Mercedes'),
(N'Mercedes-Maybach S680',     15990.000, N'Sedan',  4, N'Xăng',  612, 10.67, N'Mercedes'),

-- Audi
(N'Audi A7 Sportback',          3300.000, N'Sedan',  5, N'Xăng',  340, 7.10,  N'Audi'),
(N'Audi A6 45 TFSI',            2300.000, N'Sedan',  5, N'Xăng',  245, 6.80,  N'Audi'),
(N'Audi A8L 55 TFSI',           5600.000, N'Sedan',  5, N'Xăng',  340, 8.50,  N'Audi'),
(N'Audi Q5',                    2400.000, N'SUV',    5, N'Xăng',  245, 7.90,  N'Audi'),
(N'Audi e-tron',                5200.000, N'SUV',    5, N'Điện',  408, 0.00,  N'Audi'),

-- BMW
(N'BMW 320i Sport Line',        1500.000, N'Sedan',  5, N'Xăng',  184, 6.50,  N'BMW'),
(N'BMW 520i Luxury Line',       2300.000, N'Sedan',  5, N'Xăng',  184, 6.80,  N'BMW'),
(N'BMW X5 xDrive40i',           4300.000, N'SUV',    7, N'Xăng',  340, 8.50,  N'BMW'),
(N'BMW 430i Coupe',             2600.000, N'Coupe',  4, N'Xăng',  258, 6.60,  N'BMW'),
(N'BMW 740i',                   6300.000, N'Sedan',  5, N'Xăng',  381, 7.90,  N'BMW'),

-- Porsche
(N'Porsche 911 Carrera',        8400.000, N'Coupe',  4, N'Xăng',  385, 10.30, N'Porsche'),
(N'Porsche Cayenne',            5800.000, N'SUV',    5, N'Xăng',  353, 9.40,  N'Porsche'),
(N'Porsche Panamera',           6200.000, N'Sedan',  4, N'Xăng',  330, 8.20,  N'Porsche'),
(N'Porsche Taycan',             5000.000, N'Sedan',  4, N'Điện',  408, 0.00,  N'Porsche'),

-- Toyota & Lexus
(N'Toyota Camry 2.5 HEV',      1495.000, N'Sedan',  5, N'Hybrid', 227, 4.50, N'Toyota'),
(N'Toyota Fortuner Legender',  1350.000, N'SUV',    7, N'Dầu',    201, 8.60, N'Toyota'),
(N'Toyota Corolla Cross HEV',   913.000, N'SUV',    5, N'Hybrid', 170, 4.20, N'Toyota'),
(N'Toyota Land Cruiser 300',   4286.000, N'SUV',    7, N'Xăng',   409, 12.10, N'Toyota'),
(N'Lexus ES300h',              2620.000, N'Sedan',  5, N'Hybrid', 215, 4.80, N'Lexus'),
(N'Lexus RX350 Premium',       3430.000, N'SUV',    5, N'Xăng',   275, 8.80, N'Lexus'),
(N'Lexus LX600 F Sport',       8610.000, N'SUV',    7, N'Xăng',   409, 12.00, N'Lexus'),
(N'Lexus LS500',               7650.000, N'Sedan',  5, N'Xăng',   416, 9.50, N'Lexus'),

-- Kia & Hyundai
(N'Kia K3 Premium',             619.000, N'Sedan',  5, N'Xăng',  126, 6.10, N'Kia'),
(N'Kia Sportage 1.6 Turbo',     819.000, N'SUV',    5, N'Xăng',  177, 7.10, N'Kia'),
(N'Kia Carnival Signature',    1589.000, N'MPV',    7, N'Dầu',   199, 6.50, N'Kia'),
(N'Kia EV6 GT-Line',           1459.000, N'SUV',    5, N'Điện',  325, 0.00, N'Kia'),
(N'Hyundai Accent 1.5 AT',      489.000, N'Sedan',  5, N'Xăng',  115, 5.80, N'Hyundai'),
(N'Hyundai Santa Fe Hybrid',   1369.000, N'SUV',    7, N'Hybrid', 230, 5.90, N'Hyundai'),
(N'Hyundai IONIQ 6',           1200.000, N'Sedan',  5, N'Điện',  325, 0.00, N'Hyundai'),

-- Ford
(N'Ford Ranger Wildtrak',      1039.000, N'Pickup', 5, N'Dầu',   210, 8.00, N'Ford'),
(N'Ford Everest Titanium',     1468.000, N'SUV',    7, N'Dầu',   210, 7.20, N'Ford'),
(N'Ford Mustang Mach-E',       3200.000, N'SUV',    5, N'Điện',  480, 0.00, N'Ford'),

-- VinFast
(N'VinFast VF e34',             710.000, N'SUV',    5, N'Điện',  147, 0.00, N'VinFast'),
(N'VinFast VF 7 Plus',          999.000, N'SUV',    5, N'Điện',  349, 0.00, N'VinFast'),
(N'VinFast VF 8 Plus',         1119.000, N'SUV',    5, N'Điện',  402, 0.00, N'VinFast');
GO
--thêm dữ liệu chi tiết xe
ALTER TABLE Cars
ADD
    -- Động cơ & truyền động
    hop_so          NVARCHAR(60) NULL,
    dan_dong        NVARCHAR(30) NULL,

    -- An toàn
    so_tui_khi      INT NULL,
    abs_system      NVARCHAR(10) NULL,
    ebd_system      NVARCHAR(10) NULL,
    hac_system      NVARCHAR(10) NULL,
    camera_lui      NVARCHAR(20) NULL,
    cam_bien_do_xe  NVARCHAR(30) NULL,
    cruise_control  NVARCHAR(30) NULL,

    -- Tiện nghi
    man_hinh        NVARCHAR(30) NULL,
    dieu_hoa        NVARCHAR(40) NULL,
    ghe_dien        NVARCHAR(20) NULL,
    cua_so_troi     NVARCHAR(20) NULL,
    smart_entry     NVARCHAR(10) NULL,
    sac_kd          NVARCHAR(10) NULL;
GO

-- THIẾT LẬP MẶC ĐỊNH CHO TOÀN BỘ XE

UPDATE Cars
SET
    abs_system     = N'Có',
    ebd_system     = N'Có',
    hac_system     = N'Có',
    camera_lui     = N'Có',
    cam_bien_do_xe = N'Trước + Sau',
    cruise_control = N'Có';
GO
-- Xe cao cấp dùng Adaptive Cruise Control
UPDATE Cars
SET cruise_control = N'Adaptive'
WHERE gia >= 1500;
GO

-- UPDATE dữ liệu chi tiết cho từng xe
--MERCEDES-BENZ
UPDATE Cars SET
    hop_so      = N'Tự động 9 cấp',
    dan_dong    = N'RWD',
    so_tui_khi  = 7,
    man_hinh    = N'11.9 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Mercedes C300 AMG';
UPDATE Cars SET
    hop_so      = N'Tự động 9 cấp',
    dan_dong    = N'RWD',
    so_tui_khi  = 9,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Mercedes E300 AMG';

UPDATE Cars SET
    hop_so      = N'Tự động 9 cấp 4MATIC',
    dan_dong    = N'AWD',
    so_tui_khi  = 7,
    man_hinh    = N'11.9 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Mercedes GLC 300 4MATIC';

UPDATE Cars SET
    hop_so      = N'Tự động 7 cấp DCT',
    dan_dong    = N'RWD',
    so_tui_khi  = 6,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Không',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Mercedes AMG GT R';

UPDATE Cars SET
    hop_so      = N'Tự động 9 cấp',
    dan_dong    = N'AWD',
    so_tui_khi  = 12,
    man_hinh    = N'12.8 inch',
    dieu_hoa    = N'4 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Mercedes-Maybach S680';
--AUDI
UPDATE Cars SET
    hop_so      = N'Tự động 7 cấp S-tronic',
    dan_dong    = N'AWD (quattro)',
    so_tui_khi  = 8,
    man_hinh    = N'10.1 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Audi A7 Sportback';

UPDATE Cars SET
    hop_so      = N'Tự động 7 cấp S-tronic',
    dan_dong    = N'AWD (quattro)',
    so_tui_khi  = 8,
    man_hinh    = N'10.1 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Audi A6 45 TFSI';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Tiptronic',
    dan_dong    = N'AWD (quattro)',
    so_tui_khi  = 8,
    man_hinh    = N'10.1 inch',
    dieu_hoa    = N'4 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Audi A8L 55 TFSI';

UPDATE Cars SET
    hop_so      = N'Tự động 7 cấp S-tronic',
    dan_dong    = N'AWD (quattro)',
    so_tui_khi  = 8,
    man_hinh    = N'10.1 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Audi Q5';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'10.1 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Audi e-tron';

-- BMW 
UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Steptronic',
    dan_dong    = N'RWD',
    so_tui_khi  = 6,
    man_hinh    = N'10.25 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'BMW 320i Sport Line';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Steptronic',
    dan_dong    = N'RWD',
    so_tui_khi  = 6,
    man_hinh    = N'10.25 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'BMW 430i Coupe';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Steptronic',
    dan_dong    = N'RWD',
    so_tui_khi  = 6,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'BMW 520i Luxury Line';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp xDrive',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'BMW X5 xDrive40i';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Steptronic',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'4 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'BMW 740i';

-- PORSCHE 
UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp PDK',
    dan_dong    = N'RWD',
    so_tui_khi  = 6,
    man_hinh    = N'10.9 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Không',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Porsche 911 Carrera';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp Tiptronic',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'12.0 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Porsche Cayenne';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp PDK',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'12.0 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Porsche Panamera';

UPDATE Cars SET
    hop_so      = N'Tự động 2 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'10.9 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Porsche Taycan';

-- TOYOTA 
UPDATE Cars SET
    hop_so      = N'CVT Hybrid',
    dan_dong    = N'FWD',
    so_tui_khi  = 7,
    man_hinh    = N'9.0 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Toyota Camry 2.5 HEV';

UPDATE Cars SET
    hop_so      = N'Tự động 6 cấp',
    dan_dong    = N'4WD',
    so_tui_khi  = 7,
    man_hinh    = N'9.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Có',
    cua_so_troi = N'Không',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'Toyota Fortuner Legender';

UPDATE Cars SET
    hop_so      = N'CVT Hybrid',
    dan_dong    = N'FWD',
    so_tui_khi  = 7,
    man_hinh    = N'9.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'Toyota Corolla Cross HEV';

UPDATE Cars SET
    hop_so      = N'Tự động 10 cấp',
    dan_dong    = N'4WD',
    so_tui_khi  = 10,
    man_hinh    = N'9.0 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Toyota Land Cruiser 300';

-- LEXUS
UPDATE Cars SET
    hop_so      = N'CVT Hybrid',
    dan_dong    = N'FWD',
    so_tui_khi  = 8,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Lexus ES300h';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp',
    dan_dong    = N'AWD',
    so_tui_khi  = 10,
    man_hinh    = N'14.0 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Lexus RX350 Premium';

UPDATE Cars SET
    hop_so      = N'Tự động 10 cấp',
    dan_dong    = N'4WD',
    so_tui_khi  = 10,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'4 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Lexus LX600 F Sport';

UPDATE Cars SET
    hop_so      = N'Tự động 10 cấp',
    dan_dong    = N'RWD',
    so_tui_khi  = 10,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'4 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Lexus LS500';

--  KIA
UPDATE Cars SET
    hop_so      = N'Tự động 6 cấp',
    dan_dong    = N'FWD',
    so_tui_khi  = 6,
    man_hinh    = N'8.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Không',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'Kia K3 Premium';

UPDATE Cars SET
    hop_so      = N'Tự động 7 cấp DCT',
    dan_dong    = N'AWD',
    so_tui_khi  = 6,
    man_hinh    = N'10.25 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Kia Sportage 1.6 Turbo';

UPDATE Cars SET
    hop_so      = N'Tự động 8 cấp',
    dan_dong    = N'FWD',
    so_tui_khi  = 7,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'3 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Kia Carnival Signature';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 6,
    man_hinh    = N'12.3 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Kia EV6 GT-Line';

-- HYUNDAI 
UPDATE Cars SET
    hop_so      = N'Tự động 6 cấp',
    dan_dong    = N'FWD',
    so_tui_khi  = 6,
    man_hinh    = N'8.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Không',
    cua_so_troi = N'Không',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'Hyundai Accent 1.5 AT';

UPDATE Cars SET
    hop_so      = N'Tự động 6 cấp Hybrid',
    dan_dong    = N'AWD',
    so_tui_khi  = 7,
    man_hinh    = N'10.25 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Hyundai Santa Fe Hybrid';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 6,
    man_hinh    = N'12.0 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Không',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Hyundai IONIQ 6';

-- FORD
UPDATE Cars SET
    hop_so      = N'Tự động 6 cấp',
    dan_dong    = N'4WD',
    so_tui_khi  = 6,
    man_hinh    = N'8.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Không',
    cua_so_troi = N'Không',
    smart_entry = N'Không',
    sac_kd      = N'Không'
WHERE ten_xe = N'Ford Ranger Wildtrak';

UPDATE Cars SET
    hop_so      = N'Tự động 10 cấp SelectShift',
    dan_dong    = N'4WD',
    so_tui_khi  = 7,
    man_hinh    = N'12.0 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'Ford Everest Titanium';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'15.5 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'Ford Mustang Mach-E';

--VINFAST
UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'FWD',
    so_tui_khi  = 6,
    man_hinh    = N'10.0 inch',
    dieu_hoa    = N'1 vùng tự động',
    ghe_dien    = N'Có',
    cua_so_troi = N'Có',
    smart_entry = N'Có',
    sac_kd      = N'Không'
WHERE ten_xe = N'VinFast VF e34';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'15.6 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'VinFast VF 7 Plus';

UPDATE Cars SET
    hop_so      = N'Tự động 1 cấp (Motor điện)',
    dan_dong    = N'AWD',
    so_tui_khi  = 8,
    man_hinh    = N'15.6 inch',
    dieu_hoa    = N'2 vùng độc lập',
    ghe_dien    = N'Có',
    cua_so_troi = N'Panorama',
    smart_entry = N'Có',
    sac_kd      = N'Có'
WHERE ten_xe = N'VinFast VF 8 Plus';

GO

-- Kiểm tra kết quả
SELECT ten_xe, hop_so, dan_dong, so_tui_khi, man_hinh, dieu_hoa, ghe_dien, cua_so_troi, smart_entry, sac_kd
FROM Cars
ORDER BY thuong_hieu, gia;
GO

SELECT
    ten_xe,
    hop_so,
    dan_dong,
    so_tui_khi,
    abs_system,
    ebd_system,
    hac_system,
    camera_lui,
    cam_bien_do_xe,
    cruise_control,
    man_hinh,
    dieu_hoa,
    ghe_dien,
    cua_so_troi,
    smart_entry,
    sac_kd
FROM Cars
ORDER BY thuong_hieu, gia;


-- Kiem tra du lieu
SELECT COUNT(*) AS tong_so_xe FROM Cars;
SELECT * FROM Cars ORDER BY thuong_hieu, gia;
GO
INSERT INTO Users
(ho_ten, email, mat_khau, vai_tro)
VALUES
(N'Admin','admin@gmail.com', 123456789,'ADMIN');
GO
SELECT*
FROM Users
GO

select *
from Cars
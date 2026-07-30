# carprice360
# CarPrice360 — Hướng dẫn cài đặt & chạy dự án

## Phần 1: Cài đặt phần mềm

- 1.1. Cài đặt JDK 21
- 1.2. Cài đặt SQL Server Express
- 1.3. Cài đặt SSMS (SQL Server Management Studio)
- 1.4. Cài đặt IntelliJ IDEA Community Edition
- 1.5. Cài đặt VS Code
- 1.6. Cài đặt Git Bash

## Phần 2: Tạo cơ sở dữ liệu

### 2.1. Bật TCP/IP và mở cổng 1433

- Trên bàn phím ấn `Windows + R`.
- Gõ `SQLServerManager17.msc` rồi ấn Enter.
- Bảng **SQL Server Configuration Manager** hiện ra.
- Chọn **SQL Server Network Configuration** (bản không có 32bit).
- Chọn **Protocols for SQLEXPRESS**.
- Bên phải, chuột phải vào **TCP/IP** → chọn **Enabled**.
- Double click vào TCP/IP, bảng **TCP/IP Properties** hiện ra.
- Chọn tab **IP Addresses**.
- Lướt xuống cuối cùng, tìm dòng **TCP Dynamic Ports** và xóa hết nội dung trong ô đó.
- Ngay phía trên (dòng **TCP Port**) nhập `1433` rồi ấn OK.
- Quay lại SQL Server Configuration Manager, chọn **SQL Server Services**.
- Chuột phải vào **SQL Server (SQLEXPRESS)** → chọn **Restart** để khởi động lại dịch vụ.

### 2.2. Tải mã nguồn dự án

- Chọn nơi muốn lưu dự án, chuột phải chọn **Git Bash Here**.
- Chạy lệnh sau để clone dự án về máy:

```bash
git clone https://github.com/nguyenhoanganh20050304-ship-it/carprice360.git
```

### 2.3. Kết nối SSMS vào SQL Server

- Mở SSMS, tại mục **Server name** gõ: `localhost\SQLEXPRESS`
- Chọn xác thực **Windows Authentication** rồi bấm **Connect**.

### 2.4. Bật SQL Server Authentication

- Chuột phải vào tên server (gốc cây bên trái SSMS) → **Properties** → **Security**.
- Chọn **"SQL Server and Windows Authentication mode"** → OK.
- Chuột phải vào server → **Restart** để áp dụng thay đổi.

 **Lưu ý:** Bước này bắt buộc — nếu không bật, backend sẽ không đăng nhập được bằng tài khoản `carapp` tạo ở bước 2.6.

### 2.5. Khôi phục dữ liệu từ file backup (.bak)

- Trong thư mục dự án vừa clone, tìm file `carprice360db.bak`.
- Copy file này vào thư mục backup mặc định của SQL Server, ví dụ:
  C:\Program Files\Microsoft SQL Server\MSSQL17. SQLEXPRESS\MSSQL\Backup
- Trong SSMS, chuột phải vào mục **Databases** → chọn **Restore Database…**
- Trong bảng Restore Database, chọn nguồn là **Device**, bấm vào ô "…" bên phải.
- Bảng **Select backup devices** hiện ra → bấm **Add**.
- Trỏ tới đường dẫn vừa copy ở trên, chọn file `carprice360.bak` → OK.
- Bảng **Backup media** hiện ra đường dẫn file → chọn nó → OK để bắt đầu restore.
- Đợi SSMS restore xong (thanh tiến trình hoàn tất là được).

### 2.6. Tạo tài khoản riêng cho backend
- Trong SSMS, chọn **New Query** và chạy lần lượt các câu lệnh sau:

```sql
CREATE LOGIN carapp WITH PASSWORD = 'CarPrice360!23';
USE carprice360db;
CREATE USER carapp FOR LOGIN carapp;
ALTER ROLE db_owner ADD MEMBER carapp;
```

### 2.7. Kích hoạt tài khoản quản trị "sa"

- Trong SSMS, chọn **New Query** và chạy lần lượt các câu lệnh sau:

```sql
ALTER LOGIN sa WITH PASSWORD = '123456';
GO
ALTER LOGIN sa ENABLE;
GO
```

## Phần 3: Chạy Backend bằng IntelliJ

### 3.1. Mở dự án

- Mở IntelliJ IDEA → màn hình chào → **Open**.
- Trỏ vào thư mục `backend` (thư mục chứa file `pom.xml`) → OK.
- Nếu hỏi "Trust this project?" → chọn **Trust Project**.
- Đợi IntelliJ tự tải Maven dependencies (cần internet, lần đầu mất 3–10 phút — theo dõi thanh tiến trình ở góc dưới phải).

### 3.2. Chạy backend

- Mở file `Carprice360Application.java`.
- Bấm biểu tượng tam giác xanh (▶) để chạy dự án.

## Phần 4: Chạy Frontend bằng VS Code

### 4.1. Mở giao diện người dùng của dự án

- Mở VS Code → File → Open Folder → chọn thư mục `frontend`.

### 4.2. Cài đặt tiện ích mở rộng Live Server

- Vào tab Extensions (`Ctrl+Shift+X`).
- Gõ tìm "Live Server" (tác giả Ritwick Dey) → Install.

### 4.3. Chạy frontend

- Ở khung Explorer bên trái, chuột phải vào file `index.html` → chọn **"Open with Live Server"**.

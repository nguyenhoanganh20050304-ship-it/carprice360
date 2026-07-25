// KHỞI TẠO BIẾN TOÀN CỤC VÀ CẤU HÌNH
const API = 'http://localhost:8080/api';
let allCars = [];
let currentUser = null;

// Bản đồ Emoji đại diện cho các loại nhiên liệu xe
const fuelEmoji = { 
  'Xăng': '⛽', 
  'Điện': '⚡', 
  'Hybrid': '🌿', 
  'Dầu': '🛢️' 
};

// Đường dẫn ảnh logo của các hãng xe tương ứng
const brandLogos = {
  'Audi':     'image/cars/audi/logo/logo-audi.png',
  'BMW':      'image/cars/bmw/logo/logo-bmw.png',
  'Ford':     'image/cars/ford/logo/logo-ford.png',
  'Hyundai':  'image/cars/hyundai/logo/logo-hyundai.png',
  'Kia':      'image/cars/kia/logo/logo-kia.png',
  'Lexus':    'image/cars/lexus/logo/logo-lexus.png',
  'Mercedes-Benz': 'image/cars/mercedes-benz/logo/logo-mercedes-benz.png',
  'Porsche':  'image/cars/porsche/logo/logo-porsche.png',
  'Toyota':   'image/cars/toyota/logo/logo-toyota.png',
  'VinFast':  'image/cars/vinFast/logo/logo-vinfast.png',
};


// KHỞI TẠO SỰ KIỆN KHI TẢI TRANG
// Lắng nghe sự kiện cuộn mượt cho nút "Trang chủ" ngay khi đọc file script
const buttonMenus = document.querySelectorAll('nav a, header a');
buttonMenus.forEach(nut => {
  if (nut.textContent.trim() === "Trang chủ") {
    nut.addEventListener('click', function(e) {
      e.preventDefault(); 
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    });
  }
});

// Thiết lập trạng thái ban đầu sau khi cấu trúc DOM hoàn thành tải
document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('nav a');
  const logoHome = document.getElementById('logo-home');

  // Xử lý chuyển trạng thái kích hoạt (active) cho các tab menu điều hướng
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
        e.preventDefault();
      }
      menuItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Đưa tab active về mặc định (Trang chủ) khi bấm vào Logo
  if (logoHome) {
    logoHome.addEventListener('click', function(e) {
      menuItems.forEach(nav => nav.classList.remove('active'));
      if (menuItems.length > 0) menuItems[0].classList.add('active');
    });
  }

  // Bắt sự kiện phím Enter trên ô tìm kiếm hoặc xóa trạng thái lỗi khi người dùng gõ
  const inputEl = document.getElementById('searchInput');
  if (inputEl) {
    inputEl.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') handleSearchSubmit();
    });
    inputEl.addEventListener('input', function() {
      inputEl.classList.remove('error');
    });
  }

  // Xóa báo lỗi viền đỏ của thanh tìm kiếm khi người dùng chuyển đổi các thẻ select bộ lọc
  ['filterBrand', 'filterType', 'filterFuel', 'filterPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', function() {
        const si = document.getElementById('searchInput');
        if (si) si.classList.remove('error');
      });
    }
  });
});


// LOGIC TÌM KIẾM, LỌC VÀ SẮP XẾP DỮ LIỆU
// Xử lý sự kiện khi người dùng nhấn nút Tìm kiếm
function handleSearchSubmit() {
  const searchInput = document.getElementById('searchInput');
  const keyword = searchInput ? searchInput.value.trim() : '';
  const brand = document.getElementById('filterBrand').value;
  const type = document.getElementById('filterType').value;
  const fuel = document.getElementById('filterFuel').value;
  const price = document.getElementById('filterPrice').value;

  const hasAnyFilter = keyword !== '' || brand !== '' || type !== '' || fuel !== '' || price !== '';

  // Chưa nhập/chọn gì mà bấm tìm kiếm -> báo đỏ để nhắc người dùng nhập
  if (!hasAnyFilter) {
    searchInput.classList.remove('error');
    void searchInput.offsetWidth; // reset animation nếu bấm nhiều lần liên tiếp
    searchInput.classList.add('error');
    searchInput.focus();
    return;
  }

  searchInput.classList.remove('error');
  filterCars();
  
  // Cuộn mượt màn hình xuống danh sách xe sau khi lọc kết quả
  const carsSection = document.getElementById('cars');
  if (carsSection) {
    const yOffset = -74;
    const y = carsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

}

// Hàm lọc lõi: Tổng hợp điều kiện lọc, thực hiện Sort và gọi hàm Render kết quả
function filterCars() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const brand = document.getElementById('filterBrand').value;
  const type = document.getElementById('filterType').value;
  const fuel = document.getElementById('filterFuel').value;
  const price = document.getElementById('filterPrice').value;
  const sortMode = document.getElementById("sortSelect").value;

  // Tiến hành lọc mảng dữ liệu dựa trên các tiêu chí được chọn
  let filtered = allCars.filter(car => {
    const matchKey = !keyword || car.tenXe.toLowerCase().includes(keyword) || car.thuongHieu.toLowerCase().includes(keyword);
    const matchBrand = !brand || car.thuongHieu === brand;
    const matchType = !type || car.loaiXe === type;
    const matchFuel = !fuel || car.nhienLieu === fuel;
    let matchPrice = true;
    if (price) {
      const [min, max] = price.split('-').map(Number);
      matchPrice = car.gia >= min && car.gia <= max;
    }
    return matchKey && matchBrand && matchType && matchFuel && matchPrice;
  });

  // Tiến hành phân loại sắp xếp mảng kết quả sau khi lọc theo yêu cầu
  if (sortMode === "brand") {
    filtered.sort((a, b) => {
        const brand = a.thuongHieu.localeCompare(b.thuongHieu, "vi");
        if (brand !== 0) return brand;
        return a.tenXe.localeCompare(b.tenXe, "vi");
    });
  }
  if (sortMode === "price-asc") {
      filtered.sort((a, b) => a.gia - b.gia);
  }
  if (sortMode === "price-desc") {
      filtered.sort((a, b) => b.gia - a.gia);
  }
  if (sortMode === "name") {
      filtered.sort((a, b) => a.tenXe.localeCompare(b.tenXe, "vi"));
  }
  
  // Đưa mảng đã xử lý ra giao diện người dùng
  renderCars(filtered);
}

// Lọc nhanh danh sách xe khi người dùng kích chọn vào thẻ thương hiệu cụ thể
function filterByBrand(brand) {
  document.getElementById('filterBrand').value = brand;
  document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
  const menuItems = document.querySelectorAll('nav a');
  if(menuItems.length > 1) {
    menuItems.forEach(nav => nav.classList.remove('active'));
    menuItems[1].classList.add('active');
  }
  filterCars();
}


// TẢI DỮ LIỆU TỪ API VÀ RENDER GIAO DIỆN
async function loadCars() {
  try {
    const res = await fetch(`${API}/cars`);
    allCars = await res.json();
    document.getElementById('totalCars').textContent = allCars.length;
    renderCars(allCars);
    renderBrands(allCars);
  } catch (e) {
    document.getElementById('carGrid').innerHTML =
      '<div class="loading" style="color:#c00">⚠️ Không thể kết nối server. Hãy đảm bảo backend đang chạy.</div>';
  }
}

// Trả về chuỗi đường dẫn ảnh
function getCarImage(car) {
  return car && car.id ? `${API}/cars/${car.id}/images/1` : '';
}

// Định dạng tiền tệ từ dạng con số thô sang chuỗi hiển thị tỷ/triệu dễ nhìn
function formatPrice(gia) {
  if (gia >= 1000) return (gia / 1000).toFixed(gia % 1000 === 0 ? 0 : 1) + ' tỷ';
  return gia + ' triệu';
}

// Đổ danh sách dữ liệu xe lên lưới hiển thị (Car Grid HTML)
function renderCars(cars) {
  const grid = document.getElementById('carGrid');
  document.getElementById('resultCount').textContent = `${cars.length} xe được tìm thấy`;
  
  if (cars.length === 0) {
    grid.innerHTML = '<div class="loading">🔍 Không tìm thấy xe phù hợp</div>';
    return;
  }
  
  grid.innerHTML = cars.map(car => `
    <div class="car-card" onclick="location.href='cardetail.html?id=${car.id}'">
      <div class="car-img">
        <img src="${getCarImage(car)}" alt="${car.tenXe}" onerror="this.style.display='none'">
      </div>
      <div class="car-body">
        <div class="car-brand">${car.thuongHieu}</div>
        <div class="car-name">${car.tenXe}</div>
        <div class="car-price">${formatPrice(car.gia)}</div>
        <div class="car-specs">
          <span class="spec-tag">${car.loaiXe}</span>
          <span class="spec-tag fuel-${car.nhienLieu === 'Điện' ? 'dien' : car.nhienLieu === 'Hybrid' ? 'hybrid' : ''}">
            ${fuelEmoji[car.nhienLieu] || ''} ${car.nhienLieu}
          </span>
          <span class="spec-tag">👥 ${car.soCho} chỗ</span>
          <span class="spec-tag">⚡ ${car.maLuc} HP</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Kết xuất danh sách các Thương hiệu duy nhất hiện có và cập nhật bộ đếm Thống kê
function renderBrands(cars) {
  const brands = [...new Set(cars.map(c => c.thuongHieu))].sort();
  const grid = document.getElementById('brandsGrid');
  if (!grid) return;
  
  grid.innerHTML = brands.map(brand => `
    <div class="brand-card" onclick="filterByBrand('${brand}')">
      ${brandLogos[brand]
        ? `<img src="${brandLogos[brand]}" alt="${brand}" onerror="this.style.display='none'">`
        : `<div style="font-size:28px">🚗</div>`}
      <span>${brand}</span>
    </div>
  `).join('');
  
  const fuels = [...new Set(cars.map(c => c.nhienLieu))];
  const types = [...new Set(cars.map(c => c.loaiXe))];
  
  const elBrands = document.getElementById('totalBrands');
  const elFuels  = document.getElementById('totalFuels');
  const elTypes  = document.getElementById('totalTypes');
  
  if (elBrands) elBrands.textContent = brands.length;
  if (elFuels)  elFuels.textContent  = fuels.length;
  if (elTypes)  elTypes.textContent  = types.length;
}


// XỬ LÝ XÁC THỰC VÀ HỘP THOẠI MODAL
// Mở hộp thoại Modal chỉ định và làm trống form dữ liệu cũ
function openModal(type) {
  if (type === 'login') {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginMsg').className = 'msg';
    document.getElementById('loginMsg').textContent = '';
  }  
  if (type === 'register') {
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';    
    const regMsg = document.getElementById('registerMsg');
    regMsg.className = 'msg'; 
    regMsg.textContent = '';
  }
  document.getElementById(type + 'Modal').classList.add('open');
}

// Đóng hộp thoại Modal tương ứng
function closeModal(type) { 
  document.getElementById(type + 'Modal').classList.remove('open'); 
}

// Chuyển đổi nhanh qua lại giữa cửa sổ Đăng ký và Đăng nhập
function switchModal(from, to) { 
  closeModal(from); 
  openModal(to); 
}

// Thực hiện yêu cầu Đăng nhập tài khoản qua API hệ thống
async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const matKhau = document.getElementById('loginPass').value;
  const msg = document.getElementById('loginMsg');
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, matKhau })
    });
    const data = await res.json();
    if (data.success) {
      if (data.vaiTro === "ADMIN") {
        window.location.href = "admin.html";
        return;
      }
      currentUser = data;
      localStorage.setItem("loggedInUser", JSON.stringify(data));
      closeModal('login');
      document.getElementById('headerActions').innerHTML =
        `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${data.hoTen}</span>
         <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
    } else {
      msg.className = 'msg error';
      msg.textContent = data.message;
    }
  } catch (error) {
    msg.className = 'msg error';
    msg.textContent = 'Lỗi kết nối server!';
  }
}

// Thực hiện gửi thông tin Đăng ký tài khoản người dùng mới
async function doRegister() {
  const hoTen = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const matKhau = document.getElementById('regPass').value;
  const msg = document.getElementById('registerMsg');
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hoTen, email, matKhau })
    });
    const data = await res.json();
    if (data.success) {
      msg.className = 'msg success'; 
      msg.textContent = 'Đăng ký thành công! Đang chuyển đến đăng nhập...';
      setTimeout(() => switchModal('register', 'login'), 1500);
    } else {
      msg.className = 'msg error'; 
      msg.textContent = data.message;
    }
  } catch { 
    msg.className = 'msg error'; 
    msg.textContent = 'Lỗi kết nối server!'; 
  }
}

// Đăng xuất tài khoản, giải phóng bộ nhớ và làm mới trạng thái Header khu vực đăng nhập
function logout() {
  currentUser = null;
  localStorage.removeItem("loggedInUser");
  document.getElementById('headerActions').innerHTML =
    `<a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
     <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
}

// Tự động hồi phục trạng thái phiên đăng nhập nếu người dùng đã đăng nhập trước đó
function restoreSession() {
  const saved = localStorage.getItem("loggedInUser");
  if (!saved) return;
  currentUser = JSON.parse(saved);
  document.getElementById('headerActions').innerHTML = `
    <span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
    <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
}

// Bắt sự kiện click ra vùng nền đen bên ngoài để tắt các cửa sổ popup (Modal)
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { 
    if (e.target === el) el.classList.remove('open'); 
  });
});

// Cuộn màn hình một cách mượt mà tới vị trí của ID phần tử được truyền vào
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -80; 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
}

// KÍCH HOẠT HỆ THỐNG BAN ĐẦU
restoreSession();
loadCars();
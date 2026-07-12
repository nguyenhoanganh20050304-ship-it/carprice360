// Cấu hình API và biến toàn cục
const API = 'http://localhost:8080/api';
let currentUser = null;
const LS_KEY = 'savedCars';

// Quản lý Modal (Đóng / Mở / Chuyển đổi)
function openModal(type) { document.getElementById(type + 'Modal').classList.add('open'); }
function closeModal(type) { document.getElementById(type + 'Modal').classList.remove('open'); }
function switchModal(from, to) { closeModal(from); openModal(to); }

// Tự động khôi phục phiên đăng nhập khi tải lại trang
function restoreSession() {
  const saved = localStorage.getItem('loggedInUser');
  if (!saved) return;
  currentUser = JSON.parse(saved);
  updateHeaderUI();
}

// Cập nhật trạng thái thanh điều hướng (Header)
function updateHeaderUI() {
  const el = document.getElementById('headerActions');
  if (!el) return;
  if (currentUser) {
    el.innerHTML = `
      <span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
      <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
  } else {
    el.innerHTML = `
      <a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
      <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
  }
}

// Xử lý đăng nhập hệ thống
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
      if (data.vaiTro === 'ADMIN') {
        window.location.href = 'admin.html';
        return;
      }
      currentUser = data;
      localStorage.setItem('loggedInUser', JSON.stringify(data));
      closeModal('login');
      updateHeaderUI();
      showToast(`👋 Xin chào, ${data.hoTen}!`);
      renderPage();
    } else {
      msg.className = 'msg error'; msg.textContent = data.message;
    }
  } catch { msg.className = 'msg error'; msg.textContent = 'Lỗi kết nối server!'; }
}

// Xử lý đăng ký tài khoản mới
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
      msg.className = 'msg success'; msg.textContent = 'Đăng ký thành công!';
      setTimeout(() => switchModal('register', 'login'), 1500);
    } else {
      msg.className = 'msg error'; msg.textContent = data.message;
    }
  } catch { msg.className = 'msg error'; msg.textContent = 'Lỗi kết nối server!'; }
}

// Xử lý đăng xuất tài khoản
function logout() {
  currentUser = null;
  localStorage.removeItem('loggedInUser');
  updateHeaderUI();
  showToast('👋 Đã đăng xuất');
  renderPage();
}

// Đóng modal khi click ra vùng ngoài (overlay)
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});

// Hiển thị thông báo Toast nhanh
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Quản lý hộp thoại xác nhận (Confirm Dialog)
function openConfirm() { document.getElementById('confirmOverlay').classList.add('open'); }
function closeConfirm() { document.getElementById('confirmOverlay').classList.remove('open'); }
document.getElementById('confirmOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('confirmOverlay')) closeConfirm();
});

// Lấy danh sách xe đã lưu từ LocalStorage
function getSavedCars() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function getCarImage(car, index = 1) {
  if (!car || !car.id) return '';
  return `${API}/cars/${car.id}/images/${index}`;
}

// Xóa một xe khỏi LocalStorage dựa trên ID
function removeSavedCar(carId) {
  const cars = getSavedCars().filter(c => c.id !== carId);
  localStorage.setItem(LS_KEY, JSON.stringify(cars));
}

// Xóa toàn bộ danh sách xe đã lưu
function clearAll() {
  localStorage.removeItem(LS_KEY);
  closeConfirm();
  showToast('🗑️ Đã xóa toàn bộ xe đã lưu');
  renderPage();
}

// Định dạng giá tiền hiển thị (Triệu / Tỷ)
function formatPrice(gia) {
  if (gia >= 1000) return (gia / 1000).toFixed(gia % 1000 === 0 ? 0 : 1) + ' tỷ';
  return gia + ' triệu';
}

// Lấy Class CSS tương ứng với loại nhiên liệu
function getFuelClass(nhienLieu) {
  if (nhienLieu === 'Điện') return 'fuel-dien';
  if (nhienLieu === 'Hybrid') return 'fuel-hybrid';
  return '';
}

// Lấy biểu tượng emoji cho loại nhiên liệu
function getFuelIcon(nhienLieu) {
  const icons = { 'Xăng': '⛽', 'Điện': '⚡', 'Hybrid': '🌿', 'Dầu': '🛢️' };
  return icons[nhienLieu] || '⛽';
}

// Sắp xếp danh sách xe theo bộ lọc
function sortCars(cars, mode) {
  const arr = [...cars];
  if (mode === 'price-asc') return arr.sort((a, b) => a.gia - b.gia);
  if (mode === 'price-desc') return arr.sort((a, b) => b.gia - a.gia);
  if (mode === 'name-asc') return arr.sort((a, b) => a.tenXe.localeCompare(b.tenXe, 'vi'));
  return arr.reverse();
}

// Xử lý sự kiện khi nhấn nút bỏ lưu xe
function handleRemove(e, carId, carName) {
  e.stopPropagation();
  removeSavedCar(carId);
  showToast(`🔖 Đã bỏ lưu "${carName}"`);
  renderPage();
}

// Tạo cấu trúc HTML cho một thẻ xe (Card)
function renderCard(car) {
  const imgSrc = car.id ? `${API}/cars/${car.id}/images/1` : '';
  const fuelClass = getFuelClass(car.nhienLieu);
  const fuelIcon = getFuelIcon(car.nhienLieu);
  return `
    <div class="car-card" onclick="location.href='cardetail.html?id=${car.id}'">
      <div class="car-img-wrap">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${car.tenXe}"
               onerror="this.parentElement.innerHTML='<div class=\\'car-img-placeholder\\'>🚗</div>'">`
          : '<div class="car-img-placeholder">🚗</div>'
        }
        <button class="btn-remove" title="Bỏ lưu"
          onclick="handleRemove(event, ${car.id}, '${car.tenXe.replace(/'/g, "\\'")}')">×</button>
        <div class="car-brand-badge">${car.thuongHieu}</div>
      </div>
      <div class="car-body">
        <div class="car-name">${car.tenXe}</div>
        <div class="car-price">${formatPrice(car.gia)}</div>
        <div class="car-specs">
          <span class="spec-tag ${fuelClass}">${fuelIcon} ${car.nhienLieu}</span>
          <span class="spec-tag">👥 ${car.soCho} chỗ</span>
          <span class="spec-tag">⚡ ${car.maLuc} HP</span>
          ${car.hopSo ? `<span class="spec-tag">⚙️ ${car.hopSo}</span>` : ''}
        </div>
        <button class="btn-view-detail" onclick="location.href='cardetail.html?id=${car.id}'">
          Xem chi tiết →
        </button>
      </div>
    </div>
  `;
}

// Tạo giao diện chính của toàn bộ trang
function renderPage() {
  const container = document.getElementById('mainContent');

  if (!currentUser) {
    container.innerHTML = `
      <div class="login-required">
        <div class="lr-icon">🔐</div>
        <h2>Đăng nhập để xem xe đã lưu</h2>
        <p>Bạn cần đăng nhập để xem và quản lý danh sách xe yêu thích của mình.</p>
        <button class="btn-do-login" onclick="openModal('login')">Đăng nhập ngay</button>
      </div>`;
    return;
  }

  const sortMode = document.getElementById('sortSelect')
    ? document.getElementById('sortSelect').value
    : 'newest';

  let cars = getSavedCars();
  cars = cars.filter(c => !c._userId || c._userId === currentUser.userId);
  const total = cars.length;
  const sorted = sortCars(cars, sortMode);

  container.innerHTML = `
    <div class="page-title-row">
      <div class="page-title">
        <div class="title-icon">❤️</div>
        <div>
          Xe đã lưu
          <div style="font-size:14px;font-weight:500;color:var(--muted);margin-top:2px">
            Danh sách yêu thích của bạn
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="saved-count">${total} xe</span>
        ${total > 0 ? `<button class="btn-clear-all" onclick="openConfirm()">🗑️ Xóa tất cả</button>` : ''}
      </div>
    </div>

    ${total > 0 ? `
    <div class="filter-bar">
      <label>Sắp xếp theo:</label>
      <select class="filter-select" id="sortSelect" onchange="renderPage()">
        <option value="newest" ${sortMode === 'newest' ? 'selected' : ''}>Mới lưu nhất</option>
        <option value="price-asc" ${sortMode === 'price-asc' ? 'selected' : ''}>Giá tăng dần</option>
        <option value="price-desc" ${sortMode === 'price-desc' ? 'selected' : ''}>Giá giảm dần</option>
        <option value="name-asc" ${sortMode === 'name-asc' ? 'selected' : ''}>Tên A → Z</option>
      </select>
    </div>` : ''}
    <div class="cars-grid">
      ${total === 0
        ? `<div class="empty-state">
            <div class="empty-icon">🔖</div>
            <div class="empty-title">Chưa có xe nào được lưu</div>
            <div class="empty-sub">
              Bấm vào nút <strong>Lưu xe</strong> ở trang chi tiết để thêm xe vào<br>danh sách yêu thích của bạn.
            </div>
            <a href="index.html" class="btn-go-home">🚗 Khám phá xe ngay</a>
          </div>`
        : sorted.map(renderCard).join('')
      }
    </div>
  `;
}

// Khởi chạy ứng dụng
restoreSession();
renderPage();
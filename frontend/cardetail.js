
const API = 'http://localhost:8080/api';
let currentUser = null;
let currentCar = null;
let isSaved = false;
function restoreSession() {
  const saved = localStorage.getItem("loggedInUser");
  if (!saved) return;
  currentUser = JSON.parse(saved);
  const el = document.getElementById('headerActions');
  if (el) {
    el.innerHTML = `
      <span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
      <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
  }
}

// lấy hinhAnh trực tiếp từ API
function getCarImage(car, index) {
  if (!car || !car.hinhAnh) return '';
  return car.hinhAnh + index + '.png';
}
const TAB_IMAGES = {
  'ngoai-that': ['1.png', '2.png', '3.png'],
  'noi-that':   ['4.png', '5.png'],
};
/* Hàm hỗ trợ (Helper Functions) */
function formatPrice(gia) {
  if (gia >= 1000) return (gia / 1000).toFixed(gia % 1000 === 0 ? 0 : 1) + ' tỷ';
  return gia + ' triệu';
}
function getPriceRange(price) {
  if (price < 1000) return "0-1000";
  if (price < 2000) return "1000-2000";
  if (price < 5000) return "2000-5000";
  return "5000-99999";
}
function formatPriceRange(gia) {
  const low = gia;
  const high = Math.round(gia * 1.22);
  if (low >= 1000) {
    const lo = (low / 1000).toFixed(1);
    const hi = (high / 1000).toFixed(1);
    return `${lo} tỷ - ${hi} tỷ`;
  }
  return `${low} triệu - ${high} triệu`;
}
function calcOnRoad(gia) {
  const lr = Math.round(gia * 1.10);
  return formatPrice(lr);
}
function calcMonthly(gia) {
  const principal = gia * 1000000 * 0.7;
  const r = 0.09 / 12;
  const n = 60;
  const monthly = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const inMillion = monthly / 1000000;
  return Math.round(inMillion) + ' triệu/tháng';
}
function getEngineDesc(maLuc, nhienLieu) {
  if (nhienLieu === 'Điện') return 'Motor điện';
  if (nhienLieu === 'Hybrid') {
    if (maLuc <= 200) return '1.8L Hybrid';
    return '2.5L Hybrid';
  }
  if (nhienLieu === 'Dầu') return '2.2L CRDi Diesel'; 
  if (maLuc <= 130) return '1.4L I4';
  if (maLuc <= 160) return '1.5L I4';
  if (maLuc <= 200) return '1.6L Turbo I4';
  if (maLuc <= 260) return '2.0L Turbo I4';
  if (maLuc <= 340) return '3.0L V6';
  if (maLuc <= 450) return '4.0L V8 Turbo';
  return '6.0L V12';
}

function getFuelIcon(nhienLieu) {
  const icons = { 'Xăng': '⛽', 'Điện': '⚡', 'Hybrid': '🌿', 'Dầu': '🛢️' };
  return icons[nhienLieu] || '⛽';
}
/* Hiển thị chi tiết xe (Main Render) */
function renderCarDetail(car) {
  currentCar = car;
  document.getElementById('bcBrand').innerHTML =
    `<a href="index.html" style="color:var(--muted);text-decoration:none">${car.thuongHieu}</a>`;
  document.getElementById('bcName').textContent = car.tenXe;
  document.title = `${car.tenXe} - CarPrice360`;
  const baseImg = (car.hinhAnh || '');
  const imgSrc = baseImg ? baseImg + '1.png' : '';
  const engineDesc = getEngineDesc(car.maLuc, car.nhienLieu);
  const airbags = car.soTuiKhi;
  const fuelIcon = getFuelIcon(car.nhienLieu);
  const consumption = car.nhienLieu === 'Điện' ? 'Điện' : `${car.tieuThu}L/100KM`;
  document.getElementById('pageContent').innerHTML = `
    <div class="detail-wrapper">
      <div class="gallery-panel">
        <div class="gallery-main">
          <img src="${imgSrc}" alt="${car.tenXe}" id="mainImg"
               onerror="this.style.display='none'">
          <button class="gallery-arrow prev" onclick="prevImg()">‹</button>
          <button class="gallery-arrow next" onclick="nextImg()">›</button>
          <div class="gallery-dots" id="galleryDots"></div>
        </div>
        <div class="gallery-tabs">
          <div class="gallery-tab active" onclick="switchGalleryTab(this, 'ngoai-that')">
            <span class="tab-icon">🚘</span>
            <span>Ngoại thất</span>
          </div>
          <div class="gallery-tab" onclick="switchGalleryTab(this, 'noi-that')">
            <span class="tab-icon">🪑</span>
            <span>Nội thất</span>
          </div>
        </div>
      </div>
      <div class="info-panel">
        <div class="car-brand-badge">${car.thuongHieu}</div>
        <h1 class="car-title">${car.tenXe}</h1>
        <div class="price-main">${formatPriceRange(car.gia)}</div>
        <div class="price-boxes">
          <div class="price-box">
            <div class="price-box-label">Trả hàng tháng chỉ từ <span>(*)</span></div>
            <div class="price-box-value">${calcMonthly(car.gia)}</div>
            <span class="price-box-arrow">›</span>
          </div>
          <div class="price-box">
            <div class="price-box-label">Giá lăn bánh chỉ từ <span>(*)</span></div>
            <div class="price-box-value">${calcOnRoad(car.gia)}</div>
            <span class="price-box-arrow">›</span>
          </div>
        </div>
        <div class="quick-specs">
          <div class="qspec">
            <div class="qspec-icon">${fuelIcon}</div>
            <div>
              <div class="qspec-label">Loại nhiên liệu</div>
              <div class="qspec-value">${car.nhienLieu}</div>
            </div>
          </div>
          <div class="qspec">
            <div class="qspec-icon">📊</div>
            <div>
              <div class="qspec-label">Mức tiêu thụ</div>
              <div class="qspec-value">${consumption}</div>
            </div>
          </div>
          <div class="qspec">
            <div class="qspec-icon">🔧</div>
            <div>
              <div class="qspec-label">Động cơ</div>
              <div class="qspec-value">${engineDesc}</div>
            </div>
          </div>
          <div class="qspec">
            <div class="qspec-icon">⚙️</div>
            <div>
              <div class="qspec-label">Hộp số</div>
              <div class="qspec-value">${car.hopSo}</div>
            </div>
          </div>
          <div class="qspec">
            <div class="qspec-icon">👥</div>
            <div>
              <div class="qspec-label">Số chỗ</div>
              <div class="qspec-value">${car.soCho} chỗ</div>
            </div>
          </div>
          <div class="qspec">
            <div class="qspec-icon">🛡️</div>
            <div>
              <div class="qspec-label">Số túi khí</div>
              <div class="qspec-value">${airbags}</div>
            </div>
          </div>
        </div>
        <button class="see-specs" onclick="scrollToTab('specs')" style="margin-top: 16px;">
          Xem chi tiết thông số ↓
        </button>
      </div>
    </div>
    <div class="sections-wrapper">
      <div class="tab-nav">
        <button class="tab-btn active" onclick="switchTab(this,'tab-specs')" id="btn-tab-specs">📋 Thông số kỹ thuật</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-similar')" id="btn-tab-similar">🚗 Xe tương tự</button>
      </div>
      <div class="tab-content active" id="tab-specs">
        <div class="spec-section-title">📌 Thông tin chung</div>
        <table class="spec-table">
          <tr><td>Tên xe</td><td>${car.tenXe}</td></tr>
          <tr><td>Thương hiệu</td><td>${car.thuongHieu}</td></tr>
          <tr><td>Dòng xe</td><td>${car.loaiXe}</td></tr>
          <tr><td>Giá niêm yết</td><td style="color:var(--red);font-size:16px">${formatPrice(car.gia)}</td></tr>
          <tr><td>Giá lăn bánh (ước tính)</td><td>${calcOnRoad(car.gia)}</td></tr>
          <tr><td>Số chỗ ngồi</td><td>${car.soCho} chỗ</td></tr>
        </table>
        <div class="spec-section-title">🔧 Động cơ & Truyền động</div>
        <table class="spec-table">
          <tr><td>Loại động cơ</td><td>${engineDesc}</td></tr>
          <tr><td>Công suất tối đa</td><td>${car.maLuc} HP</td></tr>
          <tr><td>Nhiên liệu</td><td>${car.nhienLieu}</td></tr>
          <tr><td>Mức tiêu hao nhiên liệu</td><td>${consumption}</td></tr>
          <tr><td>Hộp số</td><td>${car.hopSo}</td></tr>
          <tr><td>Dẫn động</td><td>${car.danDong}</td></tr>
        </table>
        <div class="spec-section-title">🛡️ An toàn</div>
        <table class="spec-table">
        <tr><td>Số túi khí</td><td>${car.soTuiKhi}</td></tr>
        <tr><td>Phanh ABS</td><td>${car.absSystem}</td></tr>
        <tr><td>Phân phối lực phanh điện tử (EBD)</td><td>${car.ebdSystem}</td></tr>
        <tr><td>Hỗ trợ khởi hành ngang dốc (HAC)</td><td>${car.hacSystem}</td></tr>
        <tr><td>Camera lùi</td><td>${car.cameraLui}</td></tr>
        <tr><td>Cảm biến đỗ xe</td><td>${car.camBienDoXe}</td></tr>
        <tr><td>Kiểm soát hành trình (Cruise Control)</td><td>${car.cruiseControl}</td></tr>
        </table>
        <div class="spec-section-title">✨ Tiện nghi</div>
        <table class="spec-table">
         <tr><td>Màn hình trung tâm</td><td>${car.manHinh}</td></tr>
         <tr><td>Điều hòa</td><td>${car.dieuHoa}</td></tr>
         <tr><td>Ghế lái chỉnh điện</td><td>${car.gheDien}</td></tr>
         <tr><td>Sạc không dây</td><td>${car.sacKd}</td></tr>
         <tr><td>Apple CarPlay / Android Auto</td><td>Có</td></tr>
         <tr><td>Mở cửa không cần chìa (Smart Entry)</td><td>${car.smartEntry}</td></tr>
         <tr><td>Cửa sổ trời</td><td>${car.cuaSoTroi}</td></tr>
        </table>
      </div>
      <div class="tab-content" id="tab-similar">
        <div class="car-grid-sm" id="similarGrid">
          <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">
            <div class="spinner" style="margin:0 auto 12px"></div>
            Đang tải xe tương tự...
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('stickyBar').style.display = 'flex';
  currentTabKey = 'ngoai-that';
  currentImgIndex = 0;
  renderDots();
  // Kiểm tra xe này đã được lưu chưa (nếu đã đăng nhập)
  if (currentUser) {
    updateSaveButton(checkIfSaved(car.id));
  }
}
/* Xe tương tự (Similar Cars) */
async function loadSimilarCars(car) {
  try {
    const res = await fetch(`${API}/cars/brand?name=${car.thuongHieu}`);
    let cars = await res.json();
    cars = cars.filter(c => c.id !== car.id).slice(0, 4);
    const grid = document.getElementById('similarGrid');
    if (!grid) return;
    if (cars.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px">Không có xe tương tự</div>';
      return;
    }
    grid.innerHTML = cars.map(c => `
      <div class="car-card-sm" onclick="location.href='cardetail.html?id=${c.id}'">
        <img src="${(c.hinhAnh || '') + '1.png'}"
             alt="${c.tenXe}"
             onerror="this.style.fontSize='48px';this.style.display='flex';this.style.alignItems='center';this.style.justifyContent='center';this.alt='🚗'">
        <div class="cc-body">
          <div class="cc-brand">${c.thuongHieu}</div>
          <div class="cc-name">${c.tenXe}</div>
          <div class="cc-price">${formatPrice(c.gia)}</div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.warn('Không tải được xe tương tự');
  }
}
/* Điều khiển thư viện ảnh (Gallery Controls) */
let currentImgIndex = 0;
let currentTabKey = 'ngoai-that';
function getImgList() {
  return TAB_IMAGES[currentTabKey] || ['1.png'];
}
function renderDots() {
  const list = getImgList();
  const dotsEl = document.getElementById('galleryDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = list.map((_, i) =>
    `<div class="dot ${i === currentImgIndex ? 'active' : ''}" onclick="setImg(${i})"></div>`
  ).join('');
}
function updateGalleryImg() {
  const img = document.getElementById('mainImg');
  if (!img || !currentCar) return;
  const base = currentCar.hinhAnh || '';
  const list = getImgList();
  img.src = base + list[currentImgIndex];
  renderDots();
}
function setImg(i) {
  currentImgIndex = i;
  updateGalleryImg();
}
function prevImg() {
  const len = getImgList().length;
  currentImgIndex = (currentImgIndex - 1 + len) % len;
  updateGalleryImg();
}
function nextImg() {
  const len = getImgList().length;
  currentImgIndex = (currentImgIndex + 1) % len;
  updateGalleryImg();
}
function switchGalleryTab(el, tabKey) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTabKey = tabKey;
  currentImgIndex = 0;
  updateGalleryImg();
}
/* Chuyển đổi thẻ nội dung (Tab Switching) */
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
  if (tabId === 'tab-similar' && currentCar) loadSimilarCars(currentCar);
}
function scrollToTab(section) {
  const sectionsEl = document.querySelector('.sections-wrapper');
  if (!sectionsEl) return;
  sectionsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const map = { specs: 'tab-specs', similar: 'tab-similar' };
  const btnMap = { specs: 'btn-tab-specs', similar: 'btn-tab-similar' };
  if (map[section]) {
    setTimeout(() => {
      const btn = document.getElementById(btnMap[section]);
      if (btn) switchTab(btn, map[section]);
    }, 400);
  }
}
  function goCompare() {
    if (!currentCar) return;
    localStorage.setItem("compareCar1", JSON.stringify(currentCar));
    window.location.href = "compare.html";
  }

/* Chuyển đến showroom theo hãng (Find Showroom) */
function goShowroom() {
  if (!currentCar) return;
  // Map brand từ car API → brand trong showroom (Mercedes đặc biệt)
  const brandMap = { 'Mercedes': 'Mercedes-Benz' };
  const brand = brandMap[currentCar.thuongHieu] || currentCar.thuongHieu;
  window.location.href = 'showroom.html?brand=' + encodeURIComponent(brand);
}
/* Quản lý xe yêu thích (Favorite Cars) */
const LS_KEY = 'savedCars';

function getSavedList() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}

function checkIfSaved(carId) {
  return getSavedList().some(c => c.id === carId);
}

function updateSaveButton(saved) {
  isSaved = saved;
  const btn = document.getElementById('btnSave');
  const icon = document.getElementById('saveIcon');
  const text = document.getElementById('saveText');
  if (!btn) return;
  if (saved) {
    btn.classList.add('saved');
    icon.textContent = '❤️';
    text.textContent = 'Đã lưu';
  } else {
    btn.classList.remove('saved');
    icon.textContent = '🔖';
    text.textContent = 'Lưu xe';
  }
}

function toggleSave() {
  if (!currentUser) {
    openModal('login');
    return;
  }
  const list = getSavedList();
  if (!isSaved) {
    // Lưu object xe kèm userId để phân biệt theo tài khoản
    const carToSave = { ...currentCar, _userId: currentUser.userId };
    list.push(carToSave);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    updateSaveButton(true);
    showToast('❤️ Đã lưu vào danh sách yêu thích!');
  } else {
    const filtered = list.filter(c => !(c.id === currentCar.id && c._userId === currentUser.userId));
    localStorage.setItem(LS_KEY, JSON.stringify(filtered));
    updateSaveButton(false);
    showToast('🔖 Đã bỏ lưu xe');
  }
}
/* Thông báo (Toast Notification) */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
/* Xác thực người dùng (Authentication) */
function openModal(type) { document.getElementById(type + 'Modal').classList.add('open'); }
function closeModal(type) { document.getElementById(type + 'Modal').classList.remove('open'); }
function switchModal(from, to) { closeModal(from); openModal(to); }
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
    console.log(data);
  if (data.success) {
    currentUser = data;
    localStorage.setItem("loggedInUser", JSON.stringify(data));
    // Kiểm tra quyền admin
    if (data.vaiTro === "ADMIN") {
        window.location.href = "admin.html";
        return;
    }
    closeModal('login');
    document.getElementById('headerActions').innerHTML =
      `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${data.hoTen}</span>
       <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
    showToast(`👋 Xin chào, ${data.hoTen}!`);
   } else {
      msg.className = 'msg error'; msg.textContent = data.message;
    }
  } catch { msg.className = 'msg error'; msg.textContent = 'Lỗi kết nối server!'; }
}
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
function logout() {
  currentUser = null;
  localStorage.removeItem("loggedInUser");
  document.getElementById('headerActions').innerHTML =
    `<a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
     <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
  showToast('👋 Đã đăng xuất');
}
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});
/* Tải dữ liệu xe (Load Car Data) */
async function init() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('id');
  if (!carId) {
    document.getElementById('pageContent').innerHTML = `
      <div class="page-loading">
        <div style="font-size:48px">🔍</div>
        <p>Không tìm thấy xe. <a href="index.html" style="color:var(--red)">Quay lại trang chủ</a></p>
      </div>`;
    return;
  }
  try {
    const res = await fetch(`${API}/cars/${carId}`);
    if (!res.ok) throw new Error('Not found');
    const car = await res.json();
    renderCarDetail(car);
  } catch (e) {
    document.getElementById('pageContent').innerHTML = `
      <div class="page-loading">
        <div style="font-size:48px">⚠️</div>
        <p>Không tìm thấy xe hoặc server chưa chạy.<br>
           <a href="index.html" style="color:var(--red)">Quay lại trang chủ</a></p>
      </div>`;
  }
}
restoreSession();
init();

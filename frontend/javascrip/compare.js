// Cấu hình API và các trạng thái biến toàn cục
const API = 'http://localhost:8080/api';
let currentUser = null;
let allCars = [];
let selected = [null, null]; 
let selectedType = '';
let car1 = JSON.parse(localStorage.getItem("compareCar1") || "null");
const fuelEmoji = { 'Xăng':'⛽', 'Điện':'⚡', 'Hybrid':'🌿', 'Dầu':'🛢️' };

// Tự động khôi phục phiên đăng nhập khi tải lại trang
function restoreSession() {
  const saved = localStorage.getItem("loggedInUser");
  if (!saved) return;
  currentUser = JSON.parse(saved);
  document.getElementById('headerActions').innerHTML =
    `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
    <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
}

// Xử lý đăng xuất tài khoản
function logout() {
  currentUser = null;
  localStorage.removeItem("loggedInUser");
  document.getElementById('headerActions').innerHTML =
    `<a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
    <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
  alert("Đã đăng xuất");
}

// Lấy đường dẫn hình ảnh của xe
function getCarImage(car) {
  return car && car.hinhAnh ? `${API}/cars/${car.id}/images/1` : '';
}

// Định dạng giá tiền hiển thị (Triệu / Tỷ)
function formatPrice(gia) {
  if (!gia) return '—';
  const n = parseFloat(gia);
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + ' tỷ';
  return n.toLocaleString('vi-VN') + ' triệu';
}

// Phân nhóm khoảng giá cho bộ lọc động
function getPriceRange(price) {
  if (price < 1000) return '0-1000';
  if (price < 2000) return '1000-2000';
  if (price < 5000) return '2000-5000';
  return '5000-99999';
}

// Tải danh sách xe từ máy chủ
async function loadCars() {
  try {
    const res = await fetch(`${API}/cars`);
    allCars = await res.json();
    renderDropdown(0, allCars);
    renderDropdown(1, allCars);
  } catch (e) {
    console.error('Không load được xe:', e);
  }
}

// Hiển thị danh sách xe trong menu thả xuống (Dropdown)
function renderDropdown(slot, cars) {
  const dd = document.getElementById('dropdown' + slot);
  const otherId = selected[1 - slot]?.id;

  const items = cars.map(car => {
    const isDup = car.id === otherId;
    const img = getCarImage(car);
    return `
      <div class="dropdown-item ${isDup ? 'disabled' : ''}" onmousedown="selectCar(${slot}, ${car.id})">
        ${img ? `<img src="${img}" alt="${car.tenXe}" onerror="this.style.display='none'">` : '<div style="width:44px;height:30px;background:#f0f0f5;border-radius:4px;flex-shrink:0"></div>'}
        <div class="dropdown-item-info">
          <div class="dropdown-item-name">${car.tenXe}</div>
          <div class="dropdown-item-meta">${car.thuongHieu}</div>
        </div>
        ${isDup ? '<span style="font-size:11px;color:#aaa;flex-shrink:0">Đã chọn</span>' : ''}
      </div>`;
  }).join('');

  dd.innerHTML = items || '<div class="dropdown-empty">Không tìm thấy xe</div>';
}

// Lọc dữ liệu trong Dropdown theo loại xe, khoảng giá và từ khóa tìm kiếm
function filterDropdown(slot) {
  let filtered = allCars;
  const type = document.getElementById(`type${slot}`).value;
  if (type) {
    filtered = filtered.filter(car => car.loaiXe === type);
  }
  const price = document.getElementById(`price${slot}`).value;
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(car => car.gia >= min && car.gia <= max);
  }
  const q = document.getElementById(`search${slot}`).value.toLowerCase();
  filtered = filtered.filter(car =>
    car.tenXe.toLowerCase().includes(q) || car.thuongHieu.toLowerCase().includes(q)
  );
  renderDropdown(slot, filtered);
  openDropdown(slot);
}

// Mở menu thả xuống
function openDropdown(slot) {
  document.getElementById('dropdown' + slot).classList.add('open');
}

// Đóng menu thả xuống với độ trễ nhẹ để nhận sự kiện click
function closeDropdown(slot) {
  setTimeout(() => document.getElementById('dropdown' + slot).classList.remove('open'), 150);
}

// Xử lý sự kiện khi người dùng chọn một xe vào ô so sánh
function selectCar(slot, carId) {
  const car = allCars.find(c => c.id === carId);
  if (!car) return;
  if (selectedType && car.loaiXe !== selectedType) return;

  selected[slot] = car;
  selectedType = car.loaiXe;
  const selectedPrice = getPriceRange(car.gia);

  document.getElementById('type0').value = selectedType;
  document.getElementById('type1').value = selectedType;
  document.getElementById('price0').value = selectedPrice;
  document.getElementById('price1').value = selectedPrice;

  document.getElementById('type0').disabled = true;
  document.getElementById('type1').disabled = true;
  document.getElementById('price0').disabled = true;
  document.getElementById('price1').disabled = true;
  document.getElementById('search' + slot).value = '';

  renderSelectedCard(slot);
  renderDropdown(1 - slot, allCars);
  updateCompareButton();
  closeDropdown(slot);
  document.getElementById('compareSection').classList.remove('visible');
}

// Xóa xe đã chọn khỏi ô so sánh và mở khóa bộ lọc nếu trống
function removeCar(slot) {
  selected[slot] = null;
  if (!selected[0] && !selected[1]) {
    selectedType = '';
    document.getElementById('type0').value = '';
    document.getElementById('type1').value = '';
    document.getElementById('type0').disabled = false;
    document.getElementById('type1').disabled = false;
    document.getElementById('price0').disabled = false;
    document.getElementById('price1').disabled = false;
    document.getElementById('price0').value = '';
    document.getElementById('price1').value = '';
  }
  renderSelectedCard(slot);
  document.getElementById('slot' + slot).classList.remove('has-car');
  renderDropdown(1 - slot, allCars);
  updateCompareButton();
  document.getElementById('compareSection').classList.remove('visible');
}

// Tạo giao diện thẻ xe đã chọn hiển thị trong slot trống
function renderSelectedCard(slot) {
  const car = selected[slot];
  const container = document.getElementById('selectedCard' + slot);
  const slotEl = document.getElementById('slot' + slot);

  if (!car) {
    container.innerHTML = '';
    slotEl.classList.remove('has-car');
    return;
  }

  slotEl.classList.add('has-car');
  const img = getCarImage(car);
  container.innerHTML = `
    <div class="selected-car">
      ${img ? `<img src="${img}" alt="${car.tenXe}" onerror="this.style.display='none'">` : ''}
      <div class="selected-car-info">
        <div class="selected-car-brand">${car.thuongHieu}</div>
        <div class="selected-car-name">${car.tenXe}</div>
        <div class="selected-car-price">${formatPrice(car.gia)}</div>
      </div>
      <button class="btn-remove" onclick="removeCar(${slot})">✕ Xóa</button>
    </div>`;
}

// Cập nhật trạng thái nút kích hoạt so sánh xe
function updateCompareButton() {
  const btn = document.getElementById('btnCompare');
  const hint = document.getElementById('compareHint');
  const ready = selected[0] && selected[1];
  btn.disabled = !ready;
  hint.textContent = ready
    ? `Đang so sánh: ${selected[0].tenXe} và ${selected[1].tenXe}`
    : 'Vui lòng chọn đủ 2 xe để so sánh';
}

// Chuyển đổi trạng thái logic Có/Không thành thẻ giao diện màu sắc
function yesNo(val) {
  if (!val) return '<span class="badge badge-no">✗ Không</span>';
  const v = val.toString().toLowerCase();
  if (v === 'có' || v === 'yes' || v === 'true' || v === '1') return '<span class="badge badge-yes">✓ Có</span>';
  if (v === 'không' || v === 'no' || v === 'false' || v === '0') return '<span class="badge badge-no">✗ Không</span>';
  return val;
}

// Xác định màu sắc làm nổi bật thông số (Nhỏ hơn xanh, Lớn hơn đỏ)
function highlightNum(a, b) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (isNaN(na) || isNaN(nb)) return ['', ''];
  if (na === nb) return ['highlight', 'highlight'];
  return na > nb ? ['lower', 'highlight'] : ['highlight', 'lower'];
}

// Xử lý khi thay đổi bộ lọc loại xe chung
function changeCarType(slot) {
  const type = document.getElementById(`type${slot}`).value;
  const otherSlot = 1 - slot;
  selectedType = type;
  document.getElementById(`type${otherSlot}`).value = type;
  document.getElementById(`type${otherSlot}`).disabled = !!type;
  document.getElementById('search0').value = '';
  document.getElementById('search1').value = '';
  closeDropdown(0);
  closeDropdown(1);
}

// Xử lý khi thay đổi bộ lọc khoảng giá xe chung
function changePrice(slot) {
  const price = document.getElementById(`price${slot}`).value;
  const otherSlot = 1 - slot;
  document.getElementById(`price${otherSlot}`).value = price;
  document.getElementById(`price${otherSlot}`).disabled = !!price;
  document.getElementById(`search0`).value = '';
  document.getElementById(`search1`).value = '';
  closeDropdown(0);
  closeDropdown(1);
}

// Khởi tạo bảng dữ liệu so sánh chi tiết giữa 2 xe
function showComparison() {
  const [c1, c2] = selected;
  if (!c1 || !c2) return;

  const section = document.getElementById('compareSection');
  section.classList.add('visible');

  const [hpA, hpB] = highlightNum(c1.maLuc, c2.maLuc);         
  const [priceA, priceB] = highlightNum(c1.gia, c2.gia);       
  const [tcA, tcB] = highlightNum(c1.tieuThu, c2.tieuThu);     
  const [scA, scB] = highlightNum(c1.soCho, c2.soCho);         
  const [tkA, tkB] = highlightNum(c1.soTuiKhi, c2.soTuiKhi);   

  function row(label, v1, v2, cls1 = '', cls2 = '') {
    return `<tr>
      <th>${label}</th>
      <td class="${cls1}">${v1 ?? '—'}</td>
      <td class="${cls2}">${v2 ?? '—'}</td>
    </tr>`;
  }

  function sectionRow(title) {
    return `<tr class="section-row">
      <th colspan="3">${title}</th>
    </tr>`;
  }

  document.getElementById('compareContent').innerHTML = `
    <table class="compare-table">
      ${sectionRow('📋 THÔNG TIN CƠ BẢN')}
      ${row('Thương hiệu', c1.thuongHieu, c2.thuongHieu)}
      ${row('Tên xe', c1.tenXe, c2.tenXe)}
      ${row('Giá bán', formatPrice(c1.gia), formatPrice(c2.gia), priceA, priceB)}
      ${row('Loại xe', c1.loaiXe, c2.loaiXe)}
      ${row('Số chỗ ngồi', c1.soCho + ' chỗ', c2.soCho + ' chỗ', scA, scB)}
      ${row('Nhiên liệu', (fuelEmoji[c1.nhienLieu]||'') + ' ' + c1.nhienLieu, (fuelEmoji[c2.nhienLieu]||'') + ' ' + c2.nhienLieu)}

      ${sectionRow('⚙️ ĐỘNG CƠ & VẬN HÀNH')}
      ${row('Công suất', c1.maLuc + ' HP', c2.maLuc + ' HP', hpA, hpB)}
      ${row('Tiêuthu nhiên liệu', c1.tieuThu + ' L/100km', c2.tieuThu + ' L/100km', tcA, tcB)}
      ${row('Hộp số', c1.hopSo, c2.hopSo)}
      ${row('Dẫn động', c1.danDong, c2.danDong)}

      ${sectionRow('🛡️ AN TOÀN')}
      ${row('Số túi khí', c1.soTuiKhi + ' túi', c2.soTuiKhi + ' túi', tkA, tkB)}
      ${row('Hệ thống ABS', yesNo(c1.absSystem), yesNo(c2.absSystem))}
      ${row('Hệ thống EBD', yesNo(c1.ebdSystem), yesNo(c2.ebdSystem))}
      ${row('Hỗ trợ leo dốc (HAC)', yesNo(c1.hacSystem), yesNo(c2.hacSystem))}
      ${row('Camera lùi', yesNo(c1.cameraLui), yesNo(c2.cameraLui))}
      ${row('Cảm biến đỗ xe', yesNo(c1.camBienDoXe), yesNo(c2.camBienDoXe))}
      ${row('Cruise Control', yesNo(c1.cruiseControl), yesNo(c2.cruiseControl))}

      ${sectionRow('🎯 TIỆN NGHI')}
      ${row('Màn hình giải trí', c1.manHinh, c2.manHinh)}
      ${row('Điều hòa', c1.dieuHoa, c2.dieuHoa)}
      ${row('Ghế điện', yesNo(c1.gheDien), yesNo(c2.gheDien))}
      ${row('Cửa sổ trời', yesNo(c1.cuaSoTroi), yesNo(c2.cuaSoTroi))}
      ${row('Smart Entry', yesNo(c1.smartEntry), yesNo(c2.smartEntry))}
      ${row('Sạc không dây', yesNo(c1.sacKd), yesNo(c2.sacKd))}
    </table>
  `;

  setTimeout(() => {
    const yOffset = -100; 
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 50);
}

// Điều khiển đóng mở Modal
function openModal(type) { document.getElementById(type + 'Modal').classList.add('open'); }
function closeModal(type) { document.getElementById(type + 'Modal').classList.remove('open'); }
function switchModal(from, to) { closeModal(from); openModal(to); }

// Xử lý gửi biểu mẫu đăng nhập hệ thống
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
      currentUser = data;
      localStorage.setItem("loggedInUser", JSON.stringify(data));
      if (data.vaiTro === "ADMIN") {
        window.location.href = "admin.html";
        return;
      }
      closeModal('login');
      document.getElementById('headerActions').innerHTML =
        `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${data.hoTen}</span>
         <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
    } else {
      msg.className = 'msg error'; msg.textContent = data.message;
    }
  } catch { msg.className = 'msg error'; msg.textContent = 'Lỗi kết nối server!'; }
}

// Xử lý đăng ký tài khoản thành viên mới
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

// Khởi chạy các hàm nạp dữ liệu ban đầu
restoreSession();
loadCars();

// Nhận diện dữ liệu xe truyền nhanh từ LocalStorage (Ví dụ nhấn "So sánh" tại trang Chi tiết)
if (car1) {
  selected[0] = car1;
  renderSelectedCard(0);
  selectedType = car1.loaiXe;
  
  const type0 = document.getElementById("type0");
  const type1 = document.getElementById("type1");
  type0.value = selectedType;
  type1.value = selectedType;
  type0.disabled = true;
  type1.disabled = true;

  const selectedPrice = getPriceRange(car1.gia);
  const price0 = document.getElementById("price0");
  const price1 = document.getElementById("price1");
  price0.value = selectedPrice;
  price1.value = selectedPrice;
  price0.disabled = true;
  price1.disabled = true;
  
  updateCompareButton();
  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("compareCar1");
  });
}
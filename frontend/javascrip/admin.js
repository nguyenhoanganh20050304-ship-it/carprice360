/* Cấu hình hệ thống (System Configuration) */
const API = 'http://localhost:8080/api';
let allCars = [];
let allUsers = [];
let editingCarId = null;
let pendingAction = null;
let currentHinhAnh = null; 

/* Hình ảnh và logo (Images & Brand Logos) */
function getCarImage(car) {
  return car && car.id ? `${API}/cars/${car.id}/images/1` : '';
}

/* Logo thương hiệu (Brand Logos) */
const brandLogos = {
  'Audi':     'image/cars/audi/logo/logo-audi.png',
  'BMW':      'image/cars/bmw/logo/logo-bmw.png',
  'Ford':     'image/cars/ford/logo/logo-ford.png',
  'Hyundai':  'image/cars/hyundai/logo/logo-hyundai.png',
  'Kia':      'image/cars/kia/logo/logo-kia.png',
  'Lexus':    'image/cars/lexus/logo/logo-lexus.png',
  'Mercedes': 'image/cars/mercedes-benz/logo/logo-mercedes-benz.png',
  'Porsche':  'image/cars/porsche/logo/logo-porsche.png',
  'Toyota':   'image/cars/toyota/logo/logo-toyota.png',
  'VinFast':  'image/cars/vinFast/logo/logo-vinfast.png',
};
/* Khi thêm thương hiệu mới: thêm 1 dòng vào brandLogos + đặt file logo vào image/cars/{brand}/logo/ */
function getBrandLogo(brand) {
  return brandLogos[brand] || '';
}
/* Huy hiệu nhiên liệu (Fuel Badges) */
const fuelBadge = {
  'Xăng': '<span class="badge badge-gray">⛽ Xăng</span>',
  'Điện': '<span class="badge badge-green">⚡ Điện</span>',
  'Hybrid': '<span class="badge badge-teal">🌿 Hybrid</span>',
  'Dầu': '<span class="badge badge-yellow">🛢️ Dầu</span>',
};
/* Định dạng giá xe (Price Formatting) */
function formatPrice(gia) {
  if (!gia && gia !== 0) return '—';
  if (gia >= 1000) return (gia / 1000).toFixed(gia % 1000 === 0 ? 0 : 1) + ' tỷ';
  return gia + ' triệu';
}

/* Xác thực (Authentication) */
function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem('adminUser') || 'null');
  if (!user || user.vaiTro !== 'ADMIN') {
 
    document.getElementById('adminGreeting').textContent = ' Admin';
    return;
  }
  document.getElementById('adminGreeting').textContent = ` ${user.hoTen}`;
}
/* Đăng xuất (Logout) */
function logout() {
  localStorage.removeItem('loggedInUser');
  sessionStorage.removeItem('adminUser');
  window.location.href = 'index.html';
}
/* Chuyển trang (Page Navigation) */
function switchPage(name) {
 document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
 document.querySelector(`[data-page="${name}"]`).classList.add('active');
 document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
 document.getElementById(`page-${name}`).classList.add('active');
 if (name === 'dashboard') {
     loadDashboard();
 }
 else if (name === 'cars') {
     loadCars();
 }
}

/* Bảng điều khiển (Dashboard) */
async function loadDashboard() {
  try {
    const res = await fetch(`${API}/cars`);
    allCars = await res.json();

    document.getElementById('statCars').textContent = allCars.length;
    document.getElementById('navCarsCount').textContent = allCars.length;

    const brands = [...new Set(allCars.map(c => c.thuongHieu))];
    document.getElementById('statBrands').textContent = brands.length;
    

    const electric = allCars.filter(c => c.nhienLieu === 'Điện').length;
    document.getElementById('statElectric').textContent = electric;

    
    try {
      const ures = await fetch(`${API}/auth/users`);
      if (ures.ok) {
        const users = await ures.json();
        document.getElementById('statUsers').textContent = users.length;
      } else { document.getElementById('statUsers').textContent = '—'; }
    } catch { document.getElementById('statUsers').textContent = '—'; }

  
    const recent = [...allCars].reverse().slice(0, 5);
    document.getElementById('recentCarsBody').innerHTML = recent.map(car => `
      <tr>
        <td>
          <div class="mini-car">
            ${getCarImage(car)
              ? `<img class="mini-car-img" src="${getCarImage(car)}" alt="" onerror="this.style.display='none'">`
              : `<div class="mini-car-img-empty">🚗</div>`}
            <span style="font-weight:600">${car.tenXe}</span>
          </div>
        </td>
        <td><span class="badge badge-blue">${car.thuongHieu}</span></td>
        <td style="font-weight:700;color:var(--red)">${formatPrice(car.gia)}</td>
        <td>${fuelBadge[car.nhienLieu] || car.nhienLieu}</td>
      </tr>
    `).join('');

   
    const brandCount = {};
    allCars.forEach(c => { brandCount[c.thuongHieu] = (brandCount[c.thuongHieu] || 0) + 1; });
    const sorted = Object.entries(brandCount).sort((a,b) => b[1]-a[1]);
    const max = sorted[0]?.[1] || 1;
    document.getElementById('brandBreakdown').innerHTML = sorted.map(([brand, count]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
          <span style="font-weight:600">${brand}</span>
          <span style="color:var(--muted)">${count} xe</span>
        </div>
        <div style="background:var(--gray);border-radius:4px;height:8px;overflow:hidden">
          <div style="background:var(--red);height:100%;width:${(count/max*100).toFixed(0)}%;border-radius:4px;transition:width .6s"></div>
        </div>
      </div>
    `).join('');

  } catch (e) {
    document.getElementById('recentCarsBody').innerHTML =
      `<tr><td colspan="4" style="text-align:center;padding:30px;color:#c00">⚠️ Không kết nối được backend (${API})</td></tr>`;
  }
  loadLatestUsers();
}

/* Quản lý xe (Car Management) */
async function loadCars() {
  document.getElementById('carsTableBody').innerHTML =
    `<tr><td colspan="10"><div class="loading-box"><div class="spinner"></div>Đang tải...</div></td></tr>`;
  try {
    const res = await fetch(`${API}/cars`);
    allCars = await res.json();

    const brands = [...new Set(allCars.map(c => c.thuongHieu))].sort();
    const sel = document.getElementById('carFilterBrand');
    sel.innerHTML = '<option value="">Tất cả hãng</option>' +
      brands.map(b => `<option>${b}</option>`).join('');
    document.getElementById('navCarsCount').textContent = allCars.length;
    renderCarsTable();
    loadBrands();
  } catch {
    document.getElementById('carsTableBody').innerHTML =
      `<tr><td colspan="10" style="text-align:center;padding:30px;color:#c00">⚠️ Lỗi kết nối server — hãy đảm bảo backend đang chạy tại port 8080</td></tr>`;
  }
}
/* Hiển thị danh sách xe (Render Cars Table) */
function renderCarsTable() {
  const kw = document.getElementById('carSearch').value.toLowerCase();
  const brand = document.getElementById('carFilterBrand').value;
  const type = document.getElementById('carFilterType').value;
  const fuel = document.getElementById('carFilterFuel').value;

  const filtered = allCars.filter(c =>
    (!kw || c.tenXe.toLowerCase().includes(kw) || c.thuongHieu.toLowerCase().includes(kw)) &&
    (!brand || c.thuongHieu === brand) &&
    (!type || c.loaiXe === type) &&
    (!fuel || c.nhienLieu === fuel)
  );

  document.getElementById('carsCountLabel').textContent = `${filtered.length} / ${allCars.length} xe`;

  if (!filtered.length) {
    document.getElementById('carsTableBody').innerHTML =
      `<tr><td colspan="10"><div class="no-data">🔍 Không tìm thấy xe phù hợp</div></td></tr>`;
    return;
  }

  document.getElementById('carsTableBody').innerHTML = filtered.map(car => `
    <tr>
      <td style="color:var(--muted);font-size:13px">#${car.id}</td>
      <td>
        ${getCarImage(car)
          ? `<img class="car-thumb" src="${getCarImage(car)}" alt="${car.tenXe}" onerror="this.parentElement.innerHTML='<div class=no-thumb>🚗</div>'">`
          : `<div class="no-thumb">🚗</div>`}
      </td>
      <td style="font-weight:600;max-width:200px">${car.tenXe}</td>
      <td><span class="badge badge-blue">${car.thuongHieu}</span></td>
      <td style="font-weight:800;color:var(--red);white-space:nowrap">${formatPrice(car.gia)}</td>
      <td><span class="badge badge-gray">${car.loaiXe}</span></td>
      <td>${fuelBadge[car.nhienLieu] || car.nhienLieu}</td>
      <td>${car.maLuc} HP</td>
      <td>${car.soCho} chỗ</td>
      <td>
        <div class="action-row">
          <button class="btn btn-edit btn-sm" onclick="openCarModal(${car.id})">✏️ Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteCar(${car.id}, '${car.tenXe.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* Hộp thoại xe (Car Modal) */
function openCarModal(carId) {
  editingCarId = carId;
  currentHinhAnh = null; 
  document.getElementById('carModalTitle').textContent = carId ? '✏️ Chỉnh sửa xe' : '＋ Thêm xe mới';

  if (carId) {
    const car = allCars.find(c => c.id === carId);
    if (!car) return;
     currentHinhAnh = car.id || null;  
    setField('tenXe', car.tenXe);
    setField('thuongHieu', car.thuongHieu);
    setField('loaiXe', car.loaiXe);
    setField('gia', car.gia);
    setField('soCho', car.soCho);
    setField('nhienLieu', car.nhienLieu);
    setField('maLuc', car.maLuc);
    setField('tieuThu', car.tieuThu);
    setField('danDong', car.danDong || '');
    setField('hopSo', car.hopSo || '');
    setField('soTuiKhi', car.soTuiKhi || '');
    setField('absSystem', car.absSystem || 'Có');
    setField('ebdSystem', car.ebdSystem || 'Có');
    setField('hacSystem', car.hacSystem || 'Có');
    setField('cameraLui', car.cameraLui || 'Có');
    setField('camBienDoXe', car.camBienDoXe || 'Trước + Sau');
    setField('cruiseControl', car.cruiseControl || 'Có');
    setField('manHinh', car.manHinh || '');
    setField('dieuHoa', car.dieuHoa || '2 vùng độc lập');
    setField('gheDien', car.gheDien || 'Có');
    setField('cuaSoTroi', car.cuaSoTroi || 'Có');
    setField('smartEntry', car.smartEntry || 'Có');
    setField('sacKd', car.sacKd || 'Có');
  } else {
    // Clear form
    const ids = ['tenXe','thuongHieu','loaiXe','gia','soCho','nhienLieu','maLuc',
      'tieuThu','danDong','hopSo','soTuiKhi','absSystem','ebdSystem','hacSystem',
      'cameraLui','camBienDoXe','cruiseControl','manHinh','dieuHoa','gheDien',
      'cuaSoTroi','smartEntry','sacKd'];
    ids.forEach(id => { const el = document.getElementById('f-'+id); if(el) { if(el.tagName==='SELECT') el.selectedIndex=0; else el.value=''; } });
    // Set sensible defaults
    setField('absSystem','Có'); setField('ebdSystem','Có'); setField('hacSystem','Có');
    setField('cameraLui','Có'); setField('camBienDoXe','Trước + Sau'); setField('cruiseControl','Có');
    setField('gheDien','Có'); setField('smartEntry','Có'); setField('sacKd','Có');
    setField('dieuHoa','2 vùng độc lập'); setField('tieuThu','0');
  }

  document.getElementById('carModal').classList.add('open');
  setTimeout(() => document.getElementById('f-tenXe').focus(), 100);
}
/* Thiết lập dữ liệu ô nhập (Set Field) */
function setField(id, val) {
  const el = document.getElementById('f-' + id);
  if (el) el.value = val ?? '';
}
/* Lấy dữ liệu ô nhập (Get Field) */
function getField(id) {
  const el = document.getElementById('f-' + id);
  return el ? el.value.trim() : '';
}
/* Đóng hộp thoại xe (Close Car Modal) */
function closeCarModal() {
  document.getElementById('carModal').classList.remove('open');
  
}
/* Lưu thông tin xe (Save Car) */
async function saveCar() {
  const imageFiles =
    document.getElementById('f-images').files;
if(imageFiles.length > 0 &&
   imageFiles.length !== 5){
    showToast(
        'Vui lòng chọn đúng 5 ảnh',
        'err'
    );
    return;
}
  const tenXe = getField('tenXe');
  const thuongHieu = getField('thuongHieu');
  const loaiXe = getField('loaiXe');
  const gia = parseFloat(getField('gia'));
  const soCho = parseInt(getField('soCho'));
  const nhienLieu = getField('nhienLieu');
  const maLuc = parseInt(getField('maLuc'));

  if (!tenXe || !thuongHieu || !loaiXe || !gia || !soCho || !nhienLieu || !maLuc) {
    showToast('⚠️ Vui lòng điền đầy đủ các trường có dấu *', 'err');
    return;
  }

  const payload = {
    tenXe, thuongHieu, loaiXe, gia, soCho, nhienLieu, maLuc,
    tieuThu: parseFloat(getField('tieuThu')) || 0,
    danDong: getField('danDong') || null,
    hopSo: getField('hopSo') || null,
    soTuiKhi: parseInt(getField('soTuiKhi')) || null,
    absSystem: getField('absSystem') || 'Có',
    ebdSystem: getField('ebdSystem') || 'Có',
    hacSystem: getField('hacSystem') || 'Có',
    cameraLui: getField('cameraLui') || 'Có',
    camBienDoXe: getField('camBienDoXe') || 'Trước + Sau',
    cruiseControl: getField('cruiseControl') || 'Có',
    manHinh: getField('manHinh') || null,
    dieuHoa: getField('dieuHoa') || null,
    gheDien: getField('gheDien') || null,
    cuaSoTroi: getField('cuaSoTroi') || null,
    smartEntry: getField('smartEntry') || null,
    sacKd: getField('sacKd') || null,
    hinhAnh: currentHinhAnh, 
  };

  try {
    const url = editingCarId ? `${API}/cars/${editingCarId}` : `${API}/cars`;
    const method = editingCarId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Server error');
    const savedCar = await res.json();

    //  Nếu có chọn ảnh → upload lên server
    if (imageFiles.length === 5) {
      const formData = new FormData();
      for (let i = 0; i < 5; i++) {
        formData.append('images', imageFiles[i]);
      }
      const uploadRes = await fetch(`${API}/cars/${savedCar.id}/images`, {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) {
        showToast('⚠️ Xe đã lưu nhưng upload ảnh thất bại', 'err');
      }
    }

    closeCarModal();
    await loadCars();
    showToast(editingCarId ? `✅ Đã cập nhật "${tenXe}"` : `✅ Đã thêm "${tenXe}"`, 'ok');
  } catch {
    showToast('❌ Lỗi lưu dữ liệu — kiểm tra server', 'err');
  }
}

/* Xóa xe (Delete Car) */
function confirmDeleteCar(id, name) {
  pendingAction = async () => {
    try {
      const res = await fetch(`${API}/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      closeConfirm();
      await loadCars();
      showToast(`✅ Đã xóa "${name}"`, 'ok');
    } catch {
      showToast('❌ Không thể xóa — kiểm tra server', 'err');
    }
  };
  document.getElementById('confirmText').innerHTML = `Bạn chắc chắn muốn xóa xe<br><strong>"${name}"</strong>? Hành động này không thể hoàn tác.`;
  document.getElementById('confirmModal').classList.add('open');
}
/* Hộp thoại xác nhận (Confirmation Dialog) */
function closeConfirm() {
  document.getElementById('confirmModal').classList.remove('open');
  pendingAction = null;
}

function executeConfirm() {
  if (pendingAction) pendingAction();
}

/*  thương hiệu (Brand) */
async function loadBrands() {
  if (!allCars.length) {
    try {
      const res = await fetch(`${API}/cars`);
      allCars = await res.json();
    } catch {
      document.getElementById('brandsGrid').innerHTML =
        `<div class="no-data">⚠️ Không kết nối được server</div>`;
      return;
    }
  }

  const brandCount = {};
  allCars.forEach(c => { brandCount[c.thuongHieu] = (brandCount[c.thuongHieu] || 0) + 1; });
  const brands = Object.entries(brandCount).sort((a,b) => b[1]-a[1]);

  document.getElementById('brandsCountLabel').textContent = `${brands.length} thương hiệu đang hoạt động`;

  document.getElementById('brandsGrid').innerHTML = brands.map(([brand, count]) => `
    <div class="brand-card-admin">
      <img src="${getBrandLogo(brand)}" alt="${brand}"
           onerror="this.outerHTML='<div style=font-size:32px;margin-bottom:4px>🏷️</div>'">
      <div class="bname">${brand}</div>
      <div class="bcount">${count} mẫu xe</div>
      <div class="bactions">
        <button class="btn btn-edit btn-sm" onclick="filterCarsByBrand('${brand}')">🚗 Xem xe</button>
      </div>
    </div>
  `).join('');
}
/* Lọc xe theo thương hiệu (Filter Cars by Brand) */
function filterCarsByBrand(brand) {
    switchPage('cars');
    setTimeout(() => {
        document.getElementById('carFilterBrand').value = brand;
        renderCarsTable();
        document.getElementById('carListSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}
/* Quản lý người dùng (User Management) */
async function loadUsers() {
  document.getElementById('usersTableBody').innerHTML =
    `<tr><td colspan="6"><div class="loading-box"><div class="spinner"></div>Đang kết nối server...</div></td></tr>`;
  try {
    const res = await fetch(`${API}/auth/users`);
    if (!res.ok) {
      if (res.status === 404 || res.status === 405) {
        document.getElementById('usersTableBody').innerHTML =
          `<tr><td colspan="6"><div class="no-data">📡 Endpoint <code>/api/users</code> chưa có — xem hướng dẫn bên trên để bật tính năng này</div></td></tr>`;
        return;
      }
      throw new Error();
    }
    allUsers = await res.json();
    renderUsersTable();
    document.getElementById('statUsers').textContent = allUsers.length;
  } catch {
    document.getElementById('usersTableBody').innerHTML =
      `<tr><td colspan="6"><div class="no-data" style="color:#c00">❌ Không kết nối được server hoặc endpoint chưa tồn tại</div></td></tr>`;
  }
}
/* Người dùng mới nhất (Latest Users) */
async function loadLatestUsers() {
  try {
    const res = await fetch(`${API}/auth/users`);

    if (!res.ok) throw new Error();

    const users = await res.json();

    document.getElementById('latestUsersBody').innerHTML =
      users.slice(0, 5).map(u => `
        <tr>
          <td>${u.hoTen || ''}</td>
          <td>${u.email || ''}</td>
          <td>${u.vaiTro || ''}</td>
        </tr>
      `).join('');

  } catch (e) {
    console.error(e);
  }
}
function getCarImage(car, index = 1) {
  if (!car || !car.id) return '';
  return `${API}/cars/${car.id}/images/${index}`;
}
/* Lọc người dùng (Filter Users) */
function filterUsers() {
  renderUsersTable();
}
/* Hiển thị danh sách người dùng (Render Users Table) */
function renderUsersTable() {
  const kw = (document.getElementById('userSearch').value || '').toLowerCase();
  const role = document.getElementById('userFilterRole').value;

  const filtered = allUsers.filter(u =>
    (!kw || u.email.toLowerCase().includes(kw) || u.hoTen.toLowerCase().includes(kw)) &&
    (!role || u.vaiTro === role)
  );

  if (!filtered.length) {
    document.getElementById('usersTableBody').innerHTML =
      `<tr><td colspan="6"><div class="no-data">Không tìm thấy người dùng phù hợp</div></td></tr>`;
    return;
  }

  document.getElementById('usersTableBody').innerHTML = filtered.map(u => `
    <tr>
      <td style="color:var(--muted);font-size:13px">#${u.id}</td>
      <td>
        <div class="user-info">
          <div class="user-avatar">${u.hoTen ? u.hoTen[0].toUpperCase() : '?'}</div>
          <span style="font-weight:600">${u.hoTen || '—'}</span>
        </div>
      </td>
      <td>${u.email}</td>
<td>
  ${u.vaiTro === 'ADMIN'
    ? '<span class="badge badge-red">ADMIN</span>'
    : '<span class="badge badge-blue">USER</span>'}
</td>

<td>
  ${u.isBlocked
    ? '<span class="badge badge-red">🚫 Đã khóa</span>'
    : '<span class="badge badge-green">✅ Hoạt động</span>'}
</td>

<td style="color:var(--muted);font-size:13px">
  ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
</td>

<td>
  ${
    u.vaiTro === 'ADMIN'
      ? '<span style="color:var(--muted)">—</span>'
      : u.isBlocked
        ? `<button class="btn btn-blue btn-sm"
             onclick="unblockUser(${u.id},'${u.hoTen?.replace(/'/g,"\\'")}')">
             🔓 Mở khóa
           </button>`
        : `<button class="btn btn-danger btn-sm"
             onclick="blockUser(${u.id},'${u.hoTen?.replace(/'/g,"\\'")}')">🚫 Khóa
           </button>`
  }
</td>
    <td>
      ${
        u.vaiTro === 'ADMIN'
          ? '<span style="color:var(--muted)">—</span>'
          : `<button class="btn btn-danger btn-sm"
              onclick="deleteUser(${u.id},'${u.hoTen?.replace(/'/g,"\\'")}')">
              🗑️ Xóa
            </button>`
      }
    </td>
    </tr>
  `).join('');
}
/* Khóa tài khoản (Block User) */
async function blockUser(id, name) {
  if (!confirm(`Khóa tài khoản của "${name}"?`)) return;
  try {
    const res = await fetch(`${API}/auth/users/${id}/block`, { method: 'PUT' });
    if (!res.ok) throw new Error();
    
    showToast(`🚫 Đã khóa tài khoản "${name}"`, 'ok');
    
    // Thêm dòng này để cập nhật lại trạng thái giao diện ngay lập tức mà không cần F5
    loadUsers(); 
    
  } catch {
    showToast('❌ Không thể khóa tài khoản', 'err');
  }
}
/* Mở khóa tài khoản (Unblock User) */
async function unblockUser(id, name) {
  if (!confirm(`Mở khóa tài khoản "${name}"?`)) return;

  try {
    const res = await fetch(`${API}/auth/users/${id}/unblock`, {
      method: 'PUT'
    });

    if (!res.ok) throw new Error();

    showToast(`🔓 Đã mở khóa "${name}"`, 'ok');

    loadUsers();
  } catch {
    showToast('❌ Không thể mở khóa tài khoản', 'err');
  }
}
/* Xóa người dùng (Delete User) */
async function deleteUser(id, name) {
  if (!confirm(`Xóa vĩnh viễn tài khoản "${name}"?\nHành động này không thể hoàn tác!`)) return;
  try {
    const res = await fetch(`${API}/auth/users/${id}/delete`, { method: 'POST' }); 
    
    if (!res.ok) {
      try {
        const errorData = await res.json();
        showToast('❌ ' + (errorData.message || 'Không thể xóa tài khoản này'), 'err');
      } catch { showToast('❌ Lỗi từ hệ thống server', 'err'); }
      return;
    }

    const data = await res.json();
    if (data && data.success) {
      showToast(`🗑️ Đã xóa tài khoản "${name}"`, 'ok');
      loadUsers();
    } else {
      showToast('❌ ' + (data.message || 'Xóa thất bại'), 'err');
    }
  } catch (error) {
    showToast('❌ Không thể xóa — kiểm tra kết nối server', 'err');
  }
}
/* Thông báo (Toast Notification) */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type === 'ok' ? 'toast-ok' : type === 'err' ? 'toast-err' : ''}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* Đóng hộp thoại khi bấm nền (Close Modal on Overlay Click) */
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) {
      el.classList.remove('open');
      editingCarId = null;
      pendingAction = null;
    }
  });
});
/* Khởi tạo hệ thống (System Initialization) */
checkAuth();
loadDashboard();
document
.getElementById('f-images')
.addEventListener('change', function(){

    const preview =
        document.getElementById('imagePreview');

    preview.innerHTML = '';

    [...this.files].forEach(file => {

        const img =
            document.createElement('img');

        img.src =
            URL.createObjectURL(file);

        preview.appendChild(img);
    });

});

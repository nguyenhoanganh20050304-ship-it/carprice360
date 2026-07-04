
const API = 'http://localhost:8080/api';
let currentUser = null;
let activeBrand = '';
let activeCity = '';
const showrooms = [
  { brand:"Audi", name:"Audi Hà Nội", city:"Hà Nội", image:"image/showroom/audi/hanoi/audihanoi.png" },
  { brand:"Audi", name:"Audi Hồ Chí Minh", city:"TP.HCM", image:"image/showroom/audi/hcm/audihochiminh.png" },
  { brand:"Audi", name:"Audi Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/audi/hcm/audiphumyhung.png" },
  { brand:"Audi", name:"Audi Tân Bình", city:"TP.HCM", image:"image/showroom/audi/hcm/auditanbinh.png" },
  { brand:"BMW", name:"BMW Lê Duẩn", city:"Hà Nội", image:"image/showroom/bmw/hanoi/bmwleduan.png" },
  { brand:"BMW", name:"BMW Lê Văn Lương", city:"Hà Nội", image:"image/showroom/bmw/hanoi/bmwlevanluong.png" },
  { brand:"BMW", name:"BMW Long Biên", city:"Hà Nội", image:"image/showroom/bmw/hanoi/bmwlongbien.png" },
  { brand:"BMW", name:"BMW Phạm Văn Đồng", city:"Hà Nội", image:"image/showroom/bmw/hanoi/bmwphamvandong.png" },
  { brand:"BMW", name:"BMW Bình Dương", city:"TP.HCM", image:"image/showroom/bmw/hcm/bmwbinhduong.png" },
  { brand:"BMW", name:"BMW Hồ Chí Minh", city:"TP.HCM", image:"image/showroom/bmw/hcm/bmwhochiminh.png" },
  { brand:"BMW", name:"BMW MINI Sala Quận 2", city:"TP.HCM", image:"image/showroom/bmw/hcm/bmwminisalaquan2.png" },
  { brand:"BMW", name:"BMW Nguyễn Văn Trỗi", city:"TP.HCM", image:"image/showroom/bmw/hcm/bmwnguyenvantroi.png" },
  { brand:"BMW", name:"BMW Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/bmw/hcm/bmwphumyhung.png" },
  { brand:"Ford", name:"An Đô Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/andoford.png" },
  { brand:"Ford", name:"Capital Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/capitalford.png" },
  { brand:"Ford", name:"Hà Nội Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/hanoiford.png" },
  { brand:"Ford", name:"Hà Thành Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/hathanhford.png" },
  { brand:"Ford", name:"Long Biên Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/longbienford.png" },
  { brand:"Ford", name:"Mỹ Đình Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/mydinhford.png" },
  { brand:"Ford", name:"Tây Mỗ Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/taymoford.png" },
  { brand:"Ford", name:"Thăng Long Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/thanglongford.png" },
  { brand:"Ford", name:"Thanh Xuân Ford", city:"Hà Nội", image:"image/showroom/ford/hanoi/thanhxuanford.png" },
  { brand:"Ford", name:"Bà Rịa Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/bariaford.png" },
  { brand:"Ford", name:"Bến Thành Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/benthanhford.png" },
  { brand:"Ford", name:"Bình Dương Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/binhduongford.png" },
  { brand:"Ford", name:"City Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/cityford.png" },
  { brand:"Ford", name:"Dĩ An Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/dianford.png" },
  { brand:"Ford", name:"Gia Định Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/giadinhford.png" },
  { brand:"Ford", name:"Nam Sài Gòn Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/namsaigonford.png" },
  { brand:"Ford", name:"Phổ Quang Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/phoquangford.png" },
  { brand:"Ford", name:"Phú Mỹ Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/phumyford.png" },
  { brand:"Ford", name:"Sài Gòn Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/saigonford.png" },
  { brand:"Ford", name:"Suối Tiên Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/suoitienford.png" },
  { brand:"Ford", name:"Tân Thuận Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/tanthuanford.png" },
  { brand:"Ford", name:"Vũng Tàu Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/vungtauford.png" },
  { brand:"Ford", name:"Western Ford", city:"TP.HCM", image:"image/showroom/ford/hcm/westernford.png" },
  { brand:"Hyundai", name:"Hyundai Phạm Hùng", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/huyndaiphamhung.png" },
  { brand:"Hyundai", name:"Hyundai An Khánh", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaiankhanh.png" },
  { brand:"Hyundai", name:"Hyundai Cầu Diễn", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaicaudien.png" },
  { brand:"Hyundai", name:"Hyundai Đông Anh", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaidonganh.png" },
  { brand:"Hyundai", name:"Hyundai Đông Đô", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaidongdo.png" },
  { brand:"Hyundai", name:"Hyundai Giải Phóng", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaigiaiphong.png" },
  { brand:"Hyundai", name:"Hyundai Gia Lâm", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaigialam.png" },
  { brand:"Hyundai", name:"Hyundai Hà Đông", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaihadong.png" },
  { brand:"Hyundai", name:"Hyundai Lê Văn Lương", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundailevanluong.png" },
  { brand:"Hyundai", name:"Hyundai Long Biên", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundailongbien.png" },
  { brand:"Hyundai", name:"Hyundai Phạm Văn Đồng", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaiphamvandong.png" },
  { brand:"Hyundai", name:"Hyundai Sơn Tây", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaisontay.png" },
  { brand:"Hyundai", name:"Hyundai Vũ Phạm Hàm", city:"Hà Nội", image:"image/showroom/hyundai/hanoi/hyundaivuphamham.png" },
  { brand:"Hyundai", name:"Hyundai An Phú", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaianphu.png" },
  { brand:"Hyundai", name:"Hyundai Bà Rịa Vũng Tàu", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaibariavungtau.png" },
  { brand:"Hyundai", name:"Hyundai Bình Dương", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaibinhduong.png" },
  { brand:"Hyundai", name:"Hyundai Đông Sài Gòn", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaidongsaigon.png" },
  { brand:"Hyundai", name:"Hyundai Gia Định", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaigiadinh.png" },
  { brand:"Hyundai", name:"Hyundai Kinh Dương Vương", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaikinhduongvuong.png" },
  { brand:"Hyundai", name:"Hyundai Miền Nam", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaimiennam.png" },
  { brand:"Hyundai", name:"Hyundai Ngọc An", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaingocan.png" },
  { brand:"Hyundai", name:"Hyundai Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaiphumyhung.png" },
  { brand:"Hyundai", name:"Hyundai Trường Chinh", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaitruongchinh.png" },
  { brand:"Hyundai", name:"Hyundai Việt Hàn", city:"TP.HCM", image:"image/showroom/hyundai/hcm/hyundaiviethan.png" },
  { brand:"Kia", name:"Kia Bạch Đằng", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiabachdang.png" },
  { brand:"Kia", name:"Kia Cầu Diễn", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiacaudien.png" },
  { brand:"Kia", name:"Kia Đống Đa", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiadongda.png" },
  { brand:"Kia", name:"Kia Giải Phóng", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiagiaiphong.png" },
  { brand:"Kia", name:"Kia Long Biên", city:"Hà Nội", image:"image/showroom/kia/hanoi/kialongbien.png" },
  { brand:"Kia", name:"Kia Phạm Văn Đồng", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiaphamvandong.png" },
  { brand:"Kia", name:"Kia Sơn Tây", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiasontay.png" },
  { brand:"Kia", name:"Kia Thanh Xuân", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiathanhxuan.png" },
  { brand:"Kia", name:"Kia Yên Nghĩa", city:"Hà Nội", image:"image/showroom/kia/hanoi/kiayennghia.png" },
  { brand:"Kia", name:"Kia Bà Rịa", city:"TP.HCM", image:"image/showroom/kia/hcm/kiabaria.png" },
  { brand:"Kia", name:"Kia Bình Dương", city:"TP.HCM", image:"image/showroom/kia/hcm/kiabinhduong.png" },
  { brand:"Kia", name:"Kia Bình Tân", city:"TP.HCM", image:"image/showroom/kia/hcm/kiabinhtan.png" },
  { brand:"Kia", name:"Kia Bình Triệu", city:"TP.HCM", image:"image/showroom/kia/hcm/kiabinhtrieu.png" },
  { brand:"Kia", name:"Kia Gò Vấp", city:"TP.HCM", image:"image/showroom/kia/hcm/kiagovap.png" },
  { brand:"Kia", name:"Kia Hồ Chí Minh", city:"TP.HCM", image:"image/showroom/kia/hcm/kiahochiminh.png" },
  { brand:"Kia", name:"Kia Hùng Vương", city:"TP.HCM", image:"image/showroom/kia/hcm/kiahungvuong.png" },
  { brand:"Kia", name:"Kia Kinh Dương Vương", city:"TP.HCM", image:"image/showroom/kia/hcm/kiakinhduongvuong.png" },
  { brand:"Kia", name:"Kia Nguyễn Văn Trỗi", city:"TP.HCM", image:"image/showroom/kia/hcm/kianguyenvantroi.png" },
  { brand:"Kia", name:"Kia Phan Huy Ích", city:"TP.HCM", image:"image/showroom/kia/hcm/kiaphanhuyich.png" },
  { brand:"Kia", name:"Kia Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/kia/hcm/kiaphumyhung.png" },
  { brand:"Kia", name:"Kia Tân Sơn Nhất", city:"TP.HCM", image:"image/showroom/kia/hcm/kiatansonnhat.png" },
  { brand:"Kia", name:"Kia Tân Uyên", city:"TP.HCM", image:"image/showroom/kia/hcm/kiatanuyen.png" },
  { brand:"Kia", name:"Kia Thảo Điền", city:"TP.HCM", image:"image/showroom/kia/hcm/kiathaodien.png" },
  { brand:"Kia", name:"Kia Thiso Sala", city:"TP.HCM", image:"image/showroom/kia/hcm/kiathisosala.png" },
  { brand:"Kia", name:"Kia Thủ Dầu Một", city:"TP.HCM", image:"image/showroom/kia/hcm/kiathudaumot.png" },
  { brand:"Kia", name:"Kia Trường Chinh", city:"TP.HCM", image:"image/showroom/kia/hcm/kiatruongchinh.png" },
  { brand:"Kia", name:"Kia Vũng Tàu", city:"TP.HCM", image:"image/showroom/kia/hcm/kiavungtau.png" },
  { brand:"Lexus", name:"Lexus Thăng Long", city:"Hà Nội", image:"image/showroom/lexus/hanoi/lexusthanglong.png" },
  { brand:"Lexus", name:"Lexus Trung Tâm Sài Gòn", city:"TP.HCM", image:"image/showroom/lexus/hcm/lexustrungtamsaigon.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz An Du Phạm Hùng", city:"Hà Nội", image:"image/showroom/mercedes-benz/hanoi/mercedes-benzanduphamhung.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Haxaco Kim Giang", city:"Hà Nội", image:"image/showroom/mercedes-benz/hanoi/mercedes-benzhaxacokimgiang.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Haxaco Láng Hạ", city:"Hà Nội", image:"image/showroom/mercedes-benz/hanoi/mercedes-benzhaxacolangha.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Đại Từ", city:"Hà Nội", image:"image/showroom/mercedes-benz/hanoi/mercedes-benzvietnamstardaitu.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Hoàn Kiếm", city:"Hà Nội", image:"image/showroom/mercedes-benz/hanoi/mercedes-benzvietnamstarhoankiem.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Haxaco Điện Biên Phủ", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzhaxacodienbienphu.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Haxaco Võ Văn Kiệt", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzhaxacovovankiet.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Bình Dương", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzvietnamstarbinhduong.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Chế Lan Viên", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzvietnamstarchelanvien.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzvietnamstarphumyhung.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vietnam Star Trường Chinh", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzvietnamstartruongchinh.png" },
  { brand:"Mercedes-Benz", name:"Mercedes-Benz Vũng Tàu", city:"TP.HCM", image:"image/showroom/mercedes-benz/hcm/mercedes-benzvungtau.png" },
  { brand:"Porsche", name:"Porsche Hà Nội", city:"Hà Nội", image:"image/showroom/porsche/hanoi/porschehanoi.png" },
  { brand:"Porsche", name:"Porsche Sài Gòn", city:"TP.HCM", image:"image/showroom/porsche/hcm/porschesaigon.png" },
  { brand:"Toyota", name:"Toyota Giải Phóng", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotagiaiphong.png" },
  { brand:"Toyota", name:"Toyota Hà Đông", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotahadong.png" },
  { brand:"Toyota", name:"Toyota Hoàn Kiếm", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotahoankiem.png" },
  { brand:"Toyota", name:"Toyota IDC Hoài Đức", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotaidmchoaiduc.png" },
  { brand:"Toyota", name:"Toyota Long Biên", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotalongbien.png" },
  { brand:"Toyota", name:"Toyota Mỹ Đình", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotamydinh.png" },
  { brand:"Toyota", name:"Toyota Pháp Vân", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotaphapvan.png" },
  { brand:"Toyota", name:"Toyota Thái Hòa Từ Liêm", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotathaihoatuliem.png" },
  { brand:"Toyota", name:"Toyota Thăng Long", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotathanglong.png" },
  { brand:"Toyota", name:"Toyota Thanh Xuân", city:"Hà Nội", image:"image/showroom/toyota/hanoi/toyotathanhxuan.png" },
  { brand:"Toyota", name:"Toyota An Sương", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotaansuong.png" },
  { brand:"Toyota", name:"Toyota Bến Thành", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotabenthanh.png" },
  { brand:"Toyota", name:"Toyota Bình Dương", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotabinhduong.png" },
  { brand:"Toyota", name:"Toyota Đông Sài Gòn", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotadongsaigon.png" },
  { brand:"Toyota", name:"Toyota Lý Thường Kiệt", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotalythuongkiet.png" },
  { brand:"Toyota", name:"Toyota Vũng Tàu", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotavungtau.png" },
  { brand:"Toyota", name:"Toyota Phú Mỹ Hưng", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotaphumyhung.png" },
  { brand:"Toyota", name:"Toyota An Thành", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotaanthanh.png" },
  { brand:"Toyota", name:"Toyota Nguyễn Văn Lương", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotanguyenvanluong.png" },
  { brand:"Toyota", name:"Toyota Hùng Vương ", city:"TP.HCM", image:"image/showroom/toyota/hcm/toyotahungvuong.png" },
  { brand:"VinFast", name:"VinFast Tây Hồ", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfasttayho.png" },
  { brand:"VinFast", name:"VinFast Thăng Long", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastthanglong.png" },
  { brand:"VinFast", name:"VinFast Mỹ Đình", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastmydinh.png" },
  { brand:"VinFast", name:"VinFast Ocean Park", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastoceanpark.png" },
  { brand:"VinFast", name:"VinFast Phạm Văn Đồng", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastphamvandong.png" },
  { brand:"VinFast", name:"VinFast Trần Duy Hưng", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfasttranduyhung.png" },
  { brand:"VinFast", name:"VinFast Trường Chinh", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfasttruongchinh.png" },
  { brand:"VinFast", name:"VinFast VMM Times City", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastvmmtimescity.png" },
  { brand:"VinFast", name:"VinFast Nam Từ Liêm", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastvnamtulien.png" },
  { brand:"VinFast", name:"VinFast VMM Royal City", city:"Hà Nội", image:"image/showroom/vinfast/hanoi/vinfastvmmroyalcity.png" },
  { brand:"VinFast", name:"VinFast An Thái", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastanthai.png" },
  { brand:"VinFast", name:"VinFast Cộng Hòa ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastconghoa.png" },
  { brand:"VinFast", name:"VinFast Đông Sài Gòn ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastdongsaigon.png" },
  { brand:"VinFast", name:"VinFast Gò Vấp ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastgovap.png" },
  { brand:"VinFast", name:"VinFast Nam Thái  ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastnamthai.png" },
  { brand:"VinFast", name:"VinFast Nhà Bè ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastnhabe.png" },
  { brand:"VinFast", name:"VinFast Phú Mỹ Hưng ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastphumyhung.png" },
  { brand:"VinFast", name:"VinFast Quang Trung", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastquangtrung.png" },
  { brand:"VinFast", name:"VinFast Sài Gòn ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastsaigon.png" },
  { brand:"VinFast", name:"VinFast Vũng Tàu ", city:"TP.HCM", image:"image/showroom/vinfast/hcm/vinfastvungtau.png" },
];

const brandLogos = {
  'Audi':         'image/cars/audi/logo/logo-audi.png',
  'BMW':          'image/cars/bmw/logo/logo-bmw.png',
  'Ford':         'image/cars/ford/logo/logo-ford.png',
  'Hyundai':      'image/cars/hyundai/logo/logo-hyundai.png',
  'Kia':          'image/cars/kia/logo/logo-kia.png',
  'Lexus':        'image/cars/lexus/logo/logo-lexus.png',
  'Mercedes-Benz':'image/cars/mercedes-benz/logo/logo-mercedes-benz.png',
  'Porsche':      'image/cars/porsche/logo/logo-porsche.png',
  'Toyota':       'image/cars/toyota/logo/logo-toyota.png',
  'VinFast':      'image/cars/vinFast/logo/logo-vinfast.png',
};
/* Hiển thị danh sách thương hiệu (Render Brands Grid) */
function renderBrands() {
    const brands = [...new Set(showrooms.map(s => s.brand))].sort();
    const grid = document.getElementById('brandsGrid');
    grid.innerHTML = brands.map(brand => `
        <div
            class="brand-card ${brand === activeBrand ? 'active' : ''}"
            id="bc-${brand.replace(/[^a-zA-Z]/g,'')}"
            onclick="setBrand('${brand}')"
        >
            ${brandLogos[brand]
                ? `<img src="${brandLogos[brand]}" alt="${brand}" onerror="this.style.display='none'">`
                : `<div style="font-size:28px;">🚗</div>`
            }
        </div>
    `).join('');
}
/* Lọc theo thương hiệu (Filter Brand) */
function setBrand(brand) {
    activeBrand = brand;
    renderShowrooms();
    updateBrandUI(); 
    
    const resultBar = document.querySelector('.result-bar');
    if (resultBar) {
        const y = resultBar.getBoundingClientRect().top + window.pageYOffset - 74;
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }
}
/* Cập nhật class active màu đỏ cho thương hiệu */
function updateBrandUI() {
    document.querySelectorAll('.brand-card').forEach(el => el.classList.remove('active'));
    if (activeBrand) {
        const cleanId = `bc-${activeBrand.replace(/[^a-zA-Z]/g,'')}`;
        const activeCard = document.getElementById(cleanId);
        if (activeCard) activeCard.classList.add('active');
    }
}
/* Chuyển đến trang chi tiết (Navigate to Detail) */
function goToDetail(s) {
    const params = new URLSearchParams({
        name: s.name,
        brand: s.brand,
        city: s.city,
        image: s.image
    });
    window.location.href = 'showroomdetail.html?' + params.toString();
}
/* Hiển thị danh sách showroom (Render Showroom Grid) */
function renderShowrooms() {
    const grid = document.getElementById('showroomGrid');
    const keyword = (
        document.getElementById('searchInput')?.value || ''
    ).toLowerCase();
    activeCity = document.getElementById('citySelect')?.value || '';
    let list = showrooms;
    if (activeBrand) {
        list = list.filter(s => s.brand === activeBrand);
    }

    if (activeCity) {
        list = list.filter(s => s.city === activeCity);
    }
    if (keyword) {
        list = list.filter(s =>
            s.name.toLowerCase().includes(keyword) ||
            s.brand.toLowerCase().includes(keyword)
        );
    }
    document.getElementById('resultInfo').innerHTML =
        `Tìm thấy <span>${list.length}</span> showroom${activeBrand ? ' · ' + activeBrand : ''}${activeCity ? ' · ' + activeCity : ''}`;

    if (list.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏪</div>
                <p>Không tìm thấy showroom phù hợp</p>
            </div>
        `;

        return;
    }
    grid.innerHTML = list.map(s => `
        <div
            class="showroom-card"
            onclick='goToDetail(${JSON.stringify(s)})'
        >
            <div class="showroom-img-wrap">
                <img
                    src="${s.image}"
                    alt="${s.name}"
                    onerror="this.parentElement.innerHTML='<div class=\\'showroom-img-placeholder\\'></div>'"
                >

                <div class="badge-brand">
                    ${s.brand}
                </div>

                <div class="badge-city">
                    ${s.city}
                </div>
            </div>

            <div class="showroom-body">
                <div class="showroom-name">
                    ${s.name}
                </div>
            </div>
        </div>
    `).join('');
}
/* Xử lý tìm kiếm showroom (Handle Search) */
function handleSearchSubmit() {
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput
        ? searchInput.value.trim()
        : '';

    // Nếu ô tìm kiếm trống: Khóa không cho cuộn và focus lại vào ô nhập
    if (keyword === '') {
        searchInput.focus();
        return;
    }
    // Cập nhật lại danh sách dữ liệu lọc
    renderShowrooms();
    // Cuộn đến thanh kết quả (Result Bar)
    const resultBar = document.querySelector('.result-bar');
    if (resultBar) {
        const yOffset = -74;
        const y =
            resultBar.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }
}
/* Xử lý phím Enter cho ô tìm kiếm (Search Input Events) */
document.addEventListener('DOMContentLoaded', function () {
    const inputEl = document.getElementById('searchInput');
    if (inputEl) {
        inputEl.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                handleSearchSubmit();
            }
        });
    }
});
/* Hiển thị và đóng hộp thoại (Modal Controls) */
function openModal(type) {
    if (type === 'login') {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPass').value = '';
        const m = document.getElementById('loginMsg');
        m.className = 'msg';
        m.textContent = '';
    }
    if (type === 'register') {
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPass').value = '';
        const m = document.getElementById('registerMsg');
        m.className = 'msg';
        m.textContent = '';
    }
    document.getElementById(type + 'Modal').classList.add('open');
}
function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('open');
}
function switchModal(from, to) {
    closeModal(from);
    openModal(to);
}
/* Đăng nhập người dùng (User Login) */
async function doLogin() {
    const email = document.getElementById('loginEmail').value;
    const matKhau = document.getElementById('loginPass').value;
    const msg = document.getElementById('loginMsg');
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                matKhau
            })
        });
        const data = await res.json();
        if (data.success) {
            if (data.vaiTro === 'ADMIN') {
                window.location.href = 'admin.html';
                return;
            }
            currentUser = data;
            localStorage.setItem(
                'loggedInUser',
                JSON.stringify(data)
            );
            closeModal('login');
            document.getElementById('headerActions').innerHTML =
                `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${data.hoTen}</span>
                 <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
        } else {
            msg.className = 'msg error';
            msg.textContent = data.message;
        }
    } catch {
        msg.className = 'msg error';
        msg.textContent = 'Lỗi kết nối server!';
    }
}
/* Đăng ký người dùng (User Registration) */
async function doRegister() {
    const hoTen = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const matKhau = document.getElementById('regPass').value;
    const msg = document.getElementById('registerMsg');
    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hoTen,
                email,
                matKhau
            })
        });
        const data = await res.json();
        if (data.success) {
            msg.className = 'msg success';
            msg.textContent = 'Đăng ký thành công! Đang chuyển...';
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
/* Đăng xuất người dùng (User Logout) */
function logout() {
    currentUser = null;
    localStorage.removeItem('loggedInUser');
    document.getElementById('headerActions').innerHTML =
        `<a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
         <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
}
/* Đóng hộp thoại khi nhấn ra ngoài (Close Modal on Outside Click) */
document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
        if (e.target === el) {
            el.classList.remove('open');
        }
    });
});
/* Khôi phục phiên đăng nhập (Restore Session) */
function restoreSession() {
    const saved = localStorage.getItem('loggedInUser');
    if (!saved) {
        return;
    }
    currentUser = JSON.parse(saved);
    document.getElementById('headerActions').innerHTML =
        `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
         <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
}
/* Áp dụng bộ lọc thương hiệu từ URL (Apply Brand Filter from URL) */
(function applyBrandFromURL() {
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get('brand');
    if (brandParam) {
        activeBrand = brandParam;
        renderShowrooms();
        // Bỏ dòng activeBrand = ''; ở đây đi để giữ bộ lọc
        const resultBar = document.querySelector('.result-bar');
        if (resultBar) {
            const y = resultBar.getBoundingClientRect().top + window.pageYOffset - 74;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    } else {
        renderShowrooms();
    }
})();
/* Xử lý NGAY KHI ẤN CHUỘT VÀO ô tìm kiếm (Focus) */
function handleSearchFocus() {
    if (activeBrand !== '') {
        activeBrand = ''; 
        updateBrandUI();  
        renderShowrooms(); 
    }
}
/* Đặt lại toàn bộ bộ lọc (Reset All Filters) */
function resetAllShowrooms() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.value = '';
    }
    activeBrand = '';
    activeCity = '';
    updateBrandUI(); // Xóa màu đỏ của thương hiệu cũ
    renderShowrooms();
}
/* Khởi tạo hệ thống (Initialize Application) */
restoreSession();
renderBrands();
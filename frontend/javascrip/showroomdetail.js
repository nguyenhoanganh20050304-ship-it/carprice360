
const API = 'http://localhost:8080/api';
let currentUser = null;

/* ── DỮ LIỆU ĐỊA CHỈ + HOTLINE ── */
const showroomInfo = {
  // ── VinFast Hà Nội ──
  "VinFast Tây Hồ":                            { address: "Số 1 Đường Võ Chí Công, P. Tứ Liên, Quận Tây Hồ, TP. Hà Nội", phone: "1900 232 389" },
  "VinFast Mỹ Đình":                          { address: "Số 8 Phạm Hùng, P. Nghĩa Đô, TP. Hà Nội", phone: "0979 548 998" },
  "VinFast Ocean Park":                        { address: "Tầng 1, TTTM Vincom Ocean Park, Vinhomes Ocean Park, Xã Gia Lâm, TP. Hà Nội", phone: "0929 012 222" },
  "VinFast Phạm Văn Đồng":                    { address: "138 Phạm Văn Đồng, P. Đông Ngạc, TP. Hà Nội", phone: "0988 217 510" },
  "VinFast Smart City":                        { address: "341 Âu Cơ, P. Hồng Hà, TP. Hà Nội", phone: "0919 796 333" },
  "VinFast VMM Times City":                    { address: "Vincom Mega Mall Times City, 458 Minh Khai, P. Tương Mai, TP. Hà Nội", phone: "0962 592 000" },
  "VinFast Thăng Long":                        { address: "Số 68 Trịnh Văn Bô, P. Xuân Phương, TP. Hà Nội", phone: "0962 642 886" },
  "VinFast Trần Duy Hưng":                    { address: "119 Trần Duy Hưng, P. Đại Mỗ, TP. Hà Nội", phone: "0961 551 894" },
  "VinFast Trường Chinh":                      { address: "162 Trường Chinh, P. Kim Liên, TP. Hà Nội", phone: "0961 595 625" },
  "VinFast Nam Từ Liêm":                       { address: "Số 72 Đường Lê Đức Thọ, P. Mỹ Đình 2, Quận Nam Từ Liêm, TP. Hà Nội", phone: "1900 232 389" },
  "VinFast VMM Royal City":                    { address: "Vincom Mega Mall Royal City, 72A Nguyễn Trãi, P. Khương Đình, TP. Hà Nội", phone: "0925 589 999" },
  "VinFast Giải Phóng":                        { address: "Số 1 Đường Trịnh Văn Bô, P. Xuân Phương, TP. Hà Nội", phone: "0989 932 992" },
  "VinFast Long Biên":                         { address: "Số 1 Đường Trịnh Văn Bô, P. Xuân Phương, TP. Hà Nội", phone: "0989 932 992" },
  "Audi Hà Nội":                               { address: "Số 8 Phạm Hùng, P. Đại Mỗ, TP. Hà Nội", phone: "1800 888 861" },
  "BMW Lê Duẩn":                               { address: "132 Lê Duẩn, P. Văn Miếu - Quốc Tử Giám, TP. Hà Nội", phone: "0904 337 688" },
  "BMW Lê Văn Lương":                          { address: "68 Lê Văn Lương, P. Đại Mỗ, TP. Hà Nội", phone: "0936 808 699" },
  "BMW Long Biên":                             { address: "01 Ngô Gia Tự, P. Bồ Đề, TP. Hà Nội", phone: "0938 908 488" },
  "BMW Phạm Văn Đồng":                         { address: "Tầng 1, Tòa Leadvisor, 643 Phạm Văn Đồng, P. Xuân Phương, TP. Hà Nội", phone: "0904 337 688" },
  "An Đô Ford":                                { address: "168 Phạm Văn Đồng, P. Đông Ngạc, TP. Hà Nội", phone: "0987 504 668" },
  "Capital Ford":                              { address: "Ngã 3 Pháp Vân Km 8, Đường Giải Phóng, P. Định Công, TP. Hà Nội", phone: "0936 288 288" },
  "Hà Nội Ford":                               { address: "311-313 Trường Chinh, P. Phương Liệt, TP. Hà Nội", phone: "0941 666 555" },
  "Hà Thành Ford":                             { address: "Cụm CN Lai Xá, Xã Hoài Đức, TP. Hà Nội", phone: "0912 086 689" },
  "Long Biên Ford":                            { address: "Số 3 Nguyễn Văn Linh, P. Bồ Đề, TP. Hà Nội", phone: "0888 132 266" },
  "Mỹ Đình Ford":                              { address: "Số 2 Đường Tôn Thất Thuyết, P. Cầu Giấy, TP. Hà Nội", phone: "097 666 3993" },
  "Tây Mỗ Ford":                               { address: "Tổ Dân phố Nhuệ Giang, P. Tây Mỗ, TP. Hà Nội", phone: "0981 272 686" },
  "Thăng Long Ford":                           { address: "Số 105 Đường Láng Hạ, P. Đống Đa, TP. Hà Nội", phone: "0913 271 990" },
  "Thanh Xuân Ford":                           { address: "Số 88 Đường Nguyễn Xiển, P. Khương Đình, TP. Hà Nội", phone: "0935 580 000" },
  "Hyundai Phạm Hùng":                         { address: "16A Phạm Hùng, P. Nghĩa Đô, TP. Hà Nội", phone: "087 798 5555" },
  "Hyundai An Khánh":                          { address: "C24 - Lô 01 Đô thị mới Geleximco Lê Trọng Tấn, Xã An Khánh, TP. Hà Nội", phone: "0911 586 555" },
  "Hyundai Cầu Diễn":                          { address: "Ô Số 2, Lô 1, Cụm CN Lai Xá, Xã Hoài Đức, TP. Hà Nội", phone: "1900 561 212" },
  "Hyundai Đông Anh":                          { address: "Quốc Lộ 3, Tổ 25, Xã Đông Anh, TP. Hà Nội", phone: "1900 561 212" },
  "Hyundai Đông Đô":                           { address: "987 Tam Trinh, P. Yên Sở, TP. Hà Nội", phone: "0987 835 835" },
  "Hyundai Giải Phóng":                        { address: "Số 510 Đường Ngọc Hồi, Xã Đại Thanh, TP. Hà Nội", phone: "0969 510 510" },
  "Hyundai Gia Lâm":                           { address: "87 Nguyễn Huy Nhuận, KCN Phú Thị, Xã Gia Lâm, TP. Hà Nội", phone: "0981 355 555" },
  "Hyundai Hà Đông":                           { address: "Tổ 17, Do Lộ, P. Chương Mỹ, TP. Hà Nội", phone: "0913 225 225" },
  "Hyundai Lê Văn Lương":                      { address: "99 Võ Chí Công, P. Nghĩa Đô, TP. Hà Nội", phone: "0936 666 115" },
  "Hyundai Long Biên":                         { address: "Số 3+5 Nguyễn Văn Linh, P. Bồ Đề, TP. Hà Nội", phone: "1900 561 212" },
  "Hyundai Phạm Văn Đồng":                     { address: "Số 138 Phạm Văn Đồng, P. Đông Ngạc, TP. Hà Nội", phone: "1900 561 212" },
  "Hyundai Sơn Tây":                           { address: "Km 35, Quốc Lộ 32, Xã Phúc Thọ, TP. Hà Nội", phone: "1900 561 212" },
  "Hyundai Vũ Phạm Hàm":                       { address: "Tòa nhà E4, T1 Tòa CT3 Vũ Phạm Hàm, P. Cầu Giấy, TP. Hà Nội", phone: "0936 666 115" },
  "Kia Bạch Đằng":                             { address: "315 Nguyễn Khoái, P. Hồng Hà, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Cầu Diễn":                              { address: "Km 10.5, Quốc Lộ 32, P. Xuân Phương, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Đống Đa":                               { address: "568 Đường Láng, P. Láng Hạ, Quận Đống Đa, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Giải Phóng":                            { address: "Km 10, Đường Giải Phóng, Tứ Hiệp, Thanh Trì, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Long Biên":                             { address: "105A Đường Lý Sơn, P. Ngọc Thụy, Quận Long Biên, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Phạm Văn Đồng":                         { address: "Lô đất CC2, Khu ĐT TP. Giao Lưu, P. Nghĩa Đô, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Sơn Tây":                               { address: "Khu Thành Ngạnh - P. Tùng Thiện, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Thanh Xuân":                            { address: "12 Khuất Duy Tiến, P. Khương Đình, TP. Hà Nội", phone: "1900 545 591" },
  "Kia Yên Nghĩa":                             { address: "Số 899, Tổ 9, P. Phú Lương, TP. Hà Nội", phone: "1900 545 591" },
  "Lexus Thăng Long":                          { address: "Ngã tư Phạm Hùng và Dương Đình Nghệ, P. Mỹ Đình 1, TP. Hà Nội", phone: "1800 588 888" },
  "Mercedes-Benz An Du Phạm Hùng":            { address: "11 Phạm Hùng, P. Cầu Giấy, TP. Hà Nội", phone: "1900 666 888" },
  "Mercedes-Benz Haxaco Kim Giang":           { address: "256 Kim Giang, P. Định Công, TP. Hà Nội", phone: "1800 6210" },
  "Mercedes-Benz Haxaco Láng Hạ":            { address: "46 Láng Hạ, P. Láng Hạ, Quận Đống Đa, TP. Hà Nội", phone: "1800 6210" },
  "Mercedes-Benz Vietnam Star Đại Từ":        { address: "Lô D5-1, KCN Hà Nội - Đài Tư, 386 Nguyễn Văn Linh, P. Phúc Lợi, TP. Hà Nội", phone: "1900 599 978" },
  "Mercedes-Benz Vietnam Star Hoàn Kiếm":     { address: "05 Lê Thánh Tông, P. Phan Chu Trinh, Quận Hoàn Kiếm, TP. Hà Nội", phone: "1900 599 978" },
  "Porsche Hà Nội":                            { address: "562 Nguyễn Văn Cừ, P. Gia Thụy, Quận Long Biên, TP. Hà Nội", phone: "1800 1010" },
  "Toyota Giải Phóng":                         { address: "807 Giải Phóng, P. Giáp Bát, Quận Hoàng Mai, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Hà Đông":                            { address: "977-979 Đường Quang Trung kéo dài, P. Yên Nghĩa, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Hoàn Kiếm":                          { address: "Số 94 Ngô Thì Nhậm, P. Phạm Đình Hổ, Quận Hai Bà Trưng, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota IDC Hoài Đức":                       { address: "Km15+575, Quốc lộ 32, Thị trấn Trạm Trôi, Huyện Hoài Đức, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Long Biên":                          { address: "Số 7-9 Đường Nguyễn Văn Linh, P. Gia Thụy, Quận Long Biên, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Mỹ Đình":                            { address: "Số 15 Đường Phạm Hùng, P. Mỹ Đình 2, Quận Nam Từ Liêm, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Pháp Vân":                           { address: "Tổ 10, Khu Pháp Vân, P. Hoàng Liệt, Quận Hoàng Mai, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Thái Hòa Từ Liêm":                  { address: "Ngã 3 Tố Hữu - Mộ Lao, P. Trung Văn, Quận Nam Từ Liêm, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Thăng Long":                         { address: "Số 316 Đường Cầu Giấy, P. Dịch Vọng, Quận Cầu Giấy, TP. Hà Nội", phone: "1900 633 678" },
  "Toyota Thanh Xuân":                         { address: "Số 315 Đường Trường Chinh, P. Khương Mai, Quận Thanh Xuân, TP. Hà Nội", phone: "1900 633 678" },
  // HCM
  "Audi Hồ Chí Minh":                         { address: "Số 6B Lầu 1, Đường Tôn Đức Thắng, P. Bến Nghé, Quận 1, TP. HCM", phone: "1800 888 898" },
  "Audi Phú Mỹ Hưng":                         { address: "Khu dân cư Lavida, Đường Nguyễn Văn Linh, P. Tân Phong, Quận 7, TP. HCM", phone: "1800 888 898" },
  "Audi Tân Bình":                             { address: "Lô IV-22 Tây Thạnh, P. Tây Thạnh, TP. HCM", phone: "1800 888 898" },
  "BMW Bình Dương":                            { address: "56 Đại Lộ Bình Dương, KP Bình Giao, P. Thuận Giao, TP. HCM", phone: "0901 889 798" },
  "BMW Hồ Chí Minh":                          { address: "P. Thủ Đức, TP. Hồ Chí Minh", phone: "1800 588 899" },
  "BMW MINI Sala Quận 2":                      { address: "Số 12 Đường Mai Chí Thọ, P. An Khánh, TP. HCM", phone: "1800 588 899" },
  "BMW Nguyễn Văn Trỗi":                      { address: "Số 80 Nguyễn Văn Trỗi, P. Phú Nhuận, TP. HCM", phone: "1800 588 899" },
  "BMW Phú Mỹ Hưng":                          { address: "314 Nguyễn Văn Linh, P. Tân Thuận, TP. HCM", phone: "1800 588 899" },
  "Bà Rịa Ford":                               { address: "QL51, Phước Trung, Bà Rịa, Bà Rịa - Vũng Tàu", phone: "1900 599 998" },
  "Bến Thành Ford":                            { address: "Số 39 Chế Lan Viên, P. Tây Thạnh, TP. HCM", phone: "1900 599 998" },
  "Bình Dương Ford":                           { address: "Lô C13, Đường Hùng Vương, P. Bình Dương, TP. HCM", phone: "1900 599 998" },
  "City Ford":                                 { address: "218 Quốc Lộ 13, P. Hiệp Bình, TP. HCM", phone: "1900 599 998" },
  "Dĩ An Ford":                                { address: "28 Đường DT743, KP. Thống Nhất 1, P. Dĩ An, TP. HCM", phone: "1800 588 888" },
  "Gia Định Ford":                             { address: "900 Quốc Lộ 1A, P. Thới An, TP. HCM", phone: "0933 681 123" },
  "Nam Sài Gòn Ford":                          { address: "161F Dạ Nam, P. Chánh Hưng, TP. HCM", phone: "1800 588 888" },
  "Phổ Quang Ford":                            { address: "104 Phổ Quang, P. Tân Sơn Hòa, TP. HCM", phone: "1900 565 650" },
  "Phú Mỹ Ford":                               { address: "507C Xa Lộ Hà Nội, P. An Khánh, TP. HCM", phone: "1900 252 515" },
  "Sài Gòn Ford":                              { address: "Số 61A Cao Thắng, P. Bàn Cờ, TP. HCM", phone: "093 206 9908" },
  "Suối Tiên Ford":                            { address: "35 Hoàng Hữu Nam, P. Tăng Nhơn Phú, TP. HCM", phone: "0939 813 535" },
  "Tân Thuận Ford":                            { address: "Lô DVTM-08 và DVTM-11, Đường Số 7, Khu CX Tân Thuận, TP. HCM", phone: "0916 489 919" },
  "Vũng Tàu Ford":                             { address: "Số 40A, Đường 30/04, P. Tam Thắng, TP. HCM", phone: "1900 599 998" },
  "Western Ford":                              { address: "530 Đường Kinh Dương Vương, P. An Lạc, TP. HCM", phone: "1900 636 636" },
  "Hyundai An Phú":                            { address: "100 Võ Chí Công, P. Cát Lái, TP. HCM", phone: "1800 561 561" },
  "Hyundai Bà Rịa Vũng Tàu":                  { address: "Số 611 Quốc Lộ 51, KP. Hương Sơn, P. Long Hương, TP. HCM", phone: "1800 561 561" },
  "Hyundai Bình Dương":                        { address: "48A Đại Lộ Bình Dương, P. Phú Lợi, TP. HCM", phone: "1800 561 561" },
  "Hyundai Đông Sài Gòn":                     { address: "409 Đường Nguyễn Văn Bá, P. Thủ Đức, TP. HCM", phone: "1800 561 561" },
  "Hyundai Gia Định":                          { address: "166-168 Phạm Văn Đồng, P. Hạnh Thông, TP. HCM", phone: "1800 561 561" },
  "Hyundai Kinh Dương Vương":                  { address: "701 Kinh Dương Vương, P. An Lạc, TP. HCM", phone: "1800 561 561" },
  "Hyundai Miền Nam":                          { address: "175 Bình Long, P. Bình Hưng Hòa, TP. HCM", phone: "1800 561 561" },
  "Hyundai Ngọc An":                           { address: "70 Lương Định Của, Xã Bình Khánh, TP. HCM", phone: "1800 561 561" },
  "Hyundai Phú Mỹ Hưng":                      { address: "1052 Nguyễn Văn Linh, P. Tân Hưng, TP. HCM", phone: "1800 561 561" },
  "Hyundai Trường Chinh":                      { address: "Toà nhà H3 - 384 Hoàng Diệu, P. Xóm Chiếu, TP. HCM", phone: "1800 561 561" },
  "Hyundai Việt Hàn":                          { address: "387 Quốc Lộ 13, P. Hiệp Bình, TP. HCM", phone: "1800 561 561" },
  "Kia Bà Rịa":                                { address: "Quốc Lộ 51, P. Bà Rịa, TP. HCM", phone: "1900 545 591" },
  "Kia Bình Dương":                            { address: "56/9 Đại Lộ Bình Dương, P. Thuận Giao, TP. HCM", phone: "0938 807 407" },
  "Kia Bình Tân":                              { address: "75 Võ Văn Kiệt, P. An Lạc, TP. HCM", phone: "1900 545 591" },
  "Kia Bình Triệu":                            { address: "153 Quốc Lộ 13, P. Hiệp Bình, TP. HCM", phone: "1900 545 591" },
  "Kia Gò Vấp":                                { address: "189 Nguyễn Oanh, P. Gò Vấp, TP. HCM", phone: "0938 809 860" },
  "Kia Hồ Chí Minh":                          { address: "P. Phú Thuận, TP. HCM", phone: "0938 801 888" },
  "Kia Hùng Vương":                            { address: "8A Lý Thường Kiệt, P. Chợ Lớn, TP. HCM", phone: "0938 809 999" },
  "Kia Kinh Dương Vương":                      { address: "309A Kinh Dương Vương, P. An Lạc, TP. HCM", phone: "0988 806 868" },
  "Kia Nguyễn Văn Trỗi":                      { address: "80 Nguyễn Văn Trỗi, P. Phú Nhuận, TP. HCM", phone: "0938 807 607" },
  "Kia Phan Huy Ích":                          { address: "385 Phan Huy Ích, P. An Hội Tây, TP. HCM", phone: "0944 033 035" },
  "Kia Phú Mỹ Hưng":                          { address: "314 Nguyễn Văn Linh, P. Tân Thuận, TP. HCM", phone: "0903 091 377" },
  "Kia Tân Sơn Nhất":                         { address: "Số 7 Hoàng Minh Giám, P. Đức Nhuận, TP. HCM", phone: "0938 807 607" },
  "Kia Tân Uyên":                              { address: "60 Nguyễn Văn Linh, P. Tân Hiệp, TP. HCM", phone: "0938 806 868" },
  "Kia Thảo Điền":                             { address: "03 Quốc Hương, P. An Khánh, TP. HCM", phone: "0938 807 607" },
  "Kia Thiso Sala":                            { address: "10 Mai Chí Thọ, P. An Khánh, TP. HCM", phone: "0938 809 999" },
  "Kia Thủ Dầu Một":                           { address: "1220 Đại Lộ Bình Dương, P. Chánh Hiệp, TP. HCM", phone: "0938 807 407" },
  "Kia Trường Chinh":                          { address: "38 Chế Lan Viên, P. Tây Thạnh, TP. HCM", phone: "0938 807 607" },
  "Kia Vũng Tàu":                              { address: "426 Đường Thống Nhất Mới, P. Tam Thắng, TP. HCM", phone: "0938 806 868" },
  "Lexus Trung Tâm Sài Gòn":                  { address: "264 Trần Hưng Đạo, P. Cầu Ông Lãnh, TP. HCM", phone: "1800 588 885" },
  "Mercedes-Benz Haxaco Điện Biên Phủ":       { address: "333 Điện Biên Phủ, P. An Hội Đông, TP. HCM", phone: "0938 688 333" },
  "Mercedes-Benz Haxaco Võ Văn Kiệt":         { address: "2008 Đại Lộ Võ Văn Kiệt, P. An Lạc, TP. HCM", phone: "0909 888 200" },
  "Mercedes-Benz Vietnam Star Bình Dương":     { address: "Số 4, The Canary, Đại Lộ Bình Dương, P. Bình Hòa, TP. HCM", phone: "0919 967 777" },
  "Mercedes-Benz Vietnam Star Chế Lan Viên":  { address: "Số 38 Chế Lan Viên, P. Tây Thạnh, TP. HCM", phone: "1800 6142" },
  "Mercedes-Benz Vietnam Star Phú Mỹ Hưng":   { address: "811-813 Nguyễn Văn Linh, P. Tân Hưng, TP. HCM", phone: "0906 777 111" },
  "Mercedes-Benz Vietnam Star Trường Chinh":   { address: "32 Tân Thắng, P. Bình Hưng Hòa, TP. HCM", phone: "0906 777 222" },
  "Mercedes-Benz Vũng Tàu":                   { address: "30 Tháng 4, P. Tam Thắng, TP. HCM", phone: "0919 967 777" },
  "Porsche Sài Gòn":                           { address: "KCX Tân Thuận, Số 4 Đường Số 7, P. Tân Thuận, TP. HCM", phone: "1800 646 888" },
  "Toyota An Sương":                           { address: "382 Quốc Lộ 22, P. Trung Mỹ Tây, TP. HCM", phone: "0909 550 660" },
  "Toyota Bến Thành":                          { address: "Số 262 Trần Hưng Đạo, P. Cầu Ông Lãnh, TP. HCM", phone: "0909 800 700" },
  "Toyota Bình Dương":                         { address: "Lô C13 Đường Hùng Vương, P. Bình Dương, TP. HCM", phone: "0909 888 911" },
  "Toyota Đông Sài Gòn":                       { address: "507 Đ. Võ Nguyên Giáp, P. An Khánh, TP. HCM", phone: "028 3512 8888" },
  "Toyota Hiroshima Tân Cảng":                 { address: "63A Nguyễn Văn Lượng, P. Gò Vấp, TP. HCM", phone: "028 3985 6666" },
  "Toyota Lý Thường Kiệt":                     { address: "151A Lý Thường Kiệt, P. Tân Hòa, TP. HCM", phone: "028 3863 8888" },
  "Toyota Ninh Kiều":                          { address: "26 Kinh Dương Vương, P. Phú Lâm, TP. HCM", phone: "0909 635 535" },
  "Toyota Phú Mỹ Hưng":                        { address: "65 Đường số 2, Tổ 9, Khu dân cư ven sông, P. Tân Hưng, TP. HCM", phone: "0909 600 885" },
  "Toyota Tân Cảng":                           { address: "15 Bùi Thanh Khiết, Khu phố 3, Xã Tân Nhựt, TP. HCM", phone: "0909 808 889" },
  "Toyota Tây Ninh":                           { address: "168 Đường 3/2, P. Rạch Dừa, TP. HCM", phone: "0909 686 838" },
  "Toyota Tsusho Bình Dương":                  { address: "56 Đại Lộ Bình Dương, P. Bình Hòa, TP. HCM", phone: "0909 888 911" },
  "Toyota Used Car Đông Sài Gòn":              { address: "507 Đ. Võ Nguyên Giáp, P. An Khánh, TP. HCM", phone: "028 3512 8888" },
  "Toyota Vũng Tàu":                           { address: "Số 168 Đường 30 Tháng 4, P. Rạch Dừa, TP. Bà Rịa - Vũng Tàu", phone: "0909 686 838" },
  "Toyota An Thành":                           { address: "Số 7 Đường Số 7, P. Tân Phú, Quận 7, TP. HCM", phone: "0909 550 660" },
  "Toyota Nguyễn Văn Lương":                   { address: "63A Nguyễn Văn Lượng, P. Gò Vấp, TP. HCM", phone: "028 3985 6666" },
  "Toyota Hùng Vương":                         { address: "8A Lý Thường Kiệt, P. Tân Thành, Quận 6, TP. HCM", phone: "0909 800 700" },
  "VinFast Cộng Hòa":                          { address: "15-17 Cộng Hòa, P. Tân Sơn Nhất, TP. HCM", phone: "1900 232 389" },
  "VinFast Landmark 81":                       { address: "Số 464 Kinh Dương Vương, P. An Lạc, TP. HCM", phone: "1900 232 389" },
  "VinFast Phú Mỹ Hưng":                      { address: "1489 Nguyễn Văn Linh, P. Tân Hưng, Quận 7, TP. HCM", phone: "1900 232 389" },
  "VinFast Quận 2":                            { address: "Số 391 Xa lộ Hà Nội, P. An Khánh, TP. HCM", phone: "1900 232 389" },
  "VinFast Sala":                              { address: "786B Nguyễn Kiệm, P. Hạnh Thông, TP. HCM", phone: "0939 680 686" },
  "VinFast An Thái":                           { address: "Khu đô thị Vinhomes Grand Park, P. Long Thạnh Mỹ, TP. HCM", phone: "1900 232 389" },
  "VinFast Đông Sài Gòn":                      { address: "Số 1 Võ Nguyên Giáp, P. An Khánh, Quận 2, TP. HCM", phone: "1900 232 389" },
  "VinFast Gò Vấp":                            { address: "Số 186 Quang Trung, P. Gò Vấp, TP. HCM", phone: "1900 232 389" },
  "VinFast Nam Thái":                          { address: "Lô NT-02, Khu dân cư Nam Thái, P. Phú Mỹ, Quận 7, TP. HCM", phone: "1900 232 389" },
  "VinFast Nhà Bè":                            { address: "Đường Nguyễn Hữu Thọ, P. Nhà Bè, TP. HCM", phone: "1900 232 389" },
  "VinFast Quang Trung":                       { address: "190 Quang Trung, P. Gò Vấp, TP. HCM", phone: "1900 232 389" },
  "VinFast Sài Gòn":                           { address: "Số 1 Lê Duẩn, P. Bến Nghé, Quận 1, TP. HCM", phone: "1900 232 389" },
  "VinFast Vũng Tàu":                          { address: "Đường 30 Tháng 4, P. Rạch Dừa, TP. Bà Rịa - Vũng Tàu", phone: "1900 232 389" },
  "VinFast Thảo Điền":                         { address: "190 Quang Trung, P. Gò Vấp, TP. HCM", phone: "1900 232 389" },
};

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

const brandCarMap = {};
function getCarImage(car, index = 1) {
  if (!car || !car.id) return '';
  return `${API}/cars/${car.id}/images/${index}`;
} 
/*  KHỞI TẠO TRANG (Initialize page) */
function init() {
  const p = new URLSearchParams(window.location.search);
  const name  = p.get('name')  || '';
  const brand = p.get('brand') || '';
  const city  = p.get('city')  || '';
  const image = p.get('image') || '';

  document.title = name + ' - CarPrice360';
  // Kiểm tra và gán tên Breadcrumb
  const bcNameEl = document.getElementById('bcName');
  if (bcNameEl) bcNameEl.textContent = name;
  // Kiểm tra và gán ảnh Hero
  const img = document.getElementById('heroImg');
  if (img) {
    img.src = image; 
    img.alt = name;
  }
  // Kiểm tra và gán thông tin Brand + Name + City
  const infoBrandTagEl = document.getElementById('infoBrandTag');
  if (infoBrandTagEl) infoBrandTagEl.textContent = brand;
  const infoNameEl = document.getElementById('infoName');
  if (infoNameEl) infoNameEl.textContent = name;

  const infoCityBadgeEl = document.getElementById('infoCityBadge');
  if (infoCityBadgeEl) infoCityBadgeEl.textContent = city;
  // Kiểm tra và gán Logo thương hiệu
  const logo = brandLogos[brand];
  const el = document.getElementById('infoBrandLogo');
  if (logo && el) {
    el.src = logo; 
    el.style.display = 'block';
  }
  // Kiểm tra và gán Địa chỉ + hotline từ data map
  const info = showroomInfo[name.trim()];
  const infoAddressEl = document.getElementById('infoAddress');
  const infoPhoneEl = document.getElementById('infoPhone');
  if (info) {
    if (infoAddressEl) infoAddressEl.textContent = info.address;
    if (infoPhoneEl) infoPhoneEl.innerHTML = `<span class="phone-number">${info.phone}</span>`;
  } else {
    if (infoAddressEl) infoAddressEl.textContent = 'Đang cập nhật';
    if (infoPhoneEl) infoPhoneEl.textContent = 'Đang cập nhật';
  }
  // Kiểm tra và gán Tiêu đề xe của hãng
  const carBrandTitleEl = document.getElementById('carBrandTitle');
  if (carBrandTitleEl) carBrandTitleEl.textContent = brand;

  loadCarsByBrand(brand);
}
/*  ĐỊNH DẠNG GIÁ (Format price) */
function formatPrice(gia) {
  if (gia >= 1000) return (gia/1000).toFixed(gia%1000===0?0:1) + ' tỷ';
  return gia + ' triệu';
}
/*  TẢI XE THEO HÃNG (Load cars by brand)  */
async function loadCarsByBrand(brand) {
  const grid = document.getElementById('carGrid');
  const dbBrand = brandCarMap[brand] || brand;
  try {
    const res = await fetch(`${API}/cars`);
    const cars = await res.json();
    const filtered = cars.filter(c => c.thuongHieu === dbBrand);
    if (!filtered.length) { grid.innerHTML = '<div class="loading">Chưa có dữ liệu xe</div>'; return; }
    grid.innerHTML = filtered.map(car => {
      const imgSrc = car.id? `${API}/cars/${car.id}/images/1` : '';
      return `<div class="car-card" onclick="location.href='cardetail.html?id=${car.id}'">
        <div class="car-img-wrap">${imgSrc ? `<img src="${imgSrc}" alt="${car.tenXe}" onerror="this.style.display='none'">` : ''}</div>
        <div class="car-body">
          <div class="car-brand-tag">${car.thuongHieu}</div>
          <div class="car-name">${car.tenXe}</div>
          <div class="car-price">${formatPrice(car.gia)}</div>
        </div>
      </div>`;
    }).join('');
  } catch { grid.innerHTML = '<div class="loading">⚠️ Không thể kết nối server</div>'; }
}

/* ── XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ (Auth system) ── */

/* MỞ MODAL (Open modal) */
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

/* ĐÓNG MODAL (Close modal) */
function closeModal(type) {
  document.getElementById(type + 'Modal').classList.remove('open');
}

/* CHUYỂN MODAL (Switch modal) */
function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}

/* ĐĂNG NHẬP (Login) */
async function doLogin() {

  const email = document.getElementById('loginEmail').value,
        matKhau = document.getElementById('loginPass').value,
        msg = document.getElementById('loginMsg');

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

/* ĐĂNG KÝ (Register)  */
async function doRegister() {

  const hoTen = document.getElementById('regName').value,
        email = document.getElementById('regEmail').value,
        matKhau = document.getElementById('regPass').value,
        msg = document.getElementById('registerMsg');

  try {

    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hoTen, email, matKhau })
    });

    const data = await res.json();

    if (data.success) {
      msg.className = 'msg success';
      msg.textContent = 'Đăng ký thành công!';

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

/*  ĐĂNG XUẤT (Logout)  */
function logout() {
  currentUser = null;
  localStorage.removeItem('loggedInUser');

  document.getElementById('headerActions').innerHTML =
    `<a class="btn-login btn-outline" onclick="openModal('login')">Đăng nhập</a>
     <a class="btn-login btn-solid" onclick="openModal('register')">Đăng ký</a>`;
}

/* CLICK NGOÀI MODAL ĐỂ ĐÓNG (Close on overlay click) */
document.querySelectorAll('.modal-overlay')
  .forEach(el => el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('open');
  }));

/* KHÔI PHỤC PHIÊN (Restore session) */
function restoreSession() {

  const saved = localStorage.getItem('loggedInUser');
  if (!saved) return;

  currentUser = JSON.parse(saved);

  document.getElementById('headerActions').innerHTML =
    `<span style="color:white;padding:8px 14px;font-size:14px">👋 ${currentUser.hoTen}</span>
     <a class="btn-login btn-outline" onclick="logout()">Đăng xuất</a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  restoreSession();
  init();
});

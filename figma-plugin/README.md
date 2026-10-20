# Bộ Tạo File Figma Design Tự Động Cho NutriDaily

Bộ script plugin Figma này được tạo ra để tự động vẽ toàn bộ 11 màn hình giao diện ứng dụng NutriDaily chuẩn kích thước iPhone (390 x 844 px) và thiết lập sẵn 100% các luồng tương tác Prototype (Figma Reactions).

---

## 📱 Danh Sách 11 Màn Hình Được Tạo
1. **01_Welcome** (Màn hình Chào mừng, Banner hình vẽ, Nút Bắt đầu / Khám phá)
2. **02_Setup** (Thiết lập mục tiêu, chọn thói quen, nhập kcal/nước)
3. **03_Today** (Trang chủ Hôm nay: Vòng tròn năng lượng, Macro đạm/tinh bột/béo, Bữa ăn, Theo dõi nước, Link thực đơn)
4. **04_Diary** (Nhật ký ăn uống: Bộ chọn ngày, Tổng năng lượng & Mục tiêu, Danh sách món theo bữa Sáng/Trưa/Phụ)
5. **05_Search** (Thêm món ăn: Thanh tìm kiếm, Bộ lọc Tất cả/Gần đây/Phổ biến, Danh sách 8 món ăn kèm calo & tag)
6. **06_FoodDetail** (Chi tiết món ăn: Ảnh minh họa, Calo, Tỉ lệ đạm/bột/béo, Stepper tăng giảm khẩu phần, Nút thêm/hủy/xóa)
7. **07_DeleteModal** (Modal xác nhận xóa món: Lớp phủ mờ backdrop, Hộp thoại cảnh báo, Nút Xóa món / Giữ lại)
8. **08_Planner** (Thực đơn kế hoạch: Thanh 7 ngày trong tuần, Kế hoạch ngày mai, Các thẻ món ăn, Nút đổi món)
9. **09_Swap** (Đổi món ăn: Hiển thị món hiện tại, Danh sách lựa chọn thay thế kèm calo, Xác nhận đổi món)
10. **10_Progress** (Tiến độ: Biểu đồ cột năng lượng tuần, Thống kê nước uống trung bình, Chi tiết ngày)
11. **11_Profile** (Cá nhân: Avatar, Thông tin tài khoản, Điều chỉnh mục tiêu mỗi ngày, Cài đặt)

---

## 🔗 Luồng Tương Tác Prototype (Figma Flows) Được Cấu Hình Sẵn
- **Màn hình Welcome**:
  - Ấn "Bắt đầu" ➔ Chuyển đến `02_Setup`
  - Ấn "Khám phá bản mẫu" ➔ Chuyển đến `03_Today`
- **Màn hình Setup**:
  - Ấn nút Back ➔ Quay lại `01_Welcome`
  - Ấn "Lưu và tiếp tục" hoặc "Bỏ qua" ➔ Chuyển đến `03_Today`
- **Thanh điều hướng dưới cùng (Bottom Navigation)**:
  - Tự động liên kết chéo giữa cả 5 tab chính (`Hôm nay`, `Nhật ký`, `Thực đơn`, `Tiến độ`, `Cá nhân`) với hiệu ứng Smart Animate mượt mà.
- **Từ Hôm nay (Today)**:
  - Ấn Avatar "AN" ➔ Chuyển đến `11_Profile`
  - Ấn "Xem chi tiết ›" hoặc các dòng bữa ăn ➔ Chuyển đến `04_Diary`
  - Ấn "+ Thêm món" ➔ Chuyển đến `05_Search`
  - Ấn "Xem thực đơn hôm nay" ➔ Chuyển đến `08_Planner`
- **Từ Nhật ký (Diary)**:
  - Ấn nút "+" trên header hoặc "+ Thêm món" ➔ Chuyển đến `05_Search`
  - Ấn vào từng dòng món ăn đã ghi ➔ Chuyển đến `06_FoodDetail`
- **Từ Thêm món (Search)**:
  - Ấn nút Back ➔ Quay lại `04_Diary`
  - Ấn vào từng món gợi ý ➔ Chuyển đến `06_FoodDetail`
- **Từ Chi tiết món (FoodDetail)**:
  - Ấn Back hoặc "Hủy" hoặc "Thêm vào bữa trưa" ➔ Quay lại `04_Diary`
  - Ấn biểu tượng Thùng rác 🗑 ➔ Mở modal `07_DeleteModal`
- **Từ Modal Xóa (DeleteModal)**:
  - Ấn "Giữ lại" ➔ Quay lại `06_FoodDetail`
  - Ấn "Xóa món" ➔ Trở về `04_Diary`
- **Từ Thực đơn (Planner)**:
  - Ấn "Đổi món bữa trưa" ➔ Chuyển đến `09_Swap`
- **Từ Đổi món (Swap)**:
  - Ấn nút Back, "Hủy" hoặc "Xác nhận đổi món" ➔ Quay lại `08_Planner`

---

## 🚀 Cách Đưa Thiết Kế Vào Figma (Chọn 1 Trong 2 Cách Rất Dễ)

### 🌟 Cách 1: Kéo thả trực tiếp file SVG vào Figma (Dành cho CẢ Figma Web và Figma Desktop - Nhanh nhất)
1. Mở Figma (trên trình duyệt Web hoặc Desktop).
2. Tạo một file thiết kế mới (**+ Design file**).
3. Tìm file **`nutridaily_figma_screens.svg`** trong thư mục `figma-plugin/` trên máy tính của bạn.
4. **Kéo thả (Drag & Drop)** file `nutridaily_figma_screens.svg` trực tiếp vào giữa trang làm việc của Figma.
5. Ngay lập tức, toàn bộ 11 màn hình iPhone với đầy đủ màu sắc, chi tiết, chữ, thẻ card và icon vector sẽ xuất hiện và có thể chỉnh sửa 100%!

---

### 🌟 Cách 2: Dùng Figma Plugin (Yêu cầu dùng Figma Desktop App)
> ⚠️ **Lưu ý quan trọng**: Không bấm nút **"Import"** ở ngoài trang chủ/Dashboard của Figma (nút đó chỉ dùng cho file `.fig`).
> Tính năng import plugin từ manifest chỉ hoạt động khi bạn **đã mở một file thiết kế** trên phần mềm **Figma Desktop** (ứng dụng cài trên máy tính).

1. Mở phần mềm **Figma Desktop**.
2. Nhấn **+ Design file** để tạo một file trống mới.
3. Khi file đã mở ra, vào menu Figma ở góc trái trên cùng ➔ **Plugins** ➔ **Development** ➔ **Import plugin from manifest...**.
4. Chọn file `figma-plugin/manifest.json`.
5. Nhấp chuột phải vào màn hình ➔ **Plugins** ➔ **Development** ➔ Chọn **NutriDaily App Design Generator** và ấn **Run**.
6. Tất cả 11 màn hình sẽ được vẽ tự động và nối sẵn tất cả các dây Prototype tương tác!

---

## ▶️ Trải Nghiệm Prototype
Sau khi plugin chạy xong:
1. Nhấn vào màn hình `01_Welcome` (đã được đặt làm `FlowStartingPoint`: **NutriDaily Mobile App Flow**).
2. Nhấn nút **Present** (hoặc tổ hợp phím `Ctrl + Alt + Enter`) ở góc phải trên cùng của Figma để bắt đầu trình chiếu và bấm thử tất cả các luồng tương tác!

# NutriDaily — Prototype tương tác (Nhóm 04)

Ứng dụng giúp sinh viên **ghi bữa ăn món Việt trong 2–3 chạm**, hiểu dinh dưỡng mà không bị áp lực và **lên thực đơn theo ngân sách**.
Môn Tư duy thiết kế và Trải nghiệm người dùng · Chủ đề 13 · Lớp DHKTPM20A_KSTN.

## Chạy thử

- Windows: mở `run-local.bat`.
- macOS/Linux: `npm install` rồi `npx vite --port 8443`, mở http://localhost:8443.

Đăng ký / đăng nhập bằng email + mật khẩu (băm SHA-256 kèm salt). Bản frontend lưu tài khoản và dữ liệu từng người trong trình duyệt (localStorage); khi có backend chỉ cần thay `src/lib/auth.ts` và phần lưu trong `src/state/useNutritionStore.ts`.

Mở thẳng một màn bằng liên kết: `#today`, `#diary`, `#planner`, `#planBuilder`, `#progress`, `#profile`, `#reminders`, `#privacy`.

## Màn hình → yêu cầu thiết kế

| Màn | Điểm chính | Yêu cầu / Pain-point |
| --- | --- | --- |
| 01 Đăng ký / Đăng nhập | Kiểm tra lỗi ngay trên form, ẩn/hiện mật khẩu, đăng xuất có xác nhận | — |
| 02 Thiết lập | Bước 1: chiều cao, cân nặng, tuổi → BMI (ngưỡng châu Á) và kcal gợi ý (Mifflin–St Jeor) | Gợi ý cá nhân hóa |
| 03 Hôm nay | Nút “Ghi bữa …” theo giờ, vòng calo, chạm chất dinh dưỡng để xem giải thích, thông điệp trung tính khi vượt mức | FR-01, FR-05, UX-02 · PP1, PP3, PP5 |
| 05 Thêm món | “Gợi ý cho bạn” theo kcal còn lại + BMI, Gần đây (yêu thích & hợp bữa lên đầu), Yêu thích, ≤ 30k; + ghi ngay khẩu phần vừa; không thấy món → Món tự đặt | FR-01, FR-02, FR-09 · PP1, PP2 |
| 06 Chi tiết món | Khẩu phần **Nhỏ / Vừa / Lớn** (gram là tùy chọn), giá tham khảo, nhãn “ước tính”, ★ yêu thích | FR-03 · PP2 |
| 08 Thực đơn | 7 ngày tới, thanh ngân sách ngày, “Đã ăn” ghi thẳng vào nhật ký, đổi món | FR-06 · PP4 |
| 09 Đổi món | Sắp theo Rẻ hơn / Gần kcal / Nhiều đạm, chênh lệch kcal và giá | FR-06 · PP4 |
| 10 Tiến độ | Dữ liệu tuần tính thật, câu tổng kết tích cực, ngày trống không bị “phạt” | FR-07 · PP5 |
| 13 Nhắc nhở | Mặc định tắt; bật/tắt từng loại, chọn giờ, không nhắc cuối tuần | FR-08 · PP5 |
| 14 Tạo thực đơn tuần | Mục tiêu, ngân sách 30–150k/ngày, món không ăn, có tự nấu | FR-06 · PP4 |
| 15 Món tự đặt | Đặt tên + chọn món gần giống để mượn ước tính | FR-09 · PP2 |
| 16 Quyền riêng tư | Lưu gì / không lưu gì, xóa toàn bộ (gõ “XÓA”) | FR-10, SAF-01 |

## Phiên bản

| Phiên bản | Nội dung |
| --- | --- |
| `a5727bf` (đề xuất tag `v0.1-lofi`) | Bản đầu tiên, giao diện cơ bản |
| `8713dcb` | Design system, dark mode, 12 màn |
| bản hiện tại (đề xuất tag `v1.0-hifi`) | 17 màn, 34 món Việt có giá, khẩu phần Nhỏ/Vừa/Lớn, thực đơn theo ngân sách, nhắc nhở, quyền riêng tư |

> Số liệu dinh dưỡng và giá là **ước tính tham khảo**, không dùng cho mục đích y tế.

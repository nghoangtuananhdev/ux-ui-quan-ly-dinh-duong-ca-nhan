# UI/UX UPGRADE PLAN — NutriDaily (Interactive Prototype)

> Tài liệu đặc tả cho AI Coding Agent. Thực thi tuần tự: Phase 1–4 (mục 5, nâng cấp giao diện) → Phase 5–6 (mục 6, bổ sung chức năng) → Phase 7–9 (mục 7, chạy thực tế trên trình duyệt). **Phạm vi chỉ gồm giao diện và chức năng frontend, không có backend** (không server, không tài khoản, dữ liệu lưu trên thiết bị). Đọc mục 7.1 (hai chế độ build) **trước khi bắt đầu Phase 1**, vì nó quyết định cách tổ chức code ngay từ đầu. Mỗi checklist item là một đơn vị công việc độc lập, có tiêu chí hoàn thành. Đọc mục 6.4 (data model) **trước** khi làm item 1.6 để tránh phải migrate store hai lần.

## 0. Bối cảnh kỹ thuật & ràng buộc bắt buộc

- **Stack:** React 19 + TypeScript 5.7 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`, không có `tailwind.config`). Chạy trong Figma Make, dev server đã chạy sẵn (port 8443) — **không** tự khởi động server.
- **Hiện trạng code:** toàn bộ UI nằm trong `src/App.tsx` (278 dòng, nhiều dòng JSX > 1.000 ký tự), CSS viết tay trong `src/index.css` (191 dòng, class kiểu BEM rút gọn). Tailwind được import nhưng **gần như không dùng**.
- **Không có thư viện UI/icon/chart.** Phase 1–6 không thêm dependency. Phase 7–9 **chỉ** được thêm các thư viện frontend có tên trong mục 7: `react-router`, `zod`, `vite-plugin-pwa`, `@zxing/browser` (tùy chọn), cùng các công cụ dev `vitest`, `@testing-library/react`, `@playwright/test`, `@axe-core/playwright`. Mỗi thư viện ghim phiên bản chính xác trong `package.json`. **Không** thêm SDK backend, dịch vụ đăng nhập, analytics hay theo dõi lỗi từ xa.
- **Cách viết style (quy tắc duy nhất):**
  - Component mới hoặc được viết lại dùng **Tailwind utility class** với token ở 2.1. Tên class trong các khối "DOM" của mục 4 và 6 là class Tailwind.
  - `src/index.css` chỉ còn: `@import`, `@theme`, override dark mode, `@font-face`, style nền (`body`, `:focus-visible`), `@keyframes`, `prefers-reduced-motion`.
  - Class CSS cũ (`.energy-card`, `.meal-row`…) được xóa khỏi `index.css` cùng commit với việc chuyển component tương ứng sang Tailwind. Không để một component dùng song song cả hai cách.
  - Giá trị lẻ dùng cú pháp arbitrary của Tailwind (`size-[168px]`). Thuộc tính SVG (`stroke-dasharray`, `r`, `viewBox`) viết bằng attribute, không viết bằng class.
- **Không chỉnh** thư mục `figma-plugin/` và `scripts/generate_svg.js` (công cụ vẽ file Figma của giao diện cũ). Chúng sẽ lệch so với giao diện mới; việc cập nhật là ngoài phạm vi kế hoạch này.
- **Hai chế độ build** (`VITE_APP_MODE`, mục 7.1): mọi thứ gắn nhãn "prototype", "minh họa", "giả lập" trong mục 1–6 chỉ tồn tại ở chế độ `prototype`. Chế độ `app` là bản chạy thực tế.
- **Quy tắc code (từ AGENTS.md):** default export cho component; chuỗi có dấu nháy đơn dùng nháy kép; JSX đóng thẻ đầy đủ.
- **Ràng buộc nghiên cứu (KHÔNG được phá vỡ, áp dụng cho chế độ `prototype`):** Bộ kiểm thử `TestingHub` định nghĩa 6 nhiệm vụ T1–T6. Sau mỗi Phase, cả 6 nhiệm vụ phải còn thực hiện được (T1–T6 cũng được viết thành test E2E, xem 7.10):
  - T1: ghi 150 g Cơm trắng vào **bữa trưa hôm nay** → kết quả 195 kcal.
  - T2: sửa Cơm trắng về 100 g → tổng giảm 65 kcal.
  - T3: +250 ml nước.
  - T4: đổi món bữa trưa **ngày mai** trong Thực đơn.
  - T5: đọc tổng kcal + nước hôm nay.
  - T6: đổi mục tiêu nước 2.000 → 2.200 ml, hiển thị trên Hôm nay.
  - Nút "Đặt lại dữ liệu mẫu" (Cá nhân) phải luôn khôi phục đúng trạng thái ban đầu.
- **Tông nội dung:** giữ toàn bộ disclaimer "dữ liệu minh họa / không phải tư vấn y khoa". Không thêm ngôn ngữ phán xét ("ăn quá nhiều", màu đỏ cảnh báo cho calo).

---

## 1. Kết quả Audit (tóm tắt có dẫn chứng)

### 1.1 Visual Hierarchy & Readability

| # | Vấn đề | Dẫn chứng | Mức độ |
|---|---|---|---|
| H1 | Cỡ chữ quá nhỏ cho người dùng đa độ tuổi | Trong `index.css`: 52 khai báo `font-size` ≤ 10px (8px ×4, 9px ×17, 10px ×31), 25 khai báo 11px. Nhãn bottom nav 9px, macro list 11px, kcal mỗi bữa 10px | Cao |
| H2 | Macro trên Hôm nay là **số cứng** | `App.tsx:189` — `51 g / 86 g / 24 g` không tính từ `meals`; thêm/xóa món không đổi macro | Cao |
| H3 | Macro không có mục tiêu & không có thanh tiến độ | Chỉ hiện chấm 7px + số gram; người dùng không biết còn thiếu bao nhiêu | Trung bình |
| H4 | Màu macro không nhất quán giữa màn | Hôm nay dùng chấm màu (`.protein/.carb/.fat`), Chi tiết món (`.macro-grid`) không có màu; Nhật ký không hiện macro | Trung bình |
| H5 | Vượt mục tiêu bị che giấu | `ProgressRing` clamp `Math.min(value/total,1)`; tiêu đề hiện "Còn 0 kcal" khi đã vượt → mất thông tin | Trung bình |
| H6 | Thông tin chính nhỏ hơn thông tin phụ | `.card-top strong` (con số "Còn X kcal") 13px trong khi nhãn ring 24px; nút "Xem chi tiết" 10px | Trung bình |
| H7 | Biểu đồ tuần không có trục/đường mục tiêu | `App.tsx:237` chiều cao bar = `v/22` px cứng, không có goal line, không hiện giá trị khi chọn cột | Trung bình |

### 1.2 User Flow & Friction

| # | Vấn đề | Dẫn chứng | Mức độ |
|---|---|---|---|
| F1 | Bữa ăn luôn bị gán "Trưa" | `addFood()` hard-code `meal: "Trưa"`; nút "Bữa ăn"/"Ngày" ở Chi tiết món (`App.tsx:215`) không có `onClick` | Cao |
| F2 | Bug sửa món: sai món & sai khẩu phần | `editMeal()` tìm theo tên → "Bánh mì trứng" không có trong `foods` → fallback **Cơm trắng**; `parseInt("1 hộp")` = 1 → khẩu phần 1 g | Cao |
| F3 | Không có đường tắt ghi món từ ngữ cảnh | Bấm hàng "Trưa" ở Hôm nay chỉ mở Nhật ký, không mở tìm món với bữa Trưa được chọn sẵn | Cao |
| F4 | Tối thiểu 4 lần chạm để ghi một món quen | Hôm nay → Thêm món → chọn món → Thêm. Không có "thêm nhanh" (+) trên kết quả tìm kiếm cho món Gần đây | Trung bình |
| F5 | Món trong thực đơn không thể ghi vào nhật ký | Planner chỉ hiển thị; không có nút "Đã ăn" → người dùng phải tìm lại món | Trung bình |
| F6 | Nước chỉ cộng, không hoàn tác | Chỉ có `+250 ml`; bấm nhầm không sửa được; toast không có Undo | Trung bình |
| F7 | Nhiều control "giả" | Filter chips (`App.tsx:205`), week strip, date picker, period control, nút lịch ở header Thực đơn: có style button nhưng không làm gì | Trung bình |
| F8 | Validate không nhất quán | Setup kiểm tra ≥ 500; Cá nhân (`App.tsx:245`) chỉ kiểm tra truthy, không báo lỗi; ô gram cho nhập 0 và thêm món 0 kcal | Trung bình |
| F9 | Điều hướng: "Cá nhân" chiếm 1 slot bottom nav, trong khi "Thêm món" (hành động tần suất cao nhất) không có trong nav | `navItems` | Trung bình |

### 1.3 UI Consistency & Accessibility

| # | Vấn đề | Dẫn chứng (tỉ lệ tương phản đã đo) | Mức độ |
|---|---|---|---|
| A1 | Text muted không đạt WCAG AA trên nền kem | `--muted #6f7a75` / `--cream #f8f7f2` = **4.15:1** (< 4.5), lại dùng ở 9–10px | Cao |
| A2 | Nhãn nav inactive | `#89918d` / trắng = **3.23:1** | Cao |
| A3 | Badge cam | `--orange #ed9c52` / `#fff1e4` = **2.00:1** (`.section-title span`) | Cao |
| A4 | Text bảng TestingHub | `td #8c9490` / trắng = **3.11:1**, 9px | Trung bình |
| A5 | Thiếu ARIA | `BottomNav` không có `aria-current`; `.choice`/swap list không có `role="radio"`/`aria-checked`; modal xóa không có `role="dialog"`, `aria-modal`, focus trap, Esc; `ProgressRing`/`water-track` không có `role="progressbar"`; nút `+` ở header Nhật ký, nút mũi tên date-picker không có `aria-label` | Cao |
| A6 | Touch target < 44px | `.small-add` 36px, `.water-card button` 36px, `.filter-chips button` 34px | Trung bình |
| A7 | Không có token: 30+ mã màu hex rải rác (`#e8f3f4`, `#c8e4e6`, `#287b82`, `#dceacb`…), radius 9 giá trị khác nhau (10/11/12/13/14/15/16/17/18/20/22px), spacing lẻ (7/9/11/13/17px) | `index.css` | Trung bình |
| A8 | Responsive: app chỉ là khung điện thoại 390×844 cố định; ≤ 800px thì full-screen; không có layout tablet/desktop thực | `.prototype-stage`, `.phone-shell` | Thấp (prototype) |
| A9 | `prefers-reduced-motion` không được tôn trọng; không có dark mode | — | Thấp |

### 1.4 Edge Cases & States

| State | Hiện trạng | Thiếu |
|---|---|---|
| Empty | Có: kết quả tìm kiếm rỗng, bữa chưa ghi (`.empty-meal`) | Ngày chưa ghi gì (Hôm nay vẫn hiện ring 0 không có CTA); Tiến độ khi 0 ngày có dữ liệu; nước = 0 |
| Loading | **Không có** | Skeleton cho kết quả tìm kiếm, card tổng quan, biểu đồ |
| Error | Chỉ ở Setup (text đỏ 12px, không gắn `aria-describedby`) | Gram không hợp lệ, mục tiêu ở Cá nhân, lưu thất bại (mô phỏng), tìm kiếm lỗi mạng |
| Success | Toast (2.6s) | Toast chồng nhau (không clear timeout cũ), không có Undo, không có `role="status"` |
| Over-goal | Bị ẩn (H5) | Trạng thái trung tính "Vượt X kcal" |

---

## 2. Design System & Tokens

### 2.1 Cách triển khai token

Khai báo trong `src/index.css` bằng Tailwind v4 `@theme` (tự sinh CSS variable + utility class). Sau `@import "tailwindcss";`:

```css
@theme {
  /* Brand */
  --color-brand-950: #12372b;
  --color-brand-900: #174737;   /* primary surface, white text = 10.54:1 */
  --color-brand-800: #1d5c45;
  --color-brand-700: #28775a;   /* primary action/text; on white = 5.42:1 */
  --color-brand-100: #dff0e7;
  --color-brand-50:  #eff8f3;

  /* Accent (energy / kcal) */
  --color-accent-500: #ed9c52;  /* chỉ dùng cho graphic trên nền brand-900 (4.76:1) */
  --color-accent-700: #b4621f;  /* text cam trên nền sáng (4.46:1 — chỉ dùng ≥ 14px bold) */
  --color-accent-100: #fdeedd;

  /* Neutrals */
  --color-surface:    #ffffff;
  --color-canvas:     #f8f7f2;
  --color-ink:        #17201c;
  --color-ink-muted:  #5b6661;  /* thay #6f7a75; 5.57:1 trên canvas, 5.97:1 trên trắng */
  --color-line:       #e5e9e6;
  --color-line-strong:#cbd4cf;

  /* Macro semantic — fill (graphic ≥ 3:1) / text (≥ 4.5:1) / tint (nền) */
  --color-protein:      #d9480f;  /* 4.30:1 trên trắng */
  --color-protein-text: #b03a0a;
  --color-protein-tint: #fde8dd;
  --color-carbs:        #1c7ed6;  /* 4.20:1 */
  --color-carbs-text:   #1864ab;
  --color-carbs-tint:   #e1effb;
  --color-fat:          #b7791f;  /* 3.64:1 — chỉ dùng làm fill/graphic */
  --color-fat-text:     #8a5a12;
  --color-fat-tint:     #fbf0dc;

  /* Water */
  --color-water:      #0e7490;  /* 5.36:1 */
  --color-water-tint: #e3f2f5;

  /* Status */
  --color-success: #1f7a56;
  --color-warning: #a16207;     /* 4.92:1 */
  --color-danger:  #b91c1c;     /* 6.47:1 */
  --color-danger-tint: #fbe4e4;

  /* Typography */
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-display: "Manrope", "DM Sans", sans-serif;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgb(18 55 43 / .06);
  --shadow-md: 0 4px 16px rgb(18 55 43 / .08);
  --shadow-lg: 0 16px 48px rgb(18 55 43 / .14);
}
```

- Giữ alias cũ (`--green-900`, `--muted`, …) trỏ sang token mới trong `:root` cho đến khi Phase 1 hoàn tất, rồi xóa.
- **Kiểm tra tương phản:** mọi cặp text/nền mới phải ≥ 4.5:1 (text < 18px) hoặc ≥ 3:1 (text ≥ 18px bold / graphic). `--color-fat` và `--color-accent-500` **không** được dùng cho text trên nền sáng.

### 2.2 Typography scale (mobile-first, sàn tối thiểu 12px)

| Token (class) | Size / line-height | Weight | Font | Dùng cho |
|---|---|---|---|---|
| `text-display` | 32px / 1.15 | 800 | display | Welcome h1 |
| `text-h1` | 24px / 1.2 | 700 | display | Tiêu đề màn |
| `text-h2` | 18px / 1.3 | 700 | display | Tiêu đề section |
| `text-metric-xl` | 32px / 1 | 800 | display, `tabular-nums` | Số kcal trong ring |
| `text-metric` | 20px / 1.1 | 700 | display, `tabular-nums` | Số liệu card (nước, macro) |
| `text-body` | 15px / 1.5 | 400/600 | sans | Nội dung, tên món |
| `text-label` | 13px / 1.4 | 600 | sans | Nhãn field, nhãn nav, chip |
| `text-caption` | 12px / 1.4 | 500 | sans | Meta (khẩu phần, ghi chú) — **cỡ nhỏ nhất cho phép** |
| `text-overline` | 12px / 1.3, `letter-spacing: .08em`, uppercase | 700 | sans | Eyebrow (ngày, "BƯỚC 1/1") |

Khai báo trong `@theme` bằng **rem** (giá trị px trong bảng chia 16, ví dụ `--text-h1: 1.5rem; --text-h1--line-height: 1.2;`) để cài đặt cỡ chữ ở 6.3.12 phóng được toàn app. Toàn bộ số liệu dùng `font-variant-numeric: tabular-nums`. **Cấm** `font-size` < 12px trong toàn bộ app (TestingHub cũng áp dụng).

### 2.3 Spacing scale (base 4px)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48` (Tailwind mặc định `--spacing: 4px` → `p-1…p-12`).
- Padding ngang màn hình: **16px** (`px-4`); gap giữa section: **24px**; padding trong card: **16px**; gap trong list: **8px**; khoảng cách label ↔ input: **8px**.
- Thay toàn bộ giá trị lẻ (7, 9, 11, 13, 17, 18, 21px) bằng bậc gần nhất của scale.

### 2.4 Component primitives

| Primitive | Spec |
|---|---|
| Button | Height 48px (`md`), 40px (`sm`, chỉ desktop); radius `--radius-md`; variants: `primary` (brand-900/trắng), `secondary` (trắng, viền line, text brand-900), `ghost`, `danger`, `tonal` (brand-100/brand-900). Hover: `brightness-95`/`bg-brand-800`; active: `scale-[.98]`; focus-visible: `outline 3px brand-700/40, offset 2px`; disabled: `opacity-50 cursor-not-allowed`; `loading`: spinner 16px thay icon + `aria-busy` |
| Card | `bg-surface rounded-lg border border-line p-4 shadow-sm` |
| Hero card | `bg-brand-900 text-white rounded-xl p-5 shadow-lg` |
| Chip | min-height 36px (vùng chạm 44px qua padding ngoài), `rounded-full px-3 text-label`; selected: `bg-brand-900 text-white`, `aria-pressed` |
| Input field | height 48px, `rounded-md border-line`, focus `border-brand-700 ring-2 ring-brand-700/20`, error `border-danger` + message `text-caption text-danger` gắn `aria-describedby`, `aria-invalid` |
| Touch target | Mọi phần tử tương tác ≥ 44×44px |
| Icon | 20px mặc định, 24px trong nav; stroke 1.8 (active 2.2) |

### 2.5 Motion

- Duration: `120ms` (press), `200ms` (fade/slide), `400ms` (ring/bar fill), easing `cubic-bezier(.2,.8,.2,1)`.
- `@media (prefers-reduced-motion: reduce)` → tắt mọi transition/animation trừ opacity.

### 2.6 Dark mode (Phase 4, tùy chọn)

Override token dưới `:root[data-theme="dark"]` và `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`: `canvas #121a17`, `surface #1a2420`, `ink #e2e8e4` (14.25:1), `ink-muted #9aa5a0` (6.97:1), `line #2a3530`, `brand-700 → #3fb37f` (6.72:1). Macro fill giữ nguyên (đều ≥ 3.9:1 trên `#121a17`).

---

## 3. Layout & Navigation

### 3.1 Mobile (< 768px) — Bottom Nav 4 tab + FAB trung tâm

```
┌───────────────────────────────────────────┐
│ Hôm nay │ Nhật ký │  (＋)  │ Thực đơn │ Tiến độ │
└───────────────────────────────────────────┘
```
- `BottomNav`: `grid grid-cols-5`, height 64px + `env(safe-area-inset-bottom)`; nhãn `text-label` (13px) — rút gọn nhãn nếu tràn.
- Slot giữa là **FAB "Ghi nhận"**: nút tròn 56px, `bg-brand-900 text-white shadow-lg`, nhô lên `-translate-y-4`, `aria-label="Ghi nhận nhanh"`, `aria-haspopup="dialog"`.
- Bấm FAB → mở `QuickLogSheet` (bottom sheet) với 3 hành động lớn (mỗi hàng 64px): **Thêm món ăn** · **Thêm nước (+250 ml)** · **Ghi món từ thực đơn hôm nay**. Hàng 4: danh sách 3 món "Gần đây" với nút `+` ghi ngay 1 chạm.
- "Cá nhân" rời khỏi nav → truy cập bằng avatar ở header (đã có ở Hôm nay, thêm vào header của cả 4 tab).
- Tab active: icon stroke 2.2, màu `brand-800`, chỉ báo pill `bg-brand-100` 56×32px sau icon; `aria-current="page"`.

### 3.2 Tablet / Desktop (≥ 1024px) — Sidebar

Áp dụng khi app chạy **ngoài** khung điện thoại: luôn áp dụng ở chế độ build `app` (mục 7.1), và ở chế độ `prototype` khi bật toggle "Xem dạng ứng dụng đầy đủ" (3.3, item 1.9):
- Layout `grid grid-cols-[240px_1fr]`; sidebar `sticky top-0 h-screen bg-surface border-r border-line p-4`.
- Đầu sidebar: Logo; ngay dưới là nút primary full-width **"+ Ghi bữa ăn"** (cùng hành động FAB).
- Mục nav: 4 tab + Cá nhân, mỗi mục height 44px, `rounded-md`, active `bg-brand-50 text-brand-900 font-semibold`.
- Nội dung `max-w-[1080px] mx-auto px-8 py-6`. Hôm nay dùng `grid grid-cols-12 gap-6`: hero card `col-span-7`, nước + macro `col-span-5`, danh sách bữa `col-span-12`.
- 768–1023px: bottom nav giữ nguyên, nội dung `max-w-[640px] mx-auto`.

### 3.3 Prototype stage

Giữ `.prototype-stage` (khung điện thoại 390×844 + panel trái) làm chế độ mặc định cho kiểm thử. Panel trái thêm toggle "Xem dạng ứng dụng đầy đủ" để mở layout responsive 3.2.

---

## 4. Component-level Specs

> Định dạng: **Vấn đề → Giải pháp → DOM/Styles → States**.

### 4.0 Kiến trúc file (điều kiện tiên quyết)

Tách `src/App.tsx` thành:
```
src/
  data/foods.ts            // foods, initialMeals, planned meals (có id, macro)
  state/useNutritionStore.ts // useReducer: meals, water logs, goals, plan; selectors
  components/ui/            // Button, Card, Chip, Field, Sheet, Modal, Toast, Skeleton, Icon
  components/nutrition/     // CalorieRing, MacroBar, WaterCard, MealSection, FoodRow
  screens/                  // Welcome, Setup, Today, Diary, FoodSearch, FoodDetail, Planner, Swap, Progress, Profile
  testing/TestingHub.tsx
  App.tsx                   // chỉ router state + layout
```
Data model mới:
```ts
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type Food = { id: string; name: string; servingLabel: string; servingGrams: number; kcal: number; protein: number; carbs: number; fat: number; tag: "recent" | "popular" }; // giá trị per 100 g
type LogEntry = { id: string; foodId: string; meal: MealType; date: string; grams: number }; // kcal/macro là selector, không lưu cứng
type WaterLog = { id: string; date: string; ml: number };
type Goals = { kcal: number; waterMl: number; proteinG: number; carbsG: number; fatG: number };
```
- Đây là bản tối thiểu. Bản đầy đủ nằm ở **6.4**; nên khai báo type theo 6.4 ngay từ item 1.6, field chưa dùng thì để giá trị mặc định.
- Các màn hình **không** gọi store trực tiếp mà đi qua hook dữ liệu (`useDayLog(date)`, `useAddEntry()`, `useWeightLogs(range)`…) trong `src/data-access/`. Ở cả hai chế độ, hook đọc store cục bộ. Khác biệt duy nhất là ở chế độ `app` store được lưu bền vững (7.4). Nhờ vậy Phase 7 không phải sửa lại UI.
- Macro goal mặc định suy ra từ kcal: protein 20%, carbs 50%, fat 30% (`/4`, `/4`, `/9`) — gắn nhãn "minh họa".
- `initialMeals` phải tham chiếu `foodId` có thật; thêm "Bánh mì trứng" (1 phần = 150 g, 343 kcal) vào `foods` để sửa bug F2. Sample data phải cho ra đúng tổng kcal hiện tại (643 kcal) để không lệch các tài liệu đã chuẩn bị.
- Ngày "hôm nay" của prototype là hằng `TODAY = "2025-06-19"` (Thứ Năm) trong `data/` — mọi chuỗi ngày được format từ hằng này bằng `Intl.DateTimeFormat("vi-VN")`.

### 4.1 CalorieRing (Hôm nay)

- **Vấn đề:** ring 126px dùng `conic-gradient`, không có trạng thái vượt mục tiêu, số còn lại 13px nhỏ hơn số đã ăn, không có ARIA (H5, H6, A5).
- **Giải pháp:** SVG ring 168px, stroke 12px, ở giữa hiển thị **số kcal CÒN LẠI** (thông tin hành động), dưới là "đã ăn / mục tiêu".
- **DOM:**
  ```html
  <figure role="img" aria-label="Đã ăn 643 trên 2.000 kcal, còn 1.357 kcal">
    <svg viewBox="0 0 168 168" class="size-[168px] -rotate-90">
      <circle r="78" cx="84" cy="84" stroke-width="12" class="stroke-white/15 fill-none"/>
      <circle r="78" ... stroke-linecap="round" class="stroke-accent-500 transition-[stroke-dashoffset] duration-400"
              stroke-dasharray="490.1" stroke-dashoffset="{490.1*(1-pct)}"/>
    </svg>
    <figcaption class="absolute inset-0 grid place-content-center text-center">
      <span class="text-metric-xl tabular-nums">1.357</span>
      <span class="text-caption text-white/75">kcal còn lại</span>
    </figcaption>
  </figure>
  ```
  Card hero: `grid grid-cols-[168px_1fr] gap-5 items-center`; bên phải là 3 `MacroBar` (4.2). Hàng dưới card: `grid grid-cols-3` "Mục tiêu 2.000 · Đã ăn 643 · Còn 1.357" (`text-label`, số `text-metric` 20px).
- **States:**
  - Empty (0 kcal): ring track rỗng, giữa hiển thị "2.000 kcal còn lại", dưới card một dòng "Chưa có món nào hôm nay" + nút tonal "Ghi bữa sáng".
  - Over-goal: ring đầy, thêm cung thứ 2 màu `accent-700` cho phần vượt (tối đa 1 vòng), giữa hiển thị "+120" + "kcal vượt mục tiêu" — **không** dùng màu đỏ.
  - Loading: `Skeleton` tròn 168px + 3 thanh 12px.
  - Hover (desktop): tooltip "Xem nhật ký"; cả card là link tới Nhật ký (`cursor-pointer`, `hover:shadow-md`).

### 4.2 MacroBar

- **Vấn đề:** chấm 7px + số cứng, không mục tiêu (H2, H3, H4).
- **Giải pháp:** 3 thanh ngang, mỗi thanh: nhãn + "51 / 100 g" + progress 8px màu macro.
- **DOM:** `<div role="progressbar" aria-valuenow={51} aria-valuemax={100} aria-label="Chất đạm">` → `flex justify-between text-label` + `div.h-2 rounded-full bg-white/15 > div.h-full rounded-full bg-protein` (`width: pct%`, `transition-[width] duration-400`). Trên nền sáng dùng track `bg-protein-tint`.
- Thứ tự & màu cố định toàn app: **Đạm (protein) → Tinh bột (carbs) → Chất béo (fat)**. Dùng lại ở Chi tiết món, Nhật ký (tổng ngày), Tiến độ.
- **States:** vượt 100% → thanh đầy + text "+12 g"; 0 → track rỗng, text "0 / 100 g".

### 4.3 WaterCard

- **Vấn đề:** chỉ +250, không hoàn tác, track 4px, text 10px, nút 36px (F6, A6).
- **Giải pháp:** card `bg-water-tint rounded-lg p-4`, header "Nước" + số `text-metric` "1.250 / 2.000 ml"; hàng 8 ô cốc (mỗi ô = 250 ml, 32×40px, filled `bg-water`, empty `border-2 border-water/40`); nút: `−` (44px, secondary) và `+250 ml` (44px, `bg-water text-white`).
- Thêm nước → toast có nút **"Hoàn tác"** (5s). Long-press/nhấn giữ `+` → sheet chọn 150/250/330/500 ml.
- **States:** đạt mục tiêu → icon check + "Đã đạt mục tiêu nước" (`text-success`); 0 ml → ô cốc rỗng + caption "Bắt đầu với một cốc nước"; `−` disabled khi 0.

### 4.4 MealSection (Hôm nay & Nhật ký)

- **Vấn đề:** hàng bữa ở Hôm nay chỉ mở Nhật ký, ký hiệu "S/Tr/T/P" khó hiểu, text 10–12px (F3, H1).
- **Giải pháp:** mỗi bữa là card riêng:
  ```
  [icon bữa 40px] Bữa trưa              200 kcal   [ + ]
                  Ức gà áp chảo, Rau luộc
  ```
  - Icon theo bữa (sáng: mặt trời, trưa: đĩa, tối: trăng, phụ: táo) thay chữ viết tắt.
  - Nút `+` 44px (`aria-label="Thêm món vào bữa trưa"`) → mở FoodSearch với `meal="lunch"` chọn sẵn.
  - Bấm phần còn lại → Nhật ký, cuộn tới section tương ứng (`scrollIntoView({block:"start"})` trên `#meal-lunch`).
- **DOM:** `<section aria-labelledby="meal-lunch-title" class="rounded-lg bg-surface border border-line p-4 grid grid-cols-[40px_1fr_auto_44px] gap-3 items-center">`.
- **States:** empty → dòng phụ "Chưa ghi món" (`text-ink-muted`) và nút `+` chuyển variant `tonal`; hover → `bg-brand-50`; active → `scale-[.99]`.

### 4.5 Diary screen

- **Vấn đề:** date picker giả (F7), summary chỉ có kcal, không có macro, `editMeal` lỗi (F2).
- **Giải pháp:**
  - `DateNavigator`: mũi tên trái/phải đổi `selectedDate` ±1 ngày (dữ liệu ngày khác = rỗng → empty state); nút ngày ở giữa trở về "Hôm nay". Mũi tên phải disabled khi là hôm nay. `aria-label="Ngày trước"/"Ngày sau"`.
  - Summary card: `grid grid-cols-3` (Mục tiêu / Đã ăn / Còn lại) + 3 `MacroBar` dạng compact (h-1.5).
  - FoodRow: `grid grid-cols-[40px_1fr_auto]`, tên `text-body` 15px, meta "150 g · Đ 4 g · TB 42 g · B 0.5 g" `text-caption`, kcal `text-label font-semibold tabular-nums`.
  - Swipe-left (touch) hoặc nút kebab (desktop) → "Sửa" / "Xóa". Xóa dùng toast Undo thay cho modal xác nhận (modal chỉ giữ ở màn Sửa món).
- **States:**
  - Ngày trống: illustration icon 64px + "Chưa có bữa ăn nào ngày này" + nút primary "Ghi bữa ăn" + nút secondary "Sao chép từ hôm qua" (copy entries của `date-1`).
  - Loading (đổi ngày): skeleton 4 section × 2 dòng, 300ms mô phỏng.

### 4.6 FoodSearch screen

- **Vấn đề:** filter chips giả, không thêm nhanh, chưa biết đang ghi vào bữa nào (F1, F4, F7).
- **Giải pháp:**
  - Header: "Thêm vào **Bữa trưa** ▾" — chạm mở sheet chọn bữa (segmented 4 nút). Bữa mặc định: tham số từ điểm vào (MealSection `+`), nếu không có → theo giờ của hằng `NOW` (05–10 sáng, 10–14 trưa, 14–17 phụ, 17–22 tối). **Lưu ý test:** stage clock hiển thị 9:41 → mặc định "Bữa sáng"; T1 yêu cầu người dùng tự đổi sang Trưa hoặc vào từ hàng Trưa — giữ nguyên để đo được khả năng nhận biết bữa.
  - Search input 48px, `type="search"`, `enterKeyHint="search"`, debounce 250ms, so khớp không dấu (giữ logic `normalize("NFD")` hiện tại).
  - Chips hoạt động thật: Tất cả / Gần đây / Phổ biến (`aria-pressed`), lọc theo `tag`.
  - Mỗi kết quả: `grid grid-cols-[44px_1fr_44px]`; tên + "100 g · 130 kcal"; nút `+` tròn 44px bên phải → **thêm ngay khẩu phần chuẩn** vào bữa đang chọn + toast "Đã thêm Cơm trắng (100 g) vào bữa trưa · Hoàn tác". Bấm thân hàng → FoodDetail để chỉnh gram.
  - Highlight phần khớp từ khóa bằng `<mark class="bg-accent-100 text-ink">`.
- **States:** Loading (sau debounce): 4 skeleton row 64px; Empty: giữ empty state hiện có, thêm gợi ý chip "Thử: cơm, phở, trứng"; Error (mô phỏng qua flag `simulateError` trong dev): icon cảnh báo + "Không tải được danh sách món" + nút "Thử lại"; nút `+` sau khi bấm chuyển icon check 1.2s (`aria-live`).

### 4.7 FoodDetail / Edit

- **Vấn đề:** chọn bữa/ngày giả, gram nhập 0, macro không màu (F1, F8, H4).
- **Giải pháp:**
  - Khối hero rút còn 96px (icon 48px) để CTA nằm trong viewport đầu tiên trên 390×844.
  - Kcal lớn `text-metric-xl` cạnh tên món; 3 macro dạng chip màu (`bg-protein-tint text-protein-text` …) `grid grid-cols-3 gap-2`, mỗi chip: nhãn `text-caption` + giá trị `text-metric`.
  - Portion: stepper 56px (bước 10 g; giữ nhấn tăng tốc 50 g) + quick chips `[½ khẩu phần] [1 khẩu phần] [100 g] [150 g] [200 g]`; input `inputMode="decimal"`, min 1, max 2000.
  - "Ghi vào": segmented control 4 bữa (`role="radiogroup"`) + dòng ngày (read-only "Hôm nay, 19/06" trong prototype).
  - CTA sticky dưới: `sticky bottom-0 bg-canvas/95 backdrop-blur pt-3 pb-[max(16px,env(safe-area-inset-bottom))]` — "Thêm vào bữa trưa · 195 kcal"; nhãn đổi theo bữa đã chọn.
  - Chế độ sửa: nút xóa ở header (giữ modal xác nhận hiện có, bổ sung `role="dialog" aria-modal="true" aria-labelledby`, focus vào nút "Giữ lại", Esc đóng, trap Tab).
- **States:** gram ≤ 0 hoặc rỗng → field `aria-invalid`, viền danger, message "Nhập khẩu phần từ 1 đến 2.000 g", CTA disabled; saving → CTA `loading` 400ms mô phỏng; success → điều hướng về Nhật ký và cuộn tới bữa vừa thêm, highlight hàng mới `bg-brand-50` fade 1.5s.

### 4.8 Planner & Swap

- **Vấn đề:** week strip giả, active (T6) và chấm "hôm nay" (T5) dễ nhầm; không ghi được món đã lên kế hoạch (F5, F7).
- **Giải pháp:**
  - Week strip: 7 nút 44×56px, `role="tablist"`; hôm nay: viền `ring-2 ring-brand-700` + chữ "Hôm nay" thay chấm; ngày chọn: `bg-brand-900 text-white`. Bấm đổi ngày thật; ngày không có kế hoạch → empty state "Chưa có thực đơn" + nút "Tạo từ gợi ý".
  - Plan card: badge trạng thái 2 loại — "Đã lên kế hoạch" (`bg-brand-50 text-brand-700`, icon lịch) và "Đã ghi" (`bg-success/10 text-success`, icon check). Chỉ ngày hôm nay hiển thị nút **"Đã ăn → Ghi vào nhật ký"** (secondary, 44px) → tạo `LogEntry` từ món kế hoạch, badge đổi thành "Đã ghi".
  - Tổng dự kiến hiển thị dạng thanh so với mục tiêu ("1.820 / 2.000 kcal").
  - Nút "Đổi món" giữ cho mọi bữa (không chỉ bữa trưa). Swap list: `role="radiogroup"`, mỗi option hiển thị chênh lệch kcal so với món hiện tại ("−40 kcal") `text-caption`.
- **States:** CTA "Xác nhận đổi món" disabled khi chưa đổi lựa chọn khác món hiện tại; toast có Undo.

### 4.9 Progress

- **Vấn đề:** bar chart cứng, không đường mục tiêu, cột không có tương tác thật (H7, F7).
- **Giải pháp:** SVG chart `viewBox="0 0 320 180"`:
  - 7 cột rộng 24px, radius trên 6px, `fill-brand-700`; ngày không có dữ liệu: cột 4px `fill-line-strong` + nhãn "—".
  - Đường mục tiêu nét đứt: `<line class="stroke-accent-700" stroke-dasharray="4 4" />` + nhãn "Mục tiêu 2.000".
  - Trục Y 3 mốc (0 / 1.000 / 2.000), `text-caption`.
  - Chọn cột (click/phím ←→, `role="listbox"`) → tooltip trên cột "Thứ Năm · 1.643 kcal" và bảng "Chi tiết" bên dưới cập nhật theo ngày chọn.
  - Thêm card "Macro trung bình tuần" dùng 3 `MacroBar`.
  - Period control đổi tuần thật (tuần trước có dữ liệu mẫu riêng hoặc empty).
- **States:** Empty (0 ngày có dữ liệu): placeholder chart xám + "Ghi bữa ăn ít nhất 1 ngày để xem xu hướng"; Loading: skeleton chart 180px.

### 4.10 Profile & Setup

- **Vấn đề:** validate khác nhau, không báo lỗi ở Cá nhân, field tái sử dụng state draft giữa 2 màn (F8).
- **Giải pháp:** component `GoalForm` dùng chung cho Setup và Profile: field kcal (1.000–5.000), nước (500–5.000 ml, bước 100), hiển thị lỗi inline per-field; nút Lưu disabled khi không đổi hoặc lỗi. Profile thêm sub-section "Mục tiêu macro (minh họa)" read-only hiển thị gram suy ra. Setup: choice list `role="radiogroup"`.
- **States:** saving → `loading`; success → toast; error → message dưới field + focus vào field lỗi đầu tiên.

### 4.11 Toast / Snackbar

- **Vấn đề:** chồng timeout, không Undo, không ARIA.
- **Giải pháp:** `ToastProvider` (context) quản lý 1 toast tại một thời điểm, `clearTimeout` khi có toast mới; vị trí `bottom: 64px + 16px + safe-area`; `role="status" aria-live="polite"`; props `{ text, actionLabel?, onAction?, duration = 4000 }` (5000 nếu có action). Undo phục hồi snapshot trước hành động.

### 4.12 Skeleton

`<div class="animate-pulse rounded-md bg-line" aria-hidden="true">`; container bọc `aria-busy="true"`. Biến thể: `SkeletonText` (h-3), `SkeletonRow` (h-16), `SkeletonCircle`. Độ trễ mô phỏng tập trung ở hằng `SIMULATED_LATENCY_MS = 300`, có thể đặt 0 khi kiểm thử để không ảnh hưởng thời gian đo nhiệm vụ.

### 4.13 TestingHub

Chỉ áp token (màu, typography sàn 12px, `td` dùng `text-ink-muted`). Không đổi nội dung nhiệm vụ. Cập nhật mô tả T1 nếu luồng đổi ("Thêm vào bữa trưa" vẫn phải là thao tác khả dụng).

---

## 5. Phased Actionable Checklist

### Phase 1 — Core Design System & Layout

- [ ] **1.1 Token:** thêm khối `@theme` (mục 2.1–2.3) vào `src/index.css` sau `@import "tailwindcss";`. Map alias cũ (`--green-900` → `var(--color-brand-900)`, `--muted` → `var(--color-ink-muted)`, …) trong `:root`. *Done khi:* app render không đổi bố cục, `--muted` mới đạt ≥ 4.5:1.
- [ ] **1.2 Thay hex lẻ:** thay mọi mã màu hex trong `index.css` ngoài khối `@theme` bằng token. *Done khi:* `grep -E "#[0-9a-fA-F]{3,6}" src/index.css` chỉ còn kết quả trong `@theme`/dark override.
- [ ] **1.3 Typography sàn 12px:** định nghĩa scale 2.2; nâng mọi `font-size` 8–11px lên ≥ 12px theo bảng ánh xạ: 8–10px → `caption` (12px), 11px → `label` (13px), 12px body-meta → `body` (15px) cho tên món/tên bữa. *Done khi:* `grep -E "font-size: ?([0-9]|1[01])px"` trả về rỗng; kiểm tra 390×844 không có text tràn/ellipsis mới ngoài danh sách món.
- [ ] **1.4 Spacing & radius:** thay padding/gap lẻ bằng scale 4px; radius chỉ dùng 5 token. Padding màn hình 16px (`.pad`).
- [ ] **1.5 Tách file:** tạo cấu trúc ở 4.0; chuyển `Icon`, `Button`, `Header`, `BottomNav`, `Toast`, `TestingHub` sang file riêng (default export). `App.tsx` ≤ 120 dòng. Không đổi hành vi.
- [ ] **1.6 Store:** tạo `useNutritionStore` (useReducer) với data model 4.0, selectors `selectDayTotals(date)` trả về `{kcal, protein, carbs, fat}`, `selectMealTotals(date, meal)`, `selectWater(date)`. Thêm "Bánh mì trứng" vào `foods`; `initialMeals` dùng `foodId` + `grams`. *Done khi:* tổng kcal mẫu = 643, macro Hôm nay tính từ selector (xóa số cứng 51/86/24), Reset dữ liệu mẫu khôi phục chính xác.
- [ ] **1.7 Sửa bug edit (F2):** `editMeal` đọc `foodId` + `grams` từ entry. *Done khi:* sửa "Bánh mì trứng" mở đúng món, đúng 150 g; sửa "Sữa chua" mở đúng 100 g.
- [ ] **1.8 Bottom nav mới:** 4 tab + FAB (3.1); avatar header ở 4 tab dẫn tới Profile; `aria-current="page"`; nhãn 13px; mọi nút ≥ 44px. Tạo `Sheet` primitive (`role="dialog"`, `aria-modal`, Esc, click backdrop đóng, focus trap, trả focus về FAB) và `QuickLogSheet`.
- [ ] **1.9 Layout desktop:** component `AppLayout` chọn `BottomNav` (< 1024px) hoặc `Sidebar` (≥ 1024px) khi `mode === "app"`; stage mode giữ khung điện thoại. Thêm toggle ở `.stage-note`. *Done khi:* 1280px hiển thị sidebar + grid 12 cột; 375px không có scroll ngang.
- [ ] **1.10 Primitives a11y:** `Button` (variants + `loading`), `Field` (label/`aria-describedby`/`aria-invalid`), `Chip` (`aria-pressed`), `Modal` (focus trap, Esc). Thêm `aria-label` cho mọi icon-only button. Global `:focus-visible` dùng token.
- [ ] **1.11 Regression T1–T6:** chạy tay 6 nhiệm vụ trên 390×844, ghi kết quả vào PR description.

### Phase 2 — Dashboard & Data Visualization

- [ ] **2.1 CalorieRing SVG** theo 4.1 (168px, stroke 12, số còn lại ở giữa, `role="img"` + `aria-label` đầy đủ, over-goal arc, transition 400ms).
- [ ] **2.2 MacroBar** theo 4.2; dùng ở hero card Hôm nay với goal suy ra từ `Goals`.
- [ ] **2.3 Hàng tóm tắt** `grid grid-cols-3` Mục tiêu / Đã ăn / Còn lại dưới ring.
- [ ] **2.4 WaterCard** theo 4.3 (ô cốc, `−`/`+250`, `role="progressbar"`, trạng thái đạt mục tiêu). Store lưu `WaterLog[]` để hoàn tác.
- [ ] **2.5 MealSection** theo 4.4 (icon bữa, nút `+` ngữ cảnh, cuộn tới section ở Nhật ký).
- [ ] **2.6 Progress chart SVG** theo 4.9 (goal line, trục Y, chọn cột bằng chuột/phím, tooltip, chi tiết ngày theo cột chọn, card macro tuần).
- [ ] **2.7 Empty states dashboard:** Hôm nay khi 0 món, Progress khi 0 ngày, nước = 0 (nội dung theo 4.1/4.3/4.9).
- [ ] **2.8 Skeleton** primitive (4.12) + áp cho hero card và chart khi `SIMULATED_LATENCY_MS > 0`.

### Phase 3 — Food Logging & Forms

- [ ] **3.1 Meal context:** FoodSearch nhận `meal` param; header "Thêm vào {bữa} ▾" + sheet chọn bữa; mặc định theo 4.6. `addFood` dùng bữa được chọn (xóa hard-code `"Trưa"`). Toast/CTA đổi nhãn theo bữa.
- [ ] **3.2 Quick add:** nút `+` 44px trên mỗi kết quả tìm kiếm → thêm khẩu phần chuẩn ngay, toast Undo, icon check 1.2s.
- [ ] **3.3 Filter chips thật** (Tất cả/Gần đây/Phổ biến) + highlight từ khóa + debounce 250ms + skeleton/empty/error (4.6).
- [ ] **3.4 FoodDetail** theo 4.7: macro chips màu, stepper bước 10 g, quick chips khẩu phần, segmented chọn bữa, CTA sticky, validate 1–2.000 g, CTA disabled khi lỗi.
- [ ] **3.5 Diary:** DateNavigator hoạt động (4.5), summary 3 cột + macro compact, FoodRow có meta macro, xóa nhanh với Undo, empty-day state + "Sao chép từ hôm qua".
- [ ] **3.6 Planner:** week strip chọn ngày thật, phân biệt "Hôm nay" vs "Đang chọn", badge "Đã lên kế hoạch"/"Đã ghi", nút "Đã ăn → Ghi vào nhật ký" cho ngày hôm nay, "Đổi món" cho mọi bữa (4.8). T4 vẫn đổi bữa trưa ngày mai được.
- [ ] **3.7 Swap:** `role="radiogroup"`, chênh lệch kcal, CTA disabled khi chưa đổi, toast Undo.
- [ ] **3.8 GoalForm** dùng chung Setup/Profile (4.10) với validate per-field; Profile hiển thị macro goal minh họa. T6 (2.200 ml) hiển thị ngay trên Hôm nay.
- [ ] **3.9 ToastProvider** (4.11): 1 toast, clear timeout, `role="status"`, action Undo.
- [ ] **3.10 Regression T1–T6** + cập nhật mô tả nhiệm vụ trong `TestingHub` nếu nhãn nút thay đổi.

### Phase 4 — Micro-interactions & Polish

- [ ] **4.1 Motion tokens** (2.5): press `scale-[.98]` 120ms cho Button/Row; ring & bar fill 400ms khi giá trị đổi; sheet trượt lên 200ms; toast slide+fade.
- [ ] **4.2 Reduced motion:** `@media (prefers-reduced-motion: reduce)` tắt transform/transition, giữ opacity.
- [ ] **4.3 Feedback ghi món:** sau khi thêm, số trong ring đếm lên (count-up 400ms, `requestAnimationFrame`), hàng mới highlight 1.5s.
- [ ] **4.4 Haptic (mobile web):** `navigator.vibrate?.(10)` khi thêm món/nước thành công (bọc feature-detect).
- [ ] **4.5 Dark mode** (2.6): token override, toggle 3 trạng thái (Hệ thống/Sáng/Tối) trong Profile, lưu `localStorage` bọc `try/catch`. Kiểm tra hero card, chart, skeleton ở cả 2 theme.
- [ ] **4.6 Safe-area & viewport:** `viewport-fit=cover` trong `index.html`; padding `env(safe-area-inset-*)` cho bottom nav, CTA sticky, sheet.
- [ ] **4.7 Audit a11y cuối:** kiểm tra bằng axe DevTools (0 lỗi critical/serious), điều hướng toàn app chỉ bằng bàn phím, zoom 200% không vỡ layout ở 390px.
- [ ] **4.8 Tương phản cuối:** liệt kê mọi cặp text/nền trong PR với tỉ lệ đo được; không cặp nào < 4.5:1 cho text thường.
- [ ] **4.9 Regression T1–T6 lần cuối** + `pnpm build` không lỗi TypeScript.

---

## 6. Bổ sung chức năng (Feature Completeness)

> Mục 1–5 chỉ nâng cấp **những gì đã có**. Mục này bổ sung các chức năng mà một app dinh dưỡng & chế độ ăn cần có nhưng prototype hiện chưa có. Thực thi **sau** Phase 4 (Phase 5–6), trừ khi item ghi khác.

### 6.1 Đối chiếu với ứng dụng tham chiếu (MyFitnessPal, Yazio, Lifesum)

Ký hiệu: ✅ có · ⚠️ có một phần/giả lập · ❌ chưa có. Cột "Plan mục 1–5" cho biết bản kế hoạch phía trên đã xử lý chưa.

| Nhóm | Chức năng | Prototype hiện tại | Plan mục 1–5 | Ưu tiên (MoSCoW) |
|---|---|---|---|---|
| **Hồ sơ & mục tiêu** | Hồ sơ cơ thể (tuổi, giới, chiều cao, cân nặng, mức vận động) | ❌ | ❌ | **Must** |
| | Ước tính mục tiêu kcal từ hồ sơ (BMR/TDEE) | ❌ (nhập tay) | ❌ | **Must** |
| | Mục tiêu macro chỉnh được (% hoặc gram) | ❌ | ⚠️ read-only | **Must** |
| | Mục tiêu theo loại (giảm/giữ/tăng cân) + cân nặng mục tiêu | ⚠️ (3 lựa chọn không ảnh hưởng số liệu) | ❌ | **Should** |
| | Sở thích ăn uống & dị ứng (chay, không lactose, dị ứng hải sản…) | ❌ | ❌ | **Should** |
| **Ghi nhận** | Tìm món & ghi theo bữa | ✅ | ✅ | — |
| | Thêm nhanh món gần đây / yêu thích (★) | ❌ | ⚠️ gần đây | **Must** (thêm Yêu thích) |
| | Nhập nhanh kcal (không cần chọn món) | ❌ | ❌ | **Must** |
| | Tạo món tùy chỉnh (Custom food) | ❌ | ❌ | **Must** |
| | Bữa ăn đã lưu / công thức (nhiều nguyên liệu → 1 món) | ❌ | ❌ | **Should** |
| | Sao chép bữa / ngày | ❌ | ⚠️ sao chép hôm qua | **Should** (thêm sao chép từng bữa) |
| | Đơn vị khẩu phần Việt (bát, tô, đĩa, muỗng, quả, ổ) quy đổi gram | ⚠️ chỉ nhãn chữ | ⚠️ `servingGrams` | **Must** |
| | Quét mã vạch | ❌ | ❌ | **Could** (giả lập) |
| | Ghi bằng ảnh (AI nhận diện) | ❌ | ❌ | **Won't** (phiên bản này) |
| | Giờ ăn & ghi chú cho từng món | ❌ | ❌ | **Could** |
| **Dinh dưỡng** | Kcal + 3 macro | ⚠️ macro cứng | ✅ | — |
| | Chất xơ, đường, natri (nhãn dinh dưỡng mở rộng) | ❌ | ❌ | **Should** |
| | Nước uống | ✅ | ✅ | — |
| **Thực đơn** | Xem & đổi món kế hoạch | ✅ | ✅ | — |
| | Tự tạo/sửa kế hoạch (thêm, xóa món vào bữa của ngày bất kỳ) | ❌ | ❌ | **Must** |
| | Ghi món kế hoạch vào nhật ký | ❌ | ✅ | — |
| | Lặp kế hoạch (áp dụng cho cả tuần) | ❌ | ❌ | **Could** |
| | Danh sách đi chợ sinh từ kế hoạch | ❌ | ❌ | **Should** |
| | Gợi ý món lọc theo sở thích/dị ứng | ❌ | ❌ | **Should** |
| **Tiến độ** | Biểu đồ kcal tuần | ⚠️ cứng | ✅ | — |
| | Theo dõi cân nặng (ghi + biểu đồ xu hướng) | ❌ | ❌ | **Must** |
| | Phân bố macro trung bình | ❌ | ✅ | — |
| | Chuỗi ngày ghi nhật ký (streak) & thống kê thói quen | ❌ | ❌ | **Should** |
| | Nhận xét tuần (insight trung tính) | ❌ | ❌ | **Could** |
| **Hoạt động** | Ghi hoạt động thể chất (kcal tiêu hao) | ❌ | ❌ | **Could** |
| **Duy trì thói quen** | Nhắc nhở bữa ăn / uống nước (cài đặt giờ) | ❌ | ❌ | **Should** |
| | Hướng dẫn lần đầu (coach marks) | ❌ | ❌ | **Could** |
| **Cài đặt & dữ liệu** | Cỡ chữ lớn (accessibility) | ❌ | ❌ | **Must** (người dùng đa độ tuổi) |
| | Chế độ ẩn số calo (tập trung thói quen) | ❌ | ❌ | **Should** |
| | Đơn vị (kg/lb, ml/oz), ngày bắt đầu tuần | ❌ | ❌ | **Could** |
| | Lưu dữ liệu giữa các lần mở (persistence) | ❌ | ❌ | **Should** (có điều kiện, xem 6.4) |
| | Xuất dữ liệu (CSV) | ❌ | ❌ | **Could** |

**Kết luận:** mục 1–5 làm đúng và đủ phần *giao diện* của các chức năng đang có, nhưng **chưa đủ về chức năng** cho một app quản lý dinh dưỡng. Thiếu nhiều nhất ở: hồ sơ cơ thể và cách tính mục tiêu, cách ghi món linh hoạt (món tùy chỉnh, nhập nhanh kcal, yêu thích, đơn vị Việt), tự tạo thực đơn, và theo dõi cân nặng. Các mục **Must** và **Should** được đặc tả dưới đây. Mục **Could** chỉ ghi ngắn trong checklist. Mục **Won't** nằm ngoài phạm vi.

### 6.2 Nguyên tắc an toàn nội dung (áp dụng cho mọi chức năng mới)

- Mọi con số ước tính (BMR, TDEE, mục tiêu macro, cân nặng mục tiêu) gắn nhãn **"Ước tính tham khảo, không thay thế tư vấn của chuyên gia dinh dưỡng/bác sĩ"**.
- **Sàn mục tiêu kcal:** không gợi ý dưới 1.200 kcal/ngày (nữ) hoặc 1.500 kcal/ngày (nam). Nếu người dùng tự nhập thấp hơn, hiện cảnh báo trung tính (`text-warning`) "Mức này thấp hơn ngưỡng thường được khuyến nghị. Hãy tham khảo chuyên gia." Vẫn cho lưu.
- **Tốc độ giảm cân:** chỉ cho chọn −250 hoặc −500 kcal/ngày so với TDEE (≈ 0,25–0,5 kg/tuần). Không có lựa chọn mạnh hơn.
- Không hiển thị nhãn phân loại BMI ("béo phì", "thừa cân"). Nếu cần thì chỉ hiện chỉ số, không có nhãn.
- Không dùng ngôn ngữ đánh giá ("tốt/xấu", "ăn gian", "vượt quá"). Dùng "cao hơn/thấp hơn mục tiêu".
- "Chế độ ẩn số calo" (6.3.12) phải tắt được mọi con số kcal trên toàn app. Đây là lựa chọn an toàn cho người không muốn đếm calo.

### 6.3 Đặc tả chức năng mới

#### 6.3.1 Hồ sơ cơ thể & ước tính mục tiêu (Must)

- **Vị trí:** Setup mở rộng thành 3 bước (stepper "Bước 1/3" có thanh tiến trình 4px): (1) Mục tiêu (giữ màn hiện có, thêm "Giảm cân / Giữ cân / Tăng cân"), (2) Hồ sơ cơ thể, (3) Xem lại mục tiêu đề xuất. Mỗi bước có nút "Bỏ qua, dùng mục tiêu mẫu" để giữ đường tắt hiện tại.
- **Bước 2 – fields:** Giới tính sinh học (segmented: Nam / Nữ), Năm sinh (select), Chiều cao (cm, 100–250), Cân nặng hiện tại (kg, 30–300, bước 0,1), Mức vận động (5 radio card có mô tả: Ít vận động ×1,2 · Nhẹ ×1,375 · Vừa ×1,55 · Nhiều ×1,725 · Rất nhiều ×1,9). Field dùng `Field` primitive, có validate theo khoảng.
- **Công thức** (`src/lib/energy.ts`, hàm thuần, có unit test thủ công trong comment):
  - BMR Mifflin–St Jeor: `10·kg + 6,25·cm − 5·tuổi + 5` (nam) / `− 161` (nữ).
  - TDEE = BMR × hệ số vận động.
  - Mục tiêu = TDEE + điều chỉnh (Giảm: −250/−500 cho người dùng chọn, Giữ: 0, Tăng: +250). Làm tròn đến 10 kcal. Áp dụng sàn ở 6.2.
  - Macro mặc định 20/50/30 (% kcal), đổi sang gram theo `/4, /4, /9`.
- **Bước 3 – màn xem lại:** card hero hiển thị "Mục tiêu đề xuất: 1.850 kcal/ngày". Bên dưới là bảng diễn giải 3 dòng (BMR → TDEE → điều chỉnh), mỗi dòng có icon `help` mở tooltip giải thích. 3 MacroBar hiển thị mục tiêu gram. Có nút "Điều chỉnh" mở GoalForm và CTA "Bắt đầu".
- **Profile:** thêm section "Hồ sơ cơ thể" để sửa từng field. Khi đổi cân nặng/vận động, hiện banner "Mục tiêu đề xuất mới: X kcal · Cập nhật / Giữ nguyên". **Không** tự ghi đè mục tiêu người dùng đã tự đặt.
- **Ràng buộc test:** dữ liệu mẫu của An vẫn có mục tiêu 2.000 kcal / 2.000 ml. Hồ sơ mẫu chọn sao cho đề xuất ra đúng 2.000 hoặc để `goalSource: "manual"` để không thay đổi số liệu T1–T6.

#### 6.3.2 Mục tiêu macro chỉnh được (Must)

- Trong GoalForm thêm section "Phân bổ dinh dưỡng" với 2 chế độ (segmented): **Theo %** (3 slider, bước 5%, tổng bắt buộc = 100%, hiển thị tổng realtime và lỗi "Tổng phải bằng 100%, hiện là 95%") và **Theo gram** (3 field số, kcal tự tính lại từ gram và hiển thị bên dưới).
- Thêm preset chips: "Cân bằng 20/50/30" · "Nhiều đạm 30/40/30" · "Ít tinh bột 25/35/40". Mỗi chip có `aria-pressed`.
- Thanh tổng hợp màu 3 đoạn (stacked bar 12px, màu protein/carbs/fat) xem trước tỷ lệ.

#### 6.3.3 Đơn vị khẩu phần kiểu Việt (Must)

- Mở rộng `Food`: `units: { id: string; label: string; grams: number }[]`, ví dụ Cơm trắng: `[{label:"bát", grams:150}, {label:"muỗng", grams:15}, {label:"g", grams:1}]`. Phở bò: `[{label:"tô", grams:500}, {label:"tô nhỏ", grams:350}]`.
- FoodDetail: cụm portion gồm **số lượng** (stepper, bước 0,5, cho số thập phân) × **đơn vị** (select/segmented chips). Dưới cụm hiển thị quy đổi "= 225 g" (`text-caption`). Quick chips sinh từ `units` (½ bát, 1 bát, 2 bát).
- `LogEntry` lưu `{ quantity, unitId, grams }`. `grams` là nguồn để tính toán, `quantity + unitId` dùng để hiển thị "1,5 bát (225 g)".
- **T1/T2:** đơn vị "g" phải luôn có để nhập đúng 150 g / 100 g.

#### 6.3.4 Yêu thích & Gần đây (Must)

- Nút ★ (44px, `aria-pressed`, `aria-label="Thêm vào yêu thích"`) ở header FoodDetail và trong menu của FoodRow.
- FoodSearch: chip thứ 4 "Yêu thích". Khi ô tìm kiếm rỗng, hiển thị theo thứ tự: Yêu thích (tối đa 5) → Gần đây (tối đa 8, sắp theo `lastLoggedAt` giảm dần, khẩu phần mặc định = khẩu phần lần ghi gần nhất) → Phổ biến.
- QuickLogSheet: hàng "Gần đây" lấy từ selector `selectRecentFoods(5)` (thay danh sách tĩnh).

#### 6.3.5 Nhập nhanh kcal (Must)

- Vị trí: QuickLogSheet (hàng "Nhập nhanh calo") và nút phụ dưới ô tìm kiếm ("Không tìm thấy? Nhập nhanh").
- Sheet gồm: Tên (tùy chọn, mặc định "Nhập nhanh"), kcal (bắt buộc, 1–5.000), Đạm/Tinh bột/Chất béo (tùy chọn, gram), Bữa (segmented). CTA "Thêm · X kcal".
- `LogEntry` thêm `kind: "food" | "quick"`. Entry nhanh lưu trực tiếp `kcal/protein/carbs/fat`. Nhật ký hiển thị icon ⚡ và meta "Nhập nhanh".

#### 6.3.6 Món tùy chỉnh (Must) & Công thức / Bữa đã lưu (Should)

- **Món tùy chỉnh:** màn `CreateFood` mở từ empty state của tìm kiếm ("Tạo món '{query}'", tên điền sẵn từ từ khóa) và từ Profile → "Món của tôi".
  - Fields: Tên*, Khẩu phần (số + đơn vị + quy đổi gram)*, kcal*, Đạm, Tinh bột, Chất béo, Chất xơ, Đường, Natri (tùy chọn).
  - Kiểm tra nhất quán: nếu `|kcal − (4P + 4C + 9F)| > 15%` thì hiện cảnh báo mềm "Calo và macro chưa khớp, vẫn lưu?".
  - Món tạo ra có badge "Của tôi" trong kết quả tìm kiếm.
- **Công thức / bữa đã lưu:** màn `CreateRecipe`.
  - Tên, số phần ăn (stepper), danh sách nguyên liệu (thêm bằng FoodSearch ở chế độ `pick`, mỗi dòng có quantity/unit và có thể xóa).
  - Tổng kcal/macro tính realtime, hiển thị "mỗi phần: X kcal".
  - Lưu xong món xuất hiện trong tìm kiếm như một món thường (`Food.kind = "recipe"`, giá trị dinh dưỡng mỗi phần là dẫn xuất).
  - "Lưu bữa này" trong menu của MealSection (Nhật ký) tạo nhanh một bữa đã lưu từ các món của bữa đó.

#### 6.3.7 Sao chép bữa (Should)

- Menu của MealSection ở Nhật ký thêm "Sao chép bữa sang…". Sheet chọn ngày (7 ngày gần nhất) và bữa đích, sau đó hiện toast có Undo.
- Giữ "Sao chép từ hôm qua" ở empty-day state (đã có ở 4.5).

#### 6.3.8 Nhãn dinh dưỡng mở rộng (Should)

- `Food` thêm `fiber`, `sugar`, `sodium` (mg) per 100 g. Có thể để `null` cho món thiếu dữ liệu.
- FoodDetail: dưới 3 macro chip thêm accordion "Xem thêm dinh dưỡng" (`<details>`/`<summary>` có style, mặc định đóng). Bên trong là bảng 2 cột: Chất xơ / Đường / Natri. Ô thiếu dữ liệu ghi "Chưa có dữ liệu", không ghi 0.
- Nhật ký: summary ngày thêm 1 dòng `text-caption` "Chất xơ 18 g · Đường 32 g · Natri 1.450 mg". Hiển thị trung tính, không tô màu cảnh báo.

#### 6.3.9 Tự tạo & quản lý thực đơn (Must) + Danh sách đi chợ (Should)

- Planner: mỗi plan card có menu (kebab 44px) "Đổi món / Xóa khỏi kế hoạch / Ghi vào nhật ký (chỉ hôm nay)". Bữa trống hiển thị nút dashed "+ Thêm món vào bữa tối", mở FoodSearch ở chế độ `plan` (CTA đổi thành "Thêm vào kế hoạch"). Ngày chưa có kế hoạch hiển thị 2 nút: "Thêm món" và "Sao chép kế hoạch từ ngày khác".
- Store thêm `PlanEntry { id, date, meal, foodId, quantity, unitId, grams, status: "planned" | "logged" }`. Trạng thái "Đã ghi" suy ra từ `status`.
- **Danh sách đi chợ:** nút "Danh sách đi chợ" ở header Planner (thay nút lịch đang không hoạt động).
  - Màn `ShoppingList`: chọn phạm vi ngày (chips: Hôm nay / 3 ngày tới / Cả tuần).
  - Nguyên liệu gom từ `PlanEntry` (recipe được tách thành nguyên liệu), cộng dồn gram theo `foodId`, nhóm theo danh mục (Tinh bột, Đạm, Rau củ, Trái cây, Sữa).
  - Mỗi dòng là checkbox 44px. Món đã tick bị gạch ngang và chuyển xuống cuối nhóm.
  - Empty: "Chưa có món nào trong kế hoạch của khoảng thời gian này".
- **T4:** luồng đổi món bữa trưa ngày mai phải giữ được nguyên số lần chạm (Planner → chọn ngày mai → Đổi món → chọn → Xác nhận).

#### 6.3.10 Theo dõi cân nặng (Must)

- **Ghi:** QuickLogSheet thêm hàng "Cân nặng". Sheet nhập kg (bước 0,1, mặc định là lần ghi gần nhất, stepper ± và ô nhập), ngày (mặc định hôm nay), CTA "Lưu". Mỗi ngày chỉ 1 bản ghi (ghi lại = cập nhật, có confirm).
- **Hiển thị:** màn Tiến độ thêm segmented ở đầu "Năng lượng | Cân nặng | Thói quen".
  - Tab Cân nặng có card hiện tại "62,4 kg", chênh lệch so với 7/30 ngày trước ("−0,6 kg so với 30 ngày trước", màu trung tính `ink`, không xanh/đỏ).
  - Line chart SVG 320×180, có range chips 1T / 3T / 6T, đường xu hướng trung bình động 7 ngày (nét liền `brand-700`), điểm đo thực tế (chấm 4px `brand-700/40`) và đường cân nặng mục tiêu nét đứt (nếu có).
  - Bên dưới là danh sách lịch sử, mỗi dòng có thể sửa/xóa (Undo).
- **States:** 0 bản ghi → "Ghi cân nặng đầu tiên để xem xu hướng" + CTA. 1 bản ghi → chỉ hiện điểm, caption "Cần ít nhất 2 lần ghi để vẽ xu hướng".
- **Dữ liệu mẫu:** 8 bản ghi trong 30 ngày, nằm trong 62–63,5 kg.

#### 6.3.11 Sở thích ăn uống & dị ứng (Should)

- Profile → "Sở thích ăn uống": chip đa chọn cho chế độ ăn (Ăn chay, Thuần chay, Không lactose, Ít đường) và dị ứng (Hải sản, Đậu phộng, Trứng, Sữa, Gluten).
- `Food` thêm `tags: string[]` và `allergens: string[]`.
- FoodSearch: món chứa dị ứng đã chọn vẫn hiển thị nhưng có badge cảnh báo `bg-danger-tint text-danger` "Chứa hải sản" và bị đẩy xuống cuối danh sách. Không ẩn hẳn để người dùng vẫn ghi lại được những gì đã ăn thật.
- Swap/gợi ý thực đơn: **loại bỏ** món chứa dị ứng và ưu tiên món khớp chế độ ăn. Caption hiển thị "Đã lọc theo sở thích của bạn · Sửa".

#### 6.3.12 Cài đặt hiển thị & thói quen (Must: cỡ chữ · Should: ẩn calo, nhắc nhở, streak)

- **Cỡ chữ:**
  - Profile → "Hiển thị" có segmented "Vừa / Lớn / Rất lớn". Cài đặt này đặt `html { font-size: 100% | 112.5% | 125% }`.
  - Yêu cầu toàn bộ typography scale (2.2) dùng `rem` để phóng theo. Layout phải không vỡ ở mức "Rất lớn" trên 390px. Hàng danh sách cho phép xuống 2 dòng thay vì cắt bằng ellipsis.
- **Chế độ ẩn số calo:**
  - Toggle trong "Hiển thị". Khi bật: CalorieRing chuyển thành vòng "số bữa đã ghi / 4", ẩn mọi số kcal (Hôm nay, Nhật ký, Tìm kiếm, CTA, Tiến độ năng lượng). Macro hiển thị dạng thanh không kèm số.
  - Selector hiển thị dùng chung hook `useDisplayPrefs()` để mọi component tự đọc.
- **Nhắc nhở:**
  - Profile → "Nhắc nhở" có danh sách toggle + time picker: Bữa sáng 07:30, Bữa trưa 12:00, Bữa tối 18:30, Uống nước (mỗi 2 giờ, 08:00–20:00).
  - Chế độ `prototype` chỉ lưu cài đặt và giả lập bằng banner trong app (nút "Xem thử nhắc nhở" hiển thị banner trên đầu khung điện thoại 4s). **Không** gọi Notification API thật. Chế độ `app` dùng nhắc nhở thật theo 7.7.
- **Streak & thói quen:**
  - Tab "Thói quen" ở Tiến độ hiển thị: chuỗi ngày ghi liên tiếp (số lớn + icon lá), lưới 5 tuần × 7 ngày (ô 32px, `bg-brand-700` nếu có ghi, `bg-line` nếu không, `aria-label` theo ngày), số ngày đạt mục tiêu nước trong tuần.
  - Mất chuỗi hiển thị "Bắt đầu lại hôm nay", không hiển thị số ngày đã mất.

#### 6.3.13 Lưu dữ liệu (Should, có điều kiện)

- Chế độ `prototype`: **tắt** (mỗi phiên kiểm thử bắt đầu từ dữ liệu mẫu).
- Chế độ `app`: **bật mặc định**, đặc tả đầy đủ ở **7.4** (migration, dữ liệu hỏng, sao lưu/khôi phục bằng file).

#### 6.3.14 Could (đặc tả ngắn)

- **Quét mã vạch (giả lập):** QuickLogSheet có hàng "Quét mã vạch", mở màn khung camera giả (khung 240×160 viền góc, dòng quét chạy, nút "Mô phỏng quét thành công") → mở FoodDetail của 1 sản phẩm đóng gói mẫu ("Sữa tươi ít đường 180 ml"). Có trạng thái "Không nhận diện được" kèm 2 nút "Nhập tay" / "Thử lại". Không truy cập camera thật. Chế độ `app` dùng camera thật theo 7.8.
- **Ghi hoạt động:** QuickLogSheet có hàng "Hoạt động". Sheet nhập loại (Đi bộ, Chạy, Đạp xe, Bơi, Khác), thời lượng, kcal ước tính (MET × kg × giờ, cho sửa). Profile có toggle "Cộng kcal hoạt động vào ngân sách" (mặc định **tắt**). Hôm nay hiển thị dòng "Hoạt động: 180 kcal" dưới ring.
- **Giờ ăn & ghi chú:** FoodDetail có field giờ (mặc định giờ hiện tại) và ghi chú (textarea 3 dòng, 200 ký tự).
- **Lặp kế hoạch:** menu ngày ở Planner có "Áp dụng cho các ngày…", chọn chip thứ trong tuần.
- **Insight tuần:** card ở tab Năng lượng, tối đa 2 câu trung tính dựa trên số liệu ("Tuần này bạn ghi 5/7 ngày. Bữa sáng là bữa được ghi đều nhất.").
- **Coach marks:** lần đầu vào Hôm nay hiện 3 bước tooltip (FAB, ring, MealSection +). Có nút "Bỏ qua" và chỉ hiện 1 lần (`localStorage`, tắt trong stage mode).
- **Xuất CSV:** Profile → "Xuất dữ liệu" tải `nutridaily-YYYY-MM-DD.csv` gồm các cột date, meal, food, grams, kcal, protein, carbs, fat.
- **Đơn vị:** Profile → kg/lb, ml/oz. Chỉ đổi cách hiển thị, store luôn lưu kg/ml.

### 6.4 Mở rộng data model & điều hướng

```ts
type Sex = "male" | "female";
type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
type UserProfile = { sex: Sex; birthYear: number; heightCm: number; activity: ActivityLevel; goalType: "lose" | "maintain" | "gain"; deficit: 0 | 250 | 500; targetWeightKg?: number };
type Goals = { kcal: number; waterMl: number; macroMode: "percent" | "grams"; proteinPct: number; carbsPct: number; fatPct: number; proteinG: number; carbsG: number; fatG: number; source: "suggested" | "manual" };
type FoodUnit = { id: string; label: string; grams: number };
type Food = { id: string; name: string; kind: "base" | "custom" | "recipe" | "packaged"; units: FoodUnit[]; defaultUnitId: string;
  kcal: number; protein: number; carbs: number; fat: number; fiber: number | null; sugar: number | null; sodium: number | null; // per 100 g
  category: "starch" | "protein" | "veg" | "fruit" | "dairy" | "other"; tags: string[]; allergens: string[]; popular: boolean;
  ingredients?: { foodId: string; grams: number }[]; servings?: number };
type LogEntry = { id: string; date: string; meal: MealType; kind: "food" | "quick"; foodId?: string; quantity?: number; unitId?: string; grams?: number;
  quick?: { name: string; kcal: number; protein?: number; carbs?: number; fat?: number }; time?: string; note?: string; loggedAt: number };
type PlanEntry = { id: string; date: string; meal: MealType; foodId: string; quantity: number; unitId: string; grams: number; status: "planned" | "logged" };
type WeightLog = { id: string; date: string; kg: number };
type ActivityLog = { id: string; date: string; type: string; minutes: number; kcal: number };
type Prefs = { fontScale: 1 | 1.125 | 1.25; hideCalories: boolean; theme: "system" | "light" | "dark"; diets: string[]; allergens: string[];
  reminders: { id: string; label: string; time: string; enabled: boolean }[]; addActivityToBudget: boolean; favorites: string[]; units: { weight: "kg" | "lb"; volume: "ml" | "oz" } };
```

- Thay `Food`/`LogEntry`/`Goals` ở 4.0 bằng định nghĩa trên. Có thể làm từ Phase 1 (item 1.6) để không phải migrate lần hai. Field chưa dùng để giá trị mặc định.
- Selectors mới: `selectDayTotals` (cộng cả `quick` + `ActivityLog` nếu `addActivityToBudget`), `selectRecentFoods(n)`, `selectFavorites`, `selectStreak(today)`, `selectWeightTrend(range)`, `selectShoppingList(fromDate, toDate)`.
- **Điều hướng:** không thêm tab mới. Các chức năng mới vào qua 3 cửa:
  1. **QuickLogSheet (FAB):** Thêm món · Nhập nhanh calo · Nước · Cân nặng · Ghi từ thực đơn · (Could) Quét mã vạch · Hoạt động. Sheet dạng lưới 2 cột, mỗi ô 72px, icon 24px + nhãn.
  2. **Tiến độ:** segmented Năng lượng | Cân nặng | Thói quen.
  3. **Cá nhân:** nhóm section Hồ sơ cơ thể · Mục tiêu & dinh dưỡng · Sở thích ăn uống · Món của tôi · Nhắc nhở · Hiển thị · Dữ liệu (Xuất CSV, Đặt lại dữ liệu mẫu, Bộ tài liệu kiểm thử).
  - Desktop sidebar: thêm mục "Danh sách đi chợ" dưới "Thực đơn".

### 6.5 Kiểm thử bổ sung (tùy chọn)

Không sửa T1–T6. Nếu nhóm quyết định kiểm thử chức năng mới, thêm vào `TestingHub` (chỉ nhiệm vụ và tiêu chí, **không** điền kết quả):
- T7 – Ghi cân nặng: "Sáng nay bạn cân được 62,0 kg. Hãy ghi lại." → Hoàn thành khi Tiến độ › Cân nặng hiện 62,0 kg hôm nay.
- T8 – Nhập nhanh: "Bạn ăn một món không có trong danh sách, khoảng 300 kcal, vào bữa tối." → Hoàn thành khi bữa tối có entry 300 kcal.
- T9 – Thực đơn tự tạo: "Thêm Trứng luộc vào bữa sáng thứ Bảy." → Hoàn thành khi Planner thứ Bảy, bữa sáng có Trứng luộc.
- T10 – Cỡ chữ: "Hãy làm cho chữ trong ứng dụng to hơn." → Hoàn thành khi cỡ chữ ≠ "Vừa".

### 6.6 Phase 5 — Feature Completeness: Must

- [ ] **5.1 Data model 6.4:** migrate `foods`/`initialMeals`/store sang type mới; thêm `units` cho 9 món mẫu (bát/tô/quả/ổ/hộp + "g"). *Done khi:* tổng mẫu vẫn 643 kcal, T1–T6 pass.
- [ ] **5.2 `src/lib/energy.ts`:** `calcBmr`, `calcTdee`, `suggestGoals(profile)` với sàn kcal 6.2. Ghi 3 ví dụ tính tay trong comment (nam 30t/170cm/65kg/×1,55; nữ 25t/158cm/50kg/×1,375; nữ 60t/155cm/55kg/×1,2) và kiểm tra kết quả khớp.
- [ ] **5.3 Setup 3 bước** (6.3.1) + stepper + mỗi bước có "Bỏ qua". Profile có section Hồ sơ cơ thể + banner đề xuất mục tiêu mới.
- [ ] **5.4 GoalForm macro** (6.3.2): chế độ % / gram, preset chips, validate tổng 100%, stacked bar xem trước.
- [ ] **5.5 Đơn vị khẩu phần** (6.3.3): quantity × unit, quy đổi gram, quick chips từ `units`. Nhật ký hiển thị "1,5 bát (225 g)".
- [ ] **5.6 Yêu thích** (6.3.4): nút ★, chip "Yêu thích", thứ tự gợi ý khi ô tìm kiếm rỗng, QuickLogSheet đọc `selectRecentFoods`.
- [ ] **5.7 Nhập nhanh kcal** (6.3.5) từ QuickLogSheet và từ empty/footer của tìm kiếm.
- [ ] **5.8 Món tùy chỉnh** (6.3.6): `CreateFood`, có điền sẵn tên từ query, cảnh báo lệch kcal/macro, badge "Của tôi", danh sách "Món của tôi" trong Profile (sửa/xóa).
- [ ] **5.9 Thực đơn tự tạo** (6.3.9): `PlanEntry`, thêm/xóa/đổi món mọi bữa mọi ngày, FoodSearch chế độ `plan`, sao chép kế hoạch từ ngày khác. T4 pass.
- [ ] **5.10 Cân nặng** (6.3.10): sheet ghi, tab Cân nặng có line chart + trung bình động 7 ngày + range chips + lịch sử. Có dữ liệu mẫu 8 điểm.
- [ ] **5.11 Cỡ chữ** (6.3.12): chuyển typography scale sang `rem`, segmented Vừa/Lớn/Rất lớn. *Done khi:* ở 125% trên 390px không có scroll ngang và không có nút nào bị che.
- [ ] **5.12 QuickLogSheet dạng lưới 2 cột** với các hàng mới (6.4).
- [ ] **5.13 Regression T1–T6.**

### 6.7 Phase 6 — Feature Completeness: Should & Could

- [ ] **6.1 Công thức & bữa đã lưu** (6.3.6): `CreateRecipe`, FoodSearch chế độ `pick`, "Lưu bữa này".
- [ ] **6.2 Sao chép bữa** (6.3.7).
- [ ] **6.3 Nhãn dinh dưỡng mở rộng** (6.3.8): fiber/sugar/sodium cho dữ liệu mẫu (thiếu thì `null`), accordion ở FoodDetail, dòng tổng ở Nhật ký.
- [ ] **6.4 Danh sách đi chợ** (6.3.9): màn `ShoppingList`, gom theo danh mục, checkbox, tách công thức thành nguyên liệu.
- [ ] **6.5 Sở thích & dị ứng** (6.3.11): chips trong Profile, badge cảnh báo trong tìm kiếm, lọc gợi ý trong Swap.
- [ ] **6.6 Ẩn số calo** (6.3.12) qua `useDisplayPrefs`. *Done khi:* bật toggle thì không còn chuỗi "kcal" nào hiển thị trên Hôm nay, Nhật ký, Tìm kiếm, FoodDetail, Planner, Tiến độ.
- [ ] **6.7 Nhắc nhở (giả lập)** + **Streak/Thói quen** (6.3.12).
- [ ] **6.8 Persistence có điều kiện** (6.3.13): tắt trong stage mode, "Đặt lại" xóa key.
- [ ] **6.9 Could** (6.3.14): làm theo thứ tự Quét mã vạch giả lập → Hoạt động → Giờ ăn & ghi chú → Insight tuần → Coach marks → Lặp kế hoạch → Xuất CSV → Đơn vị. Mỗi mục là 1 commit riêng và có thể bỏ nếu hết thời gian.
- [ ] **6.10 (Tùy chọn) T7–T10** trong TestingHub (6.5), chỉ khi nhóm xác nhận.
- [ ] **6.11 Regression T1–T6 + `pnpm build`.**

---

## 7. Chạy thực tế (frontend-only, không backend)

### 7.0 Phạm vi

- **Mục tiêu:** sau Phase 1–9, app chạy hoàn toàn trên trình duyệt và **dùng được hằng ngày bởi người thật**: ngày giờ thật, dữ liệu do người dùng nhập, lưu lại giữa các lần mở, cài lên màn hình chính, dùng được khi không có mạng.
- **Không có trong phạm vi:** server, cơ sở dữ liệu từ xa, đăng nhập/tài khoản, đồng bộ nhiều thiết bị, thông báo đẩy từ server, công cụ theo dõi/analytics. Không thêm bất kỳ dịch vụ nào cần khóa bí mật.
- **Hosting:** giữ cách deploy tĩnh hiện có của Figma Make (`.figma/make/deploy` → `pnpm run build` + `figma make deploy --build-dir dist`).

**Những gì mục 1–6 còn thiếu để dùng thực tế (chỉ tính phần frontend):**

| # | Vấn đề | Hệ quả khi người thật dùng | Xử lý ở |
|---|---|---|---|
| R1 | Ngày giờ là hằng số (`TODAY = "2025-06-19"`, đồng hồ 9:41) | App luôn hiện ngày 19/06, ghi nhật ký sai ngày | 7.3 |
| R2 | Dữ liệu mất khi tải lại trang (persistence mặc định tắt) | Mỗi lần mở app là mất hết nhật ký | 7.4 |
| R3 | Kho món có 9 món mẫu | Không tìm được món thật | 7.5 |
| R4 | Có thành phần chỉ để kiểm thử: stage điện thoại, TestingHub, "Đặt lại dữ liệu mẫu", độ trễ và lỗi giả lập | Người dùng thấy chức năng giả hoặc xóa nhầm dữ liệu | 7.1 |
| R5 | Điều hướng bằng `useState`, không có URL | Nút Back của điện thoại thoát app. Tải lại trang luôn quay về màn đầu | 7.2 |
| R6 | Nhập số bằng `Number()` | Gõ "62,4" bị hiểu là `NaN` | 7.3 |
| R7 | Chưa cài được lên màn hình chính, chưa chạy offline | Khó mở nhanh hằng ngày. Mất mạng thì không dùng được | 7.6 |
| R8 | Nhắc nhở và quét mã vạch là giả lập | Chức năng không hoạt động thật | 7.7, 7.8 |

**Giới hạn cần chấp nhận khi không có backend** (phải hiển thị rõ cho người dùng, xem 7.9):
- Dữ liệu chỉ nằm trên **một trình duyệt của một thiết bị**. Không tự chuyển sang máy khác.
- Xóa dữ liệu trình duyệt hoặc gỡ app là mất dữ liệu. Biện pháp: sao lưu/khôi phục bằng file (7.4).
- Trên iOS Safari, trang web **chưa được thêm vào màn hình chính** có thể bị trình duyệt xóa dữ liệu sau một thời gian không mở. Vì vậy cần khuyến khích cài PWA (7.6) và gọi `navigator.storage.persist()`.
- Nhắc nhở chỉ hoạt động khi app đang mở hoặc lúc người dùng mở app (7.7).

### 7.1 Hai chế độ build từ cùng một codebase

Biến môi trường `VITE_APP_MODE = "prototype" | "app"`, đọc qua `src/config/mode.ts`. Mã chỉ dành cho prototype được import động trong nhánh `if (MODE === "prototype")` để bị loại khỏi bundle `app`. Kiểm tra bằng `grep` thư mục `dist/`: không còn chuỗi "TestingHub".

| Thành phần trong mục 1–6 | `prototype` (đồ án, kiểm thử) | `app` (dùng thực tế) |
|---|---|---|
| `TODAY` / `NOW` (4.0, 4.6) | Hằng 2025-06-19, 9:41 | Ngày giờ thật theo múi giờ thiết bị (7.3) |
| Stage khung điện thoại, status bar 9:41 | Có | Không. Layout responsive theo 3.1/3.2 |
| `TestingHub`, link "Bộ tài liệu kiểm thử" | Có | Không có trong bundle |
| Dữ liệu mẫu An Nguyễn, "Đặt lại dữ liệu mẫu" | Có | Không. Người dùng mới bắt đầu trống và đi qua onboarding. Thay nút reset bằng "Xóa toàn bộ dữ liệu" (7.9) |
| Disclaimer "dữ liệu minh họa" | Có | Thay bằng "Số liệu dinh dưỡng là ước tính · Nguồn: …". **Giữ** câu "không thay thế tư vấn y khoa" |
| `SIMULATED_LATENCY_MS`, `simulateError` | Có (có thể đặt 0) | Không. Loading chỉ xuất hiện khi tải file dữ liệu món (7.5) hoặc mở camera |
| Persistence (6.3.13) | Tắt | **Bật mặc định** (7.4) |
| Nhắc nhở (6.3.12) | Banner giả lập | Nhắc trong app (7.7) |
| Quét mã vạch (6.3.14) | Giả lập | Camera thật (7.8, tùy chọn) |
| `robots.index` trong `.figma/make/site.json` | `false` | `true` nếu muốn người khác tìm thấy app, nếu không thì giữ `false` |
| Google Analytics qua `site.json` | Tắt | **Tắt** (không thu thập dữ liệu người dùng) |

Script trong `package.json`: `"build:prototype": "vite build --mode prototype"`, `"build:app": "vite build --mode app"`, cùng file `.env.prototype` / `.env.app`. Script deploy của Figma Make gọi `pnpm run build`. **Mặc định `build` = `build:prototype`** để bản đồ án đang deploy không bị thay đổi ngoài ý muốn. Chỉ đổi `build` sang `build:app` khi chủ dự án yêu cầu (sau khi xong H1–H4 ở 7.12). Ghi rõ điều này trong README.

### 7.2 Điều hướng có URL

- Dùng `react-router` (v7) với **`createHashRouter`** (URL dạng `/#/diary`). Hosting tĩnh không đảm bảo chuyển mọi đường dẫn về `index.html`, nên hash router đảm bảo tải lại trang và mở link trực tiếp không bị 404.
- **Bảng route:**
  - `#/` → Hôm nay
  - `#/diary/:date?` → Nhật ký
  - `#/log/search?meal=lunch&date=2026-10-26` → FoodSearch
  - `#/log/food/:foodId?meal=&date=` → FoodDetail
  - `#/log/entry/:entryId` → sửa món đã ghi
  - `#/plan/:date?`, `#/plan/:date/swap/:planEntryId`, `#/plan/shopping`
  - `#/progress/:tab` (`energy` | `weight` | `habits`)
  - `#/me`, `#/me/goals`, `#/me/body`, `#/me/foods`, `#/me/reminders`, `#/me/display`, `#/me/data`
  - `#/onboarding/:step`, `#/about`
  - Chế độ `prototype` thêm `#/testing`.
- Sheet và modal đẩy một history entry (`?sheet=quick-log`) để nút Back đóng sheet trước, rồi mới lùi màn.
- Có route 404: "Không tìm thấy trang" + nút "Về Hôm nay".
- Mỗi route bọc **error boundary**. Fallback: "Đã có lỗi xảy ra" + nút "Tải lại" và "Về Hôm nay". Ghi lỗi ra `console.error`, không gửi đi đâu.
- Mỗi route `lazy()` import. Màn quét mã vạch chỉ tải thư viện camera khi được mở.

### 7.3 Ngày giờ & số theo thói quen Việt

- `src/lib/date.ts`:
  - `todayLocal()` trả về `YYYY-MM-DD` theo múi giờ thiết bị. **Không** dùng `new Date().toISOString().slice(0,10)` vì hàm này lấy theo UTC, nên từ 00:00 đến 07:00 giờ Việt Nam sẽ ra ngày hôm trước.
  - Các hàm `addDays`, `startOfWeek` (tuần bắt đầu Thứ Hai), `formatDayVi` ("Thứ Năm, 19/06") dùng `Intl.DateTimeFormat("vi-VN")`.
  - Khi app đang mở qua nửa đêm (sự kiện `visibilitychange` + kiểm tra mỗi phút) thì cập nhật "Hôm nay".
- Lời chào theo giờ thật: "Chào buổi sáng/chiều/tối" (05–11 / 11–18 / 18–05). Tên lấy từ hồ sơ. Nếu chưa có tên thì chỉ ghi "Chào bạn".
- Bữa mặc định theo giờ thật (khung giờ ở 4.6).
- `src/lib/number.ts`:
  - `parseLocaleNumber(input)` chấp nhận "62,4", "62.4", "1.250" (phân cách nghìn), "1250". Trả về `null` nếu không hợp lệ.
  - Mọi ô nhập số dùng `inputMode="decimal"` + hàm này.
  - Hiển thị bằng `Intl.NumberFormat("vi-VN")`.

### 7.4 Lưu dữ liệu trên thiết bị

- **Lưu trữ:** `localStorage` key `nutridaily:v1`, giá trị `{ schemaVersion: 1, savedAt, data }`. Dung lượng ước tính một năm dùng (khoảng 2.000 entry) vào khoảng 0,5 MB, nằm trong giới hạn khoảng 5 MB của `localStorage`.
  - Ghi có debounce 300 ms sau mỗi thay đổi store, và ghi ngay khi có sự kiện `pagehide`.
  - Đọc/ghi bọc `try/catch`. Nếu đầy bộ nhớ (`QuotaExceededError`) thì hiện toast "Bộ nhớ đầy, hãy sao lưu và xóa dữ liệu cũ" kèm nút đến `#/me/data`.
  - Dữ liệu hỏng hoặc không parse được: **không ghi đè**. Lưu bản hỏng sang key `nutridaily:corrupt-<timestamp>`, rồi mở màn khôi phục "Không đọc được dữ liệu. Khôi phục từ file sao lưu / Bắt đầu lại".
- **Migration:** `src/storage/migrations.ts` chứa danh sách hàm `vN → vN+1`. Lúc khởi động, chạy tuần tự đến version hiện tại. Mỗi lần đổi data model (6.4) phải tăng `schemaVersion` và thêm hàm migration.
- **Đồng bộ giữa các tab:** nghe sự kiện `storage`. Nếu tab khác ghi, nạp lại store và hiện toast "Dữ liệu đã được cập nhật từ tab khác".
- **Giữ dữ liệu lâu dài:** sau khi người dùng ghi món đầu tiên, gọi `navigator.storage.persist?.()`.
- **Sao lưu & khôi phục** (`#/me/data`):
  - "Tải file sao lưu": tạo file `nutridaily-backup-YYYY-MM-DD.json` từ `Blob`, chứa toàn bộ store + `schemaVersion`.
  - "Khôi phục từ file": dùng `<input type="file" accept="application/json">`, kiểm tra bằng schema `zod`, chạy migration nếu version cũ hơn, rồi hiện xem trước ("1.234 món đã ghi, từ 01/03 đến 26/10"). Xác nhận "Thay thế dữ liệu hiện tại" mới ghi đè. File sai định dạng thì báo lỗi cụ thể và không đổi dữ liệu hiện có.
  - "Xuất CSV" (6.3.14) chuyển từ Could thành **Must** ở chế độ `app`.
  - Nhắc sao lưu: nếu `lastBackupAt` cách hơn 14 ngày và đã có trên 20 entry, hiện banner nhẹ ở Profile (không hiện ở Hôm nay): "Lần sao lưu gần nhất: 21 ngày trước · Sao lưu ngay".
- Store mặc định ở chế độ `app`: không có entry. Mục tiêu lấy từ onboarding.

### 7.5 Kho món ăn tĩnh đi kèm app

- File `public/data/foods.vi.json` (định dạng theo type `Food` ở 6.4), tải bằng `fetch` khi khởi động app và được service worker lưu cache (7.6). Ghi `version` trong file để biết khi nào cần cập nhật.
- **Quy mô:** 300–500 món ăn và nguyên liệu phổ biến ở Việt Nam. Mỗi món có:
  - `source`: nguồn số liệu, hiển thị ở cuối FoodDetail.
  - `units`: đơn vị kiểu Việt kèm gram, hiển thị "1 tô (~500 g)" vì khẩu phần mỗi nơi một khác.
  - `verified`: đã được người có chuyên môn rà soát hay chưa.
  - Món nhiều thành phần (phở, bún, cơm tấm) lưu dạng `recipe` với định lượng rõ ràng.
- **Nguồn dữ liệu:** agent **không tự bịa số liệu dinh dưỡng**. Agent tạo khung gồm định dạng CSV đầu vào `data/foods.csv`, script `scripts/build-foods.ts` (CSV → JSON) và bộ kiểm tra. Số liệu do nhóm dự án nhập từ nguồn có ghi rõ (xem 7.12).
- `scripts/validate-foods.ts` báo lỗi khi gặp một trong các trường hợp: `|kcal − (4P + 4C + 9F)| > 20%`, giá trị âm, thiếu đơn vị "g", trùng `id`, hoặc tên rỗng. Chạy trước mỗi lần build (`prebuild`).
- **Tìm kiếm phía client:**
  - Lúc tải, tạo sẵn chỉ mục `nameNormalized` (bỏ dấu bằng `normalize("NFD")` + đổi `đ → d`, viết thường).
  - So khớp theo thứ tự ưu tiên: bắt đầu bằng từ khóa → chứa từ khóa → khớp từng từ.
  - Xếp hạng: Yêu thích → đã ghi gần đây → `verified` → còn lại.
  - Mục tiêu: dưới 50 ms cho 1.000 món trên điện thoại tầm trung. Nếu chậm hơn thì chuyển sang Web Worker.
- **Món tùy chỉnh và công thức** (6.3.6) lưu trong store của người dùng và gộp vào kết quả tìm kiếm với badge "Của tôi".
- Nút "Báo dữ liệu sai" trên FoodDetail: vì không có server, nút này mở `mailto:` tới email góp ý của nhóm, nội dung điền sẵn tên món và `id`. Nếu nhóm không muốn nhận email thì ẩn nút.

### 7.6 PWA & offline

- `vite-plugin-pwa`:
  - `manifest.webmanifest` gồm `name: "NutriDaily"`, `short_name: "NutriDaily"`, `lang: "vi"`, `start_url: "./#/"`, `display: "standalone"`, `theme_color` = `--color-brand-900`, `background_color` = `--color-canvas`.
  - Icon 192/512 + maskable 512.
  - `shortcuts`: "Ghi bữa ăn" → `./#/log/search`, "Thêm nước" → `./#/?action=water`.
- **Service worker:** precache toàn bộ app shell, `foods.vi.json` và font. Như vậy app chạy 100% offline vì mọi dữ liệu đều ở trên máy.
  - Tự host font DM Sans/Manrope trong `public/fonts/` (bỏ `@import` Google Fonts) để offline vẫn đúng font.
- **Cập nhật phiên bản:** dùng `registerType: "prompt"`. Khi có bản mới, hiện toast "Đã có phiên bản mới · Tải lại". Không tự tải lại khi người dùng đang nhập dở.
- **Cài app:**
  - Android/desktop: bắt sự kiện `beforeinstallprompt` và hiện nút "Cài ứng dụng" trong Profile và trên Welcome. Không bật popup tự động.
  - iOS: hiện hướng dẫn "Chia sẻ → Thêm vào MH chính" có hình minh họa. Chỉ hiện trên Safari iOS khi chưa ở chế độ `standalone`.
- **Mất mạng:** vì app không cần mạng, chỉ hiện chấm nhỏ "Offline" ở header khi một chức năng cần mạng được mở (quét mã vạch tra cứu online, 7.8).

### 7.7 Nhắc nhở không cần server

- Cài đặt nhắc nhở giữ như 6.3.12 (danh sách toggle + giờ).
- **Khi app đang mở:**
  - Dùng `setTimeout` tới mốc nhắc gần nhất.
  - Đến giờ, hiện banner trong app ("Đến giờ bữa trưa · Ghi ngay"), kèm `Notification` của hệ thống nếu người dùng đã cấp quyền.
  - Chỉ xin quyền thông báo **sau khi** người dùng bật một nhắc nhở, và chỉ khi trình duyệt hỗ trợ.
- **Khi mở app:** nếu đã qua mốc nhắc bữa hôm nay mà bữa đó chưa được ghi, hiện thẻ nhẹ ở đầu Hôm nay ("Bạn chưa ghi bữa trưa · Ghi ngay · Bỏ qua"). Bấm "Bỏ qua" thì ẩn đến hết ngày.
- Màn Nhắc nhở ghi rõ giới hạn: **"Nhắc nhở chỉ hiện khi bạn đang mở NutriDaily."**

### 7.8 Quét mã vạch (Could, tùy chọn)

- Camera: dùng `BarcodeDetector` nếu trình duyệt có, nếu không thì fallback `@zxing/browser` (chỉ tải khi mở màn).
- Trước khi xin quyền camera, giải thích: "Dùng camera để đọc mã vạch. Hình ảnh không được lưu."
- Bị từ chối quyền hoặc không có camera → ô nhập tay 8/13 số.
- **Tra cứu:**
  - (a) Trước tiên tìm trong món tùy chỉnh của người dùng có cùng `barcode`.
  - (b) Nếu có mạng, gọi trực tiếp API công khai của Open Food Facts (`GET https://world.openfoodfacts.org/api/v2/product/{code}.json`, không cần khóa). Khi hiển thị phải ghi "Dữ liệu từ Open Food Facts" (theo giấy phép ODbL).
  - (c) Không tìm thấy hoặc offline → nút "Tạo món này", mã vạch điền sẵn, lưu thành món tùy chỉnh để lần sau quét ra ngay.
- Nếu nhóm quyết định không gọi dịch vụ bên ngoài thì bỏ bước (b). Chức năng vẫn hoạt động với món tự tạo.

### 7.9 Quyền riêng tư & an toàn (phần giao diện)

- **Onboarding** (chế độ `app`): Chào mừng → **Màn "Dữ liệu của bạn"** → Setup 3 bước (6.3.1) → Hôm nay.
  - Màn "Dữ liệu của bạn" nói rõ bằng 3 dòng có icon: "Dữ liệu chỉ lưu trên thiết bị này", "Không gửi đi đâu, không có tài khoản", "Xóa trình duyệt sẽ mất dữ liệu, hãy sao lưu định kỳ".
  - Nút "Tôi hiểu, tiếp tục".
- **Cổng độ tuổi:** ở Setup bước 2, nếu năm sinh cho thấy dưới 18 tuổi thì không cho chọn mục tiêu giảm cân, mục tiêu = TDEE, kèm lời khuyên hỏi ý kiến người lớn hoặc nhân viên y tế. App vẫn dùng được để ghi nhật ký.
- **Câu hỏi an toàn:** "Bạn đang mang thai hoặc cho con bú?". Nếu "Có" thì tắt lựa chọn giảm cân và khuyến nghị hỏi ý kiến bác sĩ.
- Giữ nguyên toàn bộ nguyên tắc 6.2 (sàn kcal, giới hạn tốc độ giảm cân, không có nhãn BMI, không dùng ngôn ngữ phán xét, chế độ ẩn calo).
- **Xóa toàn bộ dữ liệu** (`#/me/data`):
  - Màn xác nhận gợi ý "Tải file sao lưu trước", bắt gõ "XÓA".
  - Xóa key `nutridaily:*` rồi quay về onboarding.
  - Có nút danger riêng, cách xa các nút khác ít nhất 24px.
- **Trang `#/about`:** phiên bản app, nguồn dữ liệu dinh dưỡng, ghi công Open Food Facts (nếu dùng 7.8), giấy phép font, câu "không thay thế tư vấn y khoa", email góp ý.
- Không dùng analytics, không dùng script bên thứ ba, không tải font từ Google ở chế độ `app` (7.6).

### 7.10 Kiểm thử & chất lượng

- **Công cụ:** Vitest + Testing Library (unit/component), Playwright (E2E) + `@axe-core/playwright` (a11y). Lighthouse chạy tay trước mỗi lần phát hành.
- **Unit (độ phủ ≥ 80% cho `src/lib/**`, `src/storage/**` và selectors):**
  - `energy.ts`: 3 ví dụ ở 5.2 + biên sàn kcal + nhánh dưới 18 tuổi và mang thai.
  - `number.ts`: "62,4", "1.250", "1,250.5", "", "abc".
  - `date.ts`: 23:30 và 00:30 giờ Việt Nam; qua nửa đêm khi app đang mở; tuần bắt đầu Thứ Hai.
  - `storage`: migration v1 → v2; dữ liệu hỏng; `QuotaExceededError`; import file sai định dạng.
  - Quy đổi đơn vị, tổng macro, streak, danh sách đi chợ, tìm kiếm không dấu ("pho bo" ra "Phở bò", "dau" ra "Đậu").
- **Component:** CalorieRing (0 / 50% / vượt / ẩn calo), MacroBar, Field (lỗi + `aria-invalid`), Sheet (focus trap, Esc, Back đóng sheet).
- **E2E (390×844 và 1280×800):**
  - Chế độ `prototype`: T1–T6.
  - Chế độ `app`, gồm 5 luồng:
    - (1) Onboarding → ghi món → tải lại trang → dữ liệu còn.
    - (2) Sao lưu → xóa dữ liệu → khôi phục → dữ liệu khớp.
    - (3) Offline (Playwright `context.setOffline(true)`) → mở app → ghi món được.
    - (4) Nút Back đóng sheet rồi lùi màn.
    - (5) Đổi giờ hệ thống qua nửa đêm (`page.clock`) → "Hôm nay" chuyển ngày.
  - Mỗi route chạy axe với tiêu chí 0 vi phạm serious/critical.
- **Lighthouse (mobile, chế độ `app`):** Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, PWA installable.
- **Ngân sách:** JS ban đầu ≤ 180 KB gzip (không tính `foods.vi.json`). `foods.vi.json` ≤ 300 KB gzip.
- **Kiểm tra tay trước phát hành:** iPhone (Safari, đã cài PWA), Android tầm trung (Chrome, đã cài PWA), máy tính (Chrome/Edge). Bật VoiceOver/TalkBack cho luồng ghi món. Thử cỡ chữ "Rất lớn".

### 7.11 Phát hành

- Trước khi deploy, chạy lần lượt: `pnpm run format`, `tsc --noEmit`, `vitest run`, `validate-foods`, `build:app`, Playwright, sau đó kiểm tra `dist/` không chứa "TestingHub".
- Deploy bằng script Figma Make hiện có. Nếu cần cả hai bản, deploy bản `prototype` (cho đồ án) và bản `app` (cho người dùng) thành hai site riêng.
- Đánh số phiên bản `MAJOR.MINOR.PATCH` trong `package.json`, hiển thị ở `#/about`. Ghi thay đổi vào `CHANGELOG.md`.
- **Thử nghiệm với người thật:** 10–20 người dùng trong 2 tuần trước khi giới thiệu rộng. Thu góp ý qua email hoặc form của nhóm. Ưu tiên sửa lỗi mức Cao (khung ưu tiên trong TestingHub).

### 7.12 Việc cần con người thực hiện

| # | Việc | Bắt buộc trước khi cho người khác dùng? |
|---|---|---|
| H1 | Nhập số liệu dinh dưỡng cho 300–500 món từ nguồn có ghi rõ, và kiểm tra quyền sử dụng nguồn đó | Có |
| H2 | Người có chuyên môn dinh dưỡng rà soát: công thức mục tiêu, sàn kcal, câu chữ an toàn, các món được đánh dấu `verified` | Có |
| H3 | Kiểm thử khả năng sử dụng với người thật (T1–T10) và quyết định ưu tiên sửa | Có |
| H4 | Logo, icon PWA (192/512/maskable), nội dung trang Giới thiệu, email góp ý | Có |
| H5 | Quyết định có dùng Open Food Facts (7.8) hay không | Không |

### 7.13 Phase 7–9 — Checklist chạy thực tế

**Phase 7 — Nền tảng chạy thực tế** (làm sau Phase 4. Nên làm 7.1 ngay đầu Phase 1)
- [ ] **7.1** `src/config/mode.ts`, `.env.prototype` / `.env.app`, script `build:prototype` / `build:app`. Mã prototype được import động. *Done khi:* bundle `app` không chứa TestingHub, stage hay dữ liệu mẫu.
- [ ] **7.2** `src/lib/date.ts` + `src/lib/number.ts`. Thay mọi `Number(input)` và hằng `TODAY/NOW` (chỉ giữ ở `prototype`). Cập nhật "Hôm nay" khi qua nửa đêm. Lời chào theo giờ.
- [ ] **7.3** `createHashRouter` với bảng route 7.2. Sheet/modal gắn history. Route 404. Error boundary theo route. `lazy()` theo route. *Done khi:* tải lại ở `#/diary/2026-10-25` vẫn mở đúng ngày; nút Back đóng sheet trước khi lùi màn.
- [ ] **7.4** Persistence 7.4: lưu có debounce, `pagehide`, migration, đồng bộ giữa tab, xử lý dữ liệu hỏng và `QuotaExceededError`, `storage.persist()`.
- [ ] **7.5** Màn `#/me/data`: sao lưu JSON, khôi phục (zod + xem trước + xác nhận), xuất CSV, nhắc sao lưu, xóa toàn bộ dữ liệu.
- [ ] **7.6** Onboarding `app`: màn "Dữ liệu của bạn", cổng độ tuổi, câu hỏi mang thai/cho con bú. Store bắt đầu trống.

**Phase 8 — Dữ liệu món ăn & chức năng thật**
- [ ] **8.1** Định dạng `data/foods.csv`, `scripts/build-foods.ts`, `scripts/validate-foods.ts` (chạy ở `prebuild`), tải `foods.vi.json` + skeleton khi đang tải + trạng thái lỗi "Không tải được danh sách món · Thử lại".
- [ ] **8.2** Tìm kiếm client với chỉ mục không dấu (`đ → d`) và xếp hạng 7.5. Đo thời gian tìm với 1.000 món.
- [ ] **8.3** Hiển thị nguồn số liệu và badge ✓ trên FoodDetail. Nút "Báo dữ liệu sai" (`mailto:`).
- [ ] **8.4** Nhắc nhở trong app (7.7): banner khi đang mở, thẻ "chưa ghi bữa" khi mở app, `Notification` nếu được cấp quyền, câu giới hạn trên màn Nhắc nhở.
- [ ] **8.5** (Could) Quét mã vạch thật 7.8.

**Phase 9 — PWA, kiểm thử, phát hành**
- [ ] **9.1** `vite-plugin-pwa`: manifest, icon, shortcuts, precache gồm `foods.vi.json` và font tự host, toast có phiên bản mới, nút cài app, hướng dẫn cài trên iOS.
- [ ] **9.2** Unit + component test theo 7.10 (độ phủ ≥ 80% phần được nêu).
- [ ] **9.3** Playwright E2E cả 2 chế độ + axe cho mọi route, 2 viewport.
- [ ] **9.4** Lighthouse đạt ngưỡng 7.10, đúng ngân sách bundle.
- [ ] **9.5** Kiểm tra tay trên 3 thiết bị (7.10), viết `CHANGELOG.md`, trang `#/about`, deploy theo 7.11. **Chỉ cho người khác dùng khi H1–H4 (7.12) đã xong.**

---

## 8. Definition of Done (toàn dự án)

**A. Prototype (đồ án, Phase 1–6):**

1. Không còn `font-size` < 12px; không còn mã hex ngoài token.
2. Mọi số liệu (kcal, macro, nước, chart) tính từ store — không còn số cứng trong JSX.
3. Mọi control có style nút đều có hành vi thật hoặc bị xóa.
4. Ghi một món "Gần đây" vào đúng bữa: **≤ 2 lần chạm** từ Hôm nay (FAB → `+` trên món gần đây trong QuickLogSheet).
5. Mỗi màn có đủ Empty / Loading / Error / Success state theo mục 4.
6. 6 nhiệm vụ T1–T6 hoàn thành được; "Đặt lại dữ liệu mẫu" khôi phục đúng 643 kcal / 1.250 ml / mục tiêu 2.000 kcal – 2.000 ml (và xóa dữ liệu đã lưu nếu bật persistence).
7. Mọi chức năng **Must** ở 6.1 hoạt động: hồ sơ cơ thể + mục tiêu đề xuất, macro chỉnh được, đơn vị khẩu phần Việt, yêu thích, nhập nhanh kcal, món tùy chỉnh, tự tạo thực đơn, theo dõi cân nặng, cài đặt cỡ chữ.
8. Mọi con số ước tính có nhãn "tham khảo"; không có lựa chọn mục tiêu dưới sàn kcal mà không kèm cảnh báo; không có nhãn BMI hoặc ngôn ngữ phán xét (6.2).
9. `pnpm build` pass.

**B. Chạy thực tế (chế độ `app`, Phase 7–9):** chỉ được coi là "dùng được thực tế" khi đạt **tất cả**:

10. Bundle `app` không chứa TestingHub, dữ liệu mẫu, hằng ngày cố định hay chức năng giả lập (kiểm tra `dist/`).
11. "Hôm nay" là ngày thật theo múi giờ thiết bị và tự chuyển khi qua nửa đêm. Ô nhập số chấp nhận dấu phẩy thập phân.
12. Dữ liệu còn nguyên sau khi tải lại trang, đóng/mở lại trình duyệt và cập nhật phiên bản app (có migration).
13. Sao lưu ra file → xóa toàn bộ dữ liệu → khôi phục từ file cho kết quả giống hệt (E2E pass). File sai định dạng không làm hỏng dữ liệu hiện có.
14. Mọi màn có URL riêng. Tải lại trang giữ nguyên màn. Nút Back đóng sheet trước rồi mới lùi màn.
15. Cài được dạng PWA trên Android và iOS. Mở và ghi món được khi không có mạng.
16. Kho món có tối thiểu 300 món, qua `validate-foods`, mỗi món hiển thị nguồn số liệu.
17. Test xanh: typecheck, unit (≥ 80% `src/lib`, `src/storage`), E2E cả 2 chế độ + axe (0 serious/critical), Lighthouse (Perf ≥ 90, A11y = 100).
18. App không gửi dữ liệu người dùng ra ngoài (không analytics, không script bên thứ ba; chỉ có tra cứu mã vạch tùy chọn ở 7.8).
19. Việc H1–H4 (7.12) đã hoàn tất. **Agent không được tự đánh dấu mục này.**

---

## 9. Hướng dẫn cho agent thực thi

### 9.1 Thứ tự bắt buộc

1. Đọc toàn bộ mục 0, 2, 6.2, 6.4, 7.1 trước khi viết dòng code đầu tiên.
2. **Item 7.1** (hai chế độ build) → làm **trước** Phase 1.
3. Phase 1 (item 1.6 khai báo type theo 6.4) → Phase 2 → Phase 3 → Phase 4.
4. Phase 5 → Phase 6.
5. Phase 7 (trừ 7.1 đã làm) → Phase 8 → Phase 9.

Không nhảy Phase. Trong một Phase, làm theo thứ tự số của item, trừ khi item ghi khác.

### 9.2 Quy trình cho mỗi item

1. Đọc item và các mục được tham chiếu trong ngoặc (ví dụ "(4.7)").
2. Code đúng phạm vi item. Không "tiện tay" sửa phần của item khác.
3. Chạy `pnpm build` (phải pass, không có lỗi TypeScript). Khi đã có Vitest (từ lúc tạo file đầu tiên trong `src/lib/`), chạy `pnpm vitest run`.
4. Mở preview ở 390×844 và 1280×800, kiểm tra tiêu chí *Done khi* của item.
5. Đánh dấu `- [x]` cho item trong file này.
6. Commit riêng cho item, message dạng `feat(ui): 2.1 calorie ring svg` (số item ở đầu phần mô tả).
7. Cuối mỗi Phase: chạy lại T1–T6 ở chế độ `prototype` và ghi kết quả vào commit cuối của Phase.

### 9.3 Khi nào dừng lại và hỏi chủ dự án

- Đặc tả hai chỗ mâu thuẫn nhau, hoặc tiêu chí *Done khi* không thể đạt được.
- Thay đổi làm một trong T1–T6 không còn thực hiện được.
- Cần thêm thư viện không có trong danh sách ở mục 0.
- Cần số liệu dinh dưỡng thật (7.5, H1): **không tự tạo số liệu**. Dùng các món mẫu hiện có, gắn `verified: false` và ghi TODO.
- Môi trường không chạy được một công cụ (ví dụ Playwright không mở được trình duyệt trong Figma Make): ghi lại, chuyển phần đó sang chạy trên máy cục bộ (`run-local.bat` / `pnpm`), không bỏ qua trong im lặng.

### 9.4 Chia phiên làm việc

Kế hoạch có khoảng 80 item, quá lớn cho một phiên. Mỗi phiên agent nên làm **một Phase**, bắt đầu bằng việc đọc lại mục 9 và danh sách item chưa đánh dấu, rồi kết thúc bằng một bản tóm tắt: item đã xong, item bị chặn và lý do, kết quả T1–T6.

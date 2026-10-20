import fs from 'fs';
import path from 'path';

// Generate NutriDaily 11 Mobile Screens SVG for direct Figma Import

const W = 390;
const H = 844;
const GAP_X = 50;
const GAP_Y = 70;

const COLORS = {
  green950: '#12372b',
  green900: '#174737',
  green800: '#1d5c45',
  green700: '#28775a',
  green100: '#dff0e7',
  green50: '#eff8f3',
  cream: '#f8f7f2',
  warm: '#f5eee4',
  orange: '#ed9c52',
  orangeSoft: '#f8dfc7',
  ink: '#17201c',
  muted: '#6f7a75',
  line: '#e5e9e6',
  white: '#ffffff',
  danger: '#bd4f46',
  waterBg: '#e8f3f4',
  waterIconBg: '#c8e4e6',
  waterText: '#287b82',
  protein: '#efb16d',
  carb: '#93c2a6',
  fat: '#d7d08d'
};

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function renderStatusBar(ox, oy) {
  return `
    <!-- Status Bar -->
    <rect x="${ox}" y="${oy}" width="${W}" height="31" fill="${COLORS.cream}"/>
    <text x="${ox + 24}" y="${oy + 20}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">9:41</text>
    <text x="${ox + W - 24}" y="${oy + 20}" text-anchor="end" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="${COLORS.ink}">● ◒ 100%</text>
  `;
}

function renderAppHeader(ox, oy, title, hasBack = false, action = null) {
  const hy = oy + 31;
  let leftSlot = '';
  if (hasBack) {
    leftSlot = `
      <circle cx="${ox + 35}" cy="${hy + 29}" r="17" fill="none"/>
      <text x="${ox + 28}" y="${hy + 35}" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="${COLORS.green900}">←</text>
    `;
  } else {
    leftSlot = `
      <rect x="${ox + 18}" y="${hy + 15}" width="28" height="28" rx="9" fill="${COLORS.green900}"/>
      <text x="${ox + 32}" y="${hy + 34}" text-anchor="middle" font-size="14">🌱</text>
      <text x="${ox + 52}" y="${hy + 35}" font-family="Inter, sans-serif" font-size="16" font-weight="800" fill="${COLORS.green900}">NutriDaily</text>
    `;
  }

  let rightSlot = '';
  if (action === 'avatar') {
    rightSlot = `
      <circle cx="${ox + W - 36}" cy="${hy + 29}" r="18" fill="${COLORS.green100}"/>
      <text x="${ox + W - 36}" y="${hy + 33}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="${COLORS.green900}">AN</text>
    `;
  } else if (action === 'plus') {
    rightSlot = `
      <circle cx="${ox + W - 36}" cy="${hy + 29}" r="17" fill="${COLORS.green100}"/>
      <text x="${ox + W - 36}" y="${hy + 35}" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="${COLORS.green900}">+</text>
    `;
  } else if (action === 'trash') {
    rightSlot = `
      <circle cx="${ox + W - 36}" cy="${hy + 29}" r="17" fill="${COLORS.warm}"/>
      <text x="${ox + W - 36}" y="${hy + 35}" text-anchor="middle" font-size="14">🗑</text>
    `;
  }

  return `
    <!-- Header -->
    <rect x="${ox}" y="${hy}" width="${W}" height="58" fill="${COLORS.cream}"/>
    <line x1="${ox}" y1="${hy + 58}" x2="${ox + W}" y2="${hy + 58}" stroke="${COLORS.line}" stroke-width="1"/>
    ${leftSlot}
    <text x="${ox + W / 2}" y="${hy + 35}" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="${COLORS.ink}">${escapeXml(title)}</text>
    ${rightSlot}
  `;
}

function renderBottomNav(ox, oy, activeKey) {
  const ny = oy + H - 77;
  const items = [
    { key: 'today', label: 'Hôm nay', icon: '⌂' },
    { key: 'diary', label: 'Nhật ký', icon: '📖' },
    { key: 'planner', label: 'Thực đơn', icon: '📅' },
    { key: 'progress', label: 'Tiến độ', icon: '📊' },
    { key: 'profile', label: 'Cá nhân', icon: '👤' },
  ];

  const itemW = W / items.length;
  const itemElements = items.map((item, i) => {
    const ix = ox + i * itemW + itemW / 2;
    const isActive = item.key === activeKey;
    const color = isActive ? COLORS.green800 : COLORS.muted;
    const fontW = isActive ? '700' : '500';
    return `
      <text x="${ix}" y="${ny + 32}" text-anchor="middle" font-size="18" fill="${color}">${item.icon}</text>
      <text x="${ix}" y="${ny + 50}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="${fontW}" fill="${color}">${item.label}</text>
    `;
  }).join('');

  return `
    <!-- Bottom Nav -->
    <rect x="${ox}" y="${ny}" width="${W}" height="77" fill="${COLORS.white}"/>
    <line x1="${ox}" y1="${ny}" x2="${ox + W}" y2="${ny}" stroke="${COLORS.line}" stroke-width="1"/>
    ${itemElements}
  `;
}

// -------------------------------------------------------------
// INDIVIDUAL SCREENS
// -------------------------------------------------------------

function renderWelcome(ox, oy) {
  return `
    <g id="Screen_01_Welcome">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}

      <!-- Hero Art Banner -->
      <g transform="translate(${ox}, ${oy + 31})">
        <rect width="${W}" height="315" fill="${COLORS.green900}"/>
        <circle cx="280" cy="115" r="75" fill="#f2b66f" opacity="0.9"/>
        <circle cx="170" cy="170" r="90" fill="#fffdf6" stroke="#eeeae0" stroke-width="16"/>
        <text x="170" y="195" text-anchor="middle" font-size="52">🍃</text>
        <rect x="50" y="70" width="8" height="8" rx="2" fill="${COLORS.orangeSoft}" transform="rotate(45 54 74)"/>
        <rect x="340" y="230" width="8" height="8" rx="2" fill="${COLORS.orangeSoft}" transform="rotate(45 344 234)"/>
      </g>

      <!-- Welcome Body -->
      <g transform="translate(${ox + 20}, ${oy + 375})">
        <!-- Logo -->
        <rect width="32" height="32" rx="10" fill="${COLORS.green900}"/>
        <text x="16" y="22" text-anchor="middle" font-size="16">🌱</text>
        <text x="42" y="22" font-family="Inter, sans-serif" font-size="18" font-weight="800" fill="${COLORS.green900}">NutriDaily</text>

        <!-- Titles -->
        <text x="0" y="75" font-family="Inter, sans-serif" font-size="28" font-weight="800" fill="${COLORS.green950}">Hiểu bữa ăn,</text>
        <text x="0" y="112" font-family="Inter, sans-serif" font-size="28" font-weight="800" fill="${COLORS.green950}">duy trì thói quen tốt.</text>
        <text x="0" y="150" font-family="Inter, sans-serif" font-size="14" fill="${COLORS.muted}">Theo dõi dinh dưỡng theo cách nhẹ nhàng, đơn giản</text>
        <text x="0" y="172" font-family="Inter, sans-serif" font-size="14" fill="${COLORS.muted}">và phù hợp với nhịp sống của bạn.</text>

        <!-- Buttons -->
        <g transform="translate(0, 260)">
          <!-- Start Button -->
          <rect width="350" height="50" rx="15" fill="${COLORS.green900}"/>
          <text x="175" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="${COLORS.white}">Bắt đầu</text>

          <!-- Explore Button -->
          <rect y="62" width="350" height="50" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="175" y="93" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="${COLORS.green900}">Khám phá bản mẫu</text>
        </g>
      </g>
    </g>
  `;
}

function renderSetup(ox, oy) {
  return `
    <g id="Screen_02_Setup">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Thiết lập mục tiêu", true)}

      <g transform="translate(${ox + 20}, ${oy + 105})">
        <text x="0" y="10" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="${COLORS.green700}">BƯỚC 1 / 1</text>
        <text x="0" y="40" font-family="Inter, sans-serif" font-size="23" font-weight="800" fill="${COLORS.ink}">Mục tiêu của bạn là gì?</text>
        <text x="0" y="65" font-family="Inter, sans-serif" font-size="13" fill="${COLORS.muted}">Chọn điều bạn muốn tập trung. Có thể thay đổi bất cứ lúc nào.</text>

        <!-- Option 1 (Selected) -->
        <g transform="translate(0, 85)">
          <rect width="350" height="60" rx="15" fill="${COLORS.green50}" stroke="${COLORS.green700}" stroke-width="1.5"/>
          <rect x="12" y="10" width="40" height="40" rx="12" fill="${COLORS.green100}"/>
          <text x="32" y="35" text-anchor="middle" font-size="18">🍃</text>
          <text x="64" y="27" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Ăn uống cân bằng</text>
          <text x="64" y="45" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Xây dựng thói quen bền vững</text>
          <circle cx="325" cy="30" r="10" fill="${COLORS.green700}"/>
          <text x="325" y="34" text-anchor="middle" font-size="11" fill="${COLORS.white}">✓</text>
        </g>

        <!-- Option 2 -->
        <g transform="translate(0, 155)">
          <rect width="350" height="60" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <rect x="12" y="10" width="40" height="40" rx="12" fill="${COLORS.warm}"/>
          <text x="32" y="35" text-anchor="middle" font-size="18">🎯</text>
          <text x="64" y="27" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Duy trì cân nặng</text>
          <text x="64" y="45" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Theo sát mức năng lượng mỗi ngày</text>
        </g>

        <!-- Option 3 -->
        <g transform="translate(0, 225)">
          <rect width="350" height="60" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <rect x="12" y="10" width="40" height="40" rx="12" fill="${COLORS.waterBg}"/>
          <text x="32" y="35" text-anchor="middle" font-size="18">📊</text>
          <text x="64" y="27" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Theo dõi dinh dưỡng</text>
          <text x="64" y="45" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Hiểu rõ hơn về bữa ăn</text>
        </g>

        <!-- Input Targets -->
        <text x="0" y="315" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Mục tiêu mỗi ngày</text>
        <rect x="270" y="302" width="80" height="20" rx="10" fill="#fff1e4"/>
        <text x="310" y="316" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="${COLORS.orange}">Minh họa</text>

        <!-- Input 1 -->
        <g transform="translate(0, 330)">
          <rect width="350" height="48" rx="13" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="14" y="29" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${COLORS.muted}">Năng lượng</text>
          <text x="290" y="29" text-anchor="end" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="${COLORS.ink}">2000</text>
          <text x="335" y="29" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.muted}">kcal</text>
        </g>

        <!-- Input 2 -->
        <g transform="translate(0, 388)">
          <rect width="350" height="48" rx="13" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="14" y="29" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${COLORS.muted}">Nước uống</text>
          <text x="290" y="29" text-anchor="end" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="${COLORS.ink}">2000</text>
          <text x="335" y="29" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.muted}">ml</text>
        </g>

        <!-- Action Button -->
        <g transform="translate(0, 520)">
          <rect width="350" height="50" rx="15" fill="${COLORS.green900}"/>
          <text x="175" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">Lưu và tiếp tục</text>
          <text x="175" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="${COLORS.green800}">Bỏ qua, dùng mục tiêu mẫu</text>
        </g>
      </g>
    </g>
  `;
}

function renderToday(ox, oy) {
  return `
    <g id="Screen_03_Today">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Hôm nay", false, "avatar")}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <text x="0" y="10" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="${COLORS.green700}">THỨ NĂM, 19 THÁNG 6</text>
        <text x="0" y="36" font-family="Inter, sans-serif" font-size="24" font-weight="800" fill="${COLORS.ink}">Chào buổi sáng, An</text>
        <text x="0" y="56" font-family="Inter, sans-serif" font-size="13" fill="${COLORS.muted}">Một chút đều đặn mỗi ngày là đủ.</text>

        <!-- Energy Card -->
        <g transform="translate(0, 70)">
          <rect width="354" height="175" rx="20" fill="${COLORS.green900}"/>
          <text x="18" y="28" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.green100}">Năng lượng đã ghi</text>
          <text x="18" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">Còn 1.357 kcal</text>
          <text x="336" y="35" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.green100}">Xem chi tiết ›</text>

          <!-- Circular Ring -->
          <circle cx="75" cy="112" r="48" fill="${COLORS.green800}" stroke="${COLORS.orange}" stroke-width="9"/>
          <text x="75" y="108" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" font-weight="800" fill="${COLORS.white}">643</text>
          <text x="75" y="125" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.green100}">/ 2.000 kcal</text>

          <!-- Macros -->
          <g transform="translate(160, 75)">
            <!-- Protein -->
            <circle cx="8" cy="12" r="4" fill="${COLORS.protein}"/>
            <text x="20" y="16" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.white}">Chất đạm</text>
            <text x="170" y="16" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.white}">51 g</text>

            <!-- Carbs -->
            <circle cx="8" cy="38" r="4" fill="${COLORS.carb}"/>
            <text x="20" y="42" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.white}">Tinh bột</text>
            <text x="170" y="42" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.white}">86 g</text>

            <!-- Fat -->
            <circle cx="8" cy="64" r="4" fill="${COLORS.fat}"/>
            <text x="20" y="68" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.white}">Chất béo</text>
            <text x="170" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.white}">24 g</text>
          </g>
        </g>

        <!-- Meals Section Header -->
        <g transform="translate(0, 265)">
          <text x="0" y="18" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="${COLORS.ink}">Bữa ăn hôm nay</text>
          <text x="0" y="32" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">4 món đã ghi</text>
          <rect x="254" y="2" width="100" height="32" rx="10" fill="${COLORS.green100}"/>
          <text x="304" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.green900}">+ Thêm món</text>
        </g>

        <!-- Meal Rows -->
        <g transform="translate(0, 310)">
          <rect width="354" height="170" rx="18" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          
          <!-- Sáng -->
          <rect x="12" y="8" width="28" height="28" rx="8" fill="${COLORS.warm}"/>
          <text x="26" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#8b603b">S</text>
          <text x="48" y="20" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Sáng</text>
          <text x="48" y="32" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Bánh mì trứng</text>
          <text x="320" y="26" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">343 kcal ›</text>
          <line x1="12" y1="42" x2="342" y2="42" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Trưa -->
          <rect x="12" y="50" width="28" height="28" rx="8" fill="${COLORS.warm}"/>
          <text x="26" y="68" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#8b603b">Tr</text>
          <text x="48" y="62" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Trưa</text>
          <text x="48" y="74" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Ức gà áp chảo, Rau luộc</text>
          <text x="320" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">200 kcal ›</text>
          <line x1="12" y1="84" x2="342" y2="84" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Tối -->
          <rect x="12" y="92" width="28" height="28" rx="8" fill="${COLORS.warm}"/>
          <text x="26" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#8b603b">T</text>
          <text x="48" y="104" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Tối</text>
          <text x="48" y="116" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Chưa ghi món</text>
          <text x="320" y="110" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">0 kcal ›</text>
          <line x1="12" y1="126" x2="342" y2="126" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Phụ -->
          <rect x="12" y="134" width="28" height="28" rx="8" fill="${COLORS.warm}"/>
          <text x="26" y="152" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#8b603b">P</text>
          <text x="48" y="146" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Bữa phụ</text>
          <text x="48" y="158" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Sữa chua</text>
          <text x="320" y="152" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">100 kcal ›</text>
        </g>

        <!-- Water Card -->
        <g transform="translate(0, 495)">
          <rect width="354" height="66" rx="17" fill="${COLORS.waterBg}"/>
          <rect x="12" y="13" width="40" height="40" rx="12" fill="${COLORS.waterIconBg}"/>
          <text x="32" y="38" text-anchor="middle" font-size="18">💧</text>
          <text x="64" y="28" font-family="Inter, sans-serif" font-size="10" fill="#4c6b6d">Nước hôm nay</text>
          <text x="64" y="46" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">1.250 <tspan font-weight="500" font-size="10" fill="${COLORS.muted}">/ 2.000 ml</tspan></text>
          <rect x="270" y="16" width="70" height="34" rx="10" fill="${COLORS.white}"/>
          <text x="305" y="37" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#236d73">+250 ml</text>
        </g>

        <!-- Planner Link -->
        <g transform="translate(0, 575)">
          <text x="8" y="24" font-size="14">📅</text>
          <text x="32" y="24" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.green800}">Xem thực đơn hôm nay</text>
          <text x="344" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.green800}">›</text>
        </g>
      </g>

      ${renderBottomNav(ox, oy, "today")}
    </g>
  `;
}

function renderDiary(ox, oy) {
  return `
    <g id="Screen_04_Diary">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Nhật ký ăn uống", false, "plus")}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Date Bar -->
        <rect width="354" height="42" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
        <text x="20" y="26" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="${COLORS.muted}">‹</text>
        <text x="177" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Hôm nay</text>
        <text x="177" y="34" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">Thứ Năm, 19/06</text>
        <text x="334" y="26" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="700" fill="${COLORS.muted}">›</text>

        <!-- Summary -->
        <g transform="translate(0, 52)">
          <rect width="354" height="64" rx="17" fill="${COLORS.green900}"/>
          <text x="45" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.green100}">Tổng năng lượng</text>
          <text x="45" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="800" fill="${COLORS.white}">643 kcal</text>
          <line x1="177" y1="14" x2="177" y2="50" stroke="${COLORS.white}" stroke-opacity="0.2"/>
          <text x="265" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.green100}">Mục tiêu</text>
          <text x="265" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="800" fill="${COLORS.white}">2.000 kcal</text>
        </g>

        <!-- Sáng -->
        <g transform="translate(0, 130)">
          <text x="0" y="16" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.ink}">Sáng</text>
          <text x="354" y="16" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">343 kcal</text>
          <g transform="translate(0, 24)">
            <rect width="354" height="48" rx="12" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <rect x="8" y="9" width="30" height="30" rx="8" fill="${COLORS.green100}"/>
            <text x="23" y="28" text-anchor="middle" font-size="14">🍃</text>
            <text x="48" y="24" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Bánh mì trứng</text>
            <text x="48" y="38" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 phần</text>
            <text x="340" y="30" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">343 kcal ›</text>
          </g>
        </g>

        <!-- Trưa -->
        <g transform="translate(0, 218)">
          <text x="0" y="16" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.ink}">Trưa</text>
          <text x="354" y="16" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">200 kcal</text>
          <!-- Item 1 -->
          <g transform="translate(0, 24)">
            <rect width="354" height="48" rx="12" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <rect x="8" y="9" width="30" height="30" rx="8" fill="${COLORS.green100}"/>
            <text x="23" y="28" text-anchor="middle" font-size="14">🍗</text>
            <text x="48" y="24" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Ức gà áp chảo</text>
            <text x="48" y="38" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">100 g</text>
            <text x="340" y="30" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">165 kcal ›</text>
          </g>
          <!-- Item 2 -->
          <g transform="translate(0, 78)">
            <rect width="354" height="48" rx="12" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <rect x="8" y="9" width="30" height="30" rx="8" fill="${COLORS.green100}"/>
            <text x="23" y="28" text-anchor="middle" font-size="14">🥦</text>
            <text x="48" y="24" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Rau luộc</text>
            <text x="48" y="38" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">100 g</text>
            <text x="340" y="30" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">35 kcal ›</text>
          </g>
        </g>

        <!-- Button Add Meal -->
        <g transform="translate(0, 500)">
          <rect width="354" height="50" rx="15" fill="${COLORS.green900}"/>
          <text x="177" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">+ Thêm món</text>
        </g>
      </g>

      ${renderBottomNav(ox, oy, "diary")}
    </g>
  `;
}

function renderSearch(ox, oy) {
  return `
    <g id="Screen_05_Search">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Thêm món ăn", true)}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Search bar -->
        <rect width="354" height="48" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
        <text x="16" y="30" font-size="16">🔍</text>
        <text x="44" y="30" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Cơm trắng</text>
        <text x="334" y="30" text-anchor="end" font-size="14" fill="${COLORS.muted}">✕</text>

        <!-- Filter Chips -->
        <g transform="translate(0, 60)">
          <!-- All -->
          <rect width="70" height="34" rx="17" fill="${COLORS.green900}"/>
          <text x="35" y="21" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.white}">Tất cả</text>
          <!-- Recent -->
          <rect x="78" width="76" height="34" rx="17" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="116" y="21" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.ink}">Gần đây</text>
          <!-- Popular -->
          <rect x="162" width="76" height="34" rx="17" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="200" y="21" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.ink}">Phổ biến</text>
        </g>

        <!-- Title -->
        <text x="0" y="118" font-family="Inter, sans-serif" font-size="14" font-weight="800" fill="${COLORS.ink}">Gợi ý cho bạn</text>
        <text x="354" y="118" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">8 món</text>

        <!-- Results -->
        <g transform="translate(0, 130)">
          <rect width="354" height="420" rx="18" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Item 1: Cơm trắng -->
          <rect x="10" y="10" width="38" height="38" rx="10" fill="#dceacb"/>
          <text x="29" y="34" text-anchor="middle" font-size="16">🍚</text>
          <text x="56" y="26" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Cơm trắng</text>
          <text x="56" y="40" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">100 g · 130 kcal</text>
          <rect x="260" y="18" width="56" height="22" rx="7" fill="${COLORS.green50}"/>
          <text x="288" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="${COLORS.green700}">Gần đây</text>
          <text x="338" y="34" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.muted}">›</text>
          <line x1="10" y1="58" x2="344" y2="58" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Item 2: Phở bò -->
          <rect x="10" y="68" width="38" height="38" rx="10" fill="#f3dcc1"/>
          <text x="29" y="92" text-anchor="middle" font-size="16">🍜</text>
          <text x="56" y="84" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Phở bò</text>
          <text x="56" y="98" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 tô · 350 kcal</text>
          <rect x="256" y="76" width="60" height="22" rx="7" fill="${COLORS.green50}"/>
          <text x="286" y="91" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="${COLORS.green700}">Phổ biến</text>
          <text x="338" y="92" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.muted}">›</text>
          <line x1="10" y1="116" x2="344" y2="116" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Item 3: Bánh mì -->
          <rect x="10" y="126" width="38" height="38" rx="10" fill="#ead7ba"/>
          <text x="29" y="150" text-anchor="middle" font-size="16">🥖</text>
          <text x="56" y="142" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Bánh mì</text>
          <text x="56" y="156" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 ổ · 265 kcal</text>
          <rect x="256" y="134" width="60" height="22" rx="7" fill="${COLORS.green50}"/>
          <text x="286" y="149" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="${COLORS.green700}">Phổ biến</text>
          <text x="338" y="150" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.muted}">›</text>
          <line x1="10" y1="174" x2="344" y2="174" stroke="${COLORS.line}" stroke-width="1"/>

          <!-- Item 4: Ức gà áp chảo -->
          <rect x="10" y="184" width="38" height="38" rx="10" fill="#d3e5d8"/>
          <text x="29" y="208" text-anchor="middle" font-size="16">🍗</text>
          <text x="56" y="200" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Ức gà áp chảo</text>
          <text x="56" y="214" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">100 g · 165 kcal</text>
          <rect x="260" y="192" width="56" height="22" rx="7" fill="${COLORS.green50}"/>
          <text x="288" y="207" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="${COLORS.green700}">Gần đây</text>
          <text x="338" y="208" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.muted}">›</text>
        </g>
      </g>
    </g>
  `;
}

function renderFoodDetail(ox, oy) {
  return `
    <g id="Screen_06_FoodDetail">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Chi tiết món", true, "trash")}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Hero Box -->
        <rect width="354" height="130" rx="20" fill="${COLORS.green100}"/>
        <circle cx="177" cy="65" r="38" fill="${COLORS.white}"/>
        <text x="177" y="75" text-anchor="middle" font-size="34">🍚</text>

        <!-- Title -->
        <g transform="translate(0, 145)">
          <text x="0" y="20" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${COLORS.ink}">Cơm trắng</text>
          <text x="0" y="36" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Khẩu phần chuẩn: 100 g</text>
          <text x="354" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="${COLORS.green800}">195 <tspan font-size="12">kcal</tspan></text>
        </g>

        <!-- Macro 3 Cols -->
        <g transform="translate(0, 195)">
          <rect width="354" height="52" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <!-- Col 1 -->
          <text x="59" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Đạm</text>
          <text x="59" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">4.1 g</text>
          <line x1="118" y1="12" x2="118" y2="40" stroke="${COLORS.line}"/>
          <!-- Col 2 -->
          <text x="177" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Tinh bột</text>
          <text x="177" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">42.0 g</text>
          <line x1="236" y1="12" x2="236" y2="40" stroke="${COLORS.line}"/>
          <!-- Col 3 -->
          <text x="295" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">Chất béo</text>
          <text x="295" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">0.5 g</text>
        </g>

        <!-- Stepper -->
        <g transform="translate(0, 265)">
          <text x="0" y="14" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Khẩu phần</text>
          <g transform="translate(0, 22)">
            <rect width="354" height="54" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <!-- Minus -->
            <rect x="4" y="4" width="46" height="46" rx="12" fill="${COLORS.green50}"/>
            <text x="27" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="${COLORS.green800}">−</text>
            <!-- Value -->
            <text x="165" y="34" text-anchor="end" font-family="Inter, sans-serif" font-size="20" font-weight="800" fill="${COLORS.ink}">150</text>
            <text x="175" y="34" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">gram</text>
            <!-- Plus -->
            <rect x="304" y="4" width="46" height="46" rx="12" fill="${COLORS.green50}"/>
            <text x="327" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="${COLORS.green800}">+</text>
          </g>
        </g>

        <!-- Buttons -->
        <g transform="translate(0, 480)">
          <rect width="354" height="50" rx="15" fill="${COLORS.green900}"/>
          <text x="177" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">Thêm vào bữa trưa · 195 kcal</text>
          <text x="177" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.green900}">Hủy</text>
        </g>
      </g>
    </g>
  `;
}

function renderDeleteModal(ox, oy) {
  return `
    <g id="Screen_07_DeleteModal">
      <!-- Underlying dimmed screen -->
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}

      <!-- Dark backdrop overlay -->
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="#0a1813" fill-opacity="0.65"/>

      <!-- Modal Bottom Sheet -->
      <g transform="translate(${ox + 16}, ${oy + H - 280})">
        <rect width="358" height="256" rx="24" fill="${COLORS.white}"/>
        <!-- Danger circle icon -->
        <circle cx="179" cy="45" r="26" fill="#f7e2e0"/>
        <text x="179" y="52" text-anchor="middle" font-size="20">🗑</text>

        <text x="179" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="800" fill="${COLORS.ink}">Xóa món đã ghi?</text>
        <text x="179" y="122" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.muted}">Cơm trắng sẽ bị xóa khỏi nhật ký</text>
        <text x="179" y="138" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="${COLORS.muted}">và tổng năng lượng hôm nay.</text>

        <!-- Danger Button -->
        <g transform="translate(20, 150)">
          <rect width="318" height="46" rx="14" fill="${COLORS.danger}"/>
          <text x="159" y="28" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">Xóa món</text>
        </g>

        <!-- Keep Button -->
        <g transform="translate(20, 204)">
          <rect width="318" height="42" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="159" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.green900}">Giữ lại</text>
        </g>
      </g>
    </g>
  `;
}

function renderPlanner(ox, oy) {
  return `
    <g id="Screen_08_Planner">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Thực đơn", false)}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Week Strip -->
        <g>
          ${[
            { d: "T2", num: "16", active: false },
            { d: "T3", num: "17", active: false },
            { d: "T4", num: "18", active: false },
            { d: "T5", num: "19", active: false },
            { d: "T6", num: "20", active: true },
            { d: "T7", num: "21", active: false },
            { d: "CN", num: "22", active: false },
          ].map((item, i) => {
            const bx = i * 51;
            const bg = item.active ? COLORS.green900 : COLORS.white;
            const fgD = item.active ? COLORS.green100 : COLORS.muted;
            const fgN = item.active ? COLORS.white : COLORS.ink;
            return `
              <rect x="${bx}" width="46" height="54" rx="12" fill="${bg}" ${!item.active ? `stroke="${COLORS.line}" stroke-width="1"` : ''}/>
              <text x="${bx + 23}" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${fgD}">${item.d}</text>
              <text x="${bx + 23}" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${fgN}">${item.num}</text>
            `;
          }).join('')}
        </g>

        <!-- Intro -->
        <g transform="translate(0, 72)">
          <text x="0" y="10" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="${COLORS.green700}">THỨ SÁU, 20/06</text>
          <text x="0" y="32" font-family="Inter, sans-serif" font-size="20" font-weight="800" fill="${COLORS.ink}">Kế hoạch ngày mai</text>
          <text x="354" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">Dự kiến 1.820 kcal</text>
        </g>

        <!-- Plan Cards -->
        <g transform="translate(0, 120)">
          <!-- Card 1: Sáng -->
          <g>
            <rect width="354" height="66" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">Bữa sáng</text>
            <text x="340" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.green700}">Đã lên kế hoạch</text>
            <text x="14" y="48" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Yến mạch chuối</text>
            <text x="340" y="48" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">410 kcal</text>
          </g>

          <!-- Card 2: Trưa (With Swap button) -->
          <g transform="translate(0, 78)">
            <rect width="354" height="106" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">Bữa trưa</text>
            <text x="340" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.green700}">Đã lên kế hoạch</text>
            <text x="14" y="48" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Cơm gà rau củ</text>
            <text x="340" y="48" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">560 kcal</text>
            <!-- Swap Button -->
            <rect x="14" y="62" width="326" height="32" rx="8" fill="${COLORS.green50}"/>
            <text x="177" y="82" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.green800}">🔄 Đổi món bữa trưa</text>
          </g>

          <!-- Card 3: Tối -->
          <g transform="translate(0, 196)">
            <rect width="354" height="66" rx="15" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">Bữa tối</text>
            <text x="340" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.green700}">Đã lên kế hoạch</text>
            <text x="14" y="48" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">Cá hấp và rau củ</text>
            <text x="340" y="48" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">530 kcal</text>
          </g>
        </g>
      </g>

      ${renderBottomNav(ox, oy, "planner")}
    </g>
  `;
}

function renderSwap(ox, oy) {
  return `
    <g id="Screen_09_Swap">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Đổi món bữa trưa", true)}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Current Dish -->
        <rect width="354" height="64" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
        <text x="14" y="24" font-family="Inter, sans-serif" font-size="9" font-weight="800" fill="${COLORS.muted}">MÓN HIỆN TẠI</text>
        <text x="14" y="46" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Cơm gà rau củ · 560 kcal</text>

        <!-- Swap List Title -->
        <text x="0" y="98" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="${COLORS.ink}">Chọn món thay thế</text>

        <!-- Items -->
        <g transform="translate(0, 112)">
          <!-- Option 1 (Selected) -->
          <rect width="354" height="54" rx="14" fill="${COLORS.green50}" stroke="${COLORS.green700}" stroke-width="1.5"/>
          <text x="14" y="24" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Bún thịt nướng</text>
          <text x="14" y="40" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 tô · 520 kcal</text>
          <circle cx="325" cy="27" r="10" fill="${COLORS.green700}"/>
          <text x="325" y="31" text-anchor="middle" font-size="11" fill="${COLORS.white}">✓</text>

          <!-- Option 2 -->
          <g transform="translate(0, 64)">
            <rect width="354" height="54" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Cơm cá kho</text>
            <text x="14" y="40" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 phần · 540 kcal</text>
          </g>

          <!-- Option 3 -->
          <g transform="translate(0, 128)">
            <rect width="354" height="54" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Phở bò</text>
            <text x="14" y="40" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">1 tô · 350 kcal</text>
          </g>
        </g>

        <!-- Buttons -->
        <g transform="translate(0, 480)">
          <rect width="354" height="50" rx="15" fill="${COLORS.green900}"/>
          <text x="177" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.white}">Xác nhận đổi món</text>
          <text x="177" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.green900}">Hủy</text>
        </g>
      </g>
    </g>
  `;
}

function renderProgress(ox, oy) {
  return `
    <g id="Screen_10_Progress">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Tiến độ", false)}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Chart Card -->
        <rect width="354" height="210" rx="18" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
        <text x="16" y="26" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">Năng lượng đã ghi</text>
        <text x="16" y="44" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Trung bình 1.625 kcal</text>
        <text x="338" y="35" text-anchor="end" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">kcal</text>

        <!-- Bars -->
        <g transform="translate(16, 60)">
          ${[
            { d: "T2", h: 70, a: false },
            { d: "T3", h: 88, a: false },
            { d: "T4", h: 10, a: false },
            { d: "T5", h: 80, a: true },
            { d: "T6", h: 76, a: false },
            { d: "T7", h: 10, a: false },
            { d: "CN", h: 10, a: false },
          ].map((bar, i) => {
            const bx = i * 46;
            const barBg = bar.a ? COLORS.green700 : '#a6c9b3';
            const barW = bar.a ? 18 : 14;
            const by = 100 - bar.h;
            return `
              <rect x="${bx + 10}" y="${by}" width="${barW}" height="${bar.h}" rx="4" fill="${barBg}"/>
              <text x="${bx + 17}" y="118" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="${COLORS.muted}">${bar.d}</text>
            `;
          }).join('')}
        </g>
        <text x="16" y="196" font-family="Inter, sans-serif" font-size="10" fill="${COLORS.muted}">Bạn đã ghi nhật ký 4/7 ngày trong tuần.</text>

        <!-- Stats List -->
        <g transform="translate(0, 230)">
          <text x="0" y="18" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="${COLORS.ink}">Chi tiết Thứ Năm</text>
          <g transform="translate(0, 30)">
            <rect width="354" height="110" rx="16" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
            
            <text x="14" y="24" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Năng lượng hôm nay</text>
            <text x="340" y="24" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">643 kcal</text>
            <line x1="14" y1="36" x2="340" y2="36" stroke="${COLORS.line}"/>

            <text x="14" y="60" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Nước uống hôm nay</text>
            <text x="340" y="60" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">1.250 ml</text>
            <line x1="14" y1="72" x2="340" y2="72" stroke="${COLORS.line}"/>

            <text x="14" y="96" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Món đã ghi</text>
            <text x="340" y="96" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="${COLORS.ink}">4 món</text>
          </g>
        </g>
      </g>

      ${renderBottomNav(ox, oy, "progress")}
    </g>
  `;
}

function renderProfile(ox, oy) {
  return `
    <g id="Screen_11_Profile">
      <rect x="${ox}" y="${oy}" width="${W}" height="${H}" rx="42" fill="${COLORS.cream}" stroke="${COLORS.green950}" stroke-width="7"/>
      ${renderStatusBar(ox, oy)}
      ${renderAppHeader(ox, oy, "Cá nhân", false)}

      <g transform="translate(${ox + 18}, ${oy + 100})">
        <!-- Avatar & Name -->
        <circle cx="28" cy="28" r="28" fill="${COLORS.green100}"/>
        <text x="28" y="34" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="800" fill="${COLORS.green900}">AN</text>
        <text x="70" y="24" font-family="Inter, sans-serif" font-size="18" font-weight="800" fill="${COLORS.ink}">An Nguyễn</text>
        <text x="70" y="42" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Tài khoản dùng thử</text>

        <!-- Goal settings -->
        <g transform="translate(0, 75)">
          <rect width="354" height="175" rx="18" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          <text x="14" y="26" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${COLORS.ink}">Mục tiêu mỗi ngày</text>

          <!-- Row 1 -->
          <rect x="14" y="40" width="326" height="40" rx="10" fill="${COLORS.cream}"/>
          <text x="28" y="65" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Năng lượng</text>
          <text x="326" y="65" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">2.000 kcal</text>

          <!-- Row 2 -->
          <rect x="14" y="88" width="326" height="40" rx="10" fill="${COLORS.cream}"/>
          <text x="28" y="113" font-family="Inter, sans-serif" font-size="11" fill="${COLORS.muted}">Nước uống</text>
          <text x="326" y="113" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.ink}">2.000 ml</text>

          <!-- Button -->
          <rect x="14" y="136" width="326" height="32" rx="8" fill="${COLORS.green900}"/>
          <text x="177" y="157" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${COLORS.white}">Lưu thay đổi</text>
        </g>

        <!-- Settings List -->
        <g transform="translate(0, 270)">
          <rect width="354" height="88" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1"/>
          
          <text x="16" y="28" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${COLORS.ink}">Thông tin ứng dụng</text>
          <text x="338" y="28" text-anchor="end" font-family="Inter, sans-serif" font-size="14" fill="${COLORS.muted}">›</text>
          <line x1="16" y1="44" x2="338" y2="44" stroke="${COLORS.line}"/>

          <text x="16" y="72" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${COLORS.ink}">Đặt lại dữ liệu mẫu</text>
          <text x="338" y="72" text-anchor="end" font-family="Inter, sans-serif" font-size="14" fill="${COLORS.muted}">›</text>
        </g>
      </g>

      ${renderBottomNav(ox, oy, "profile")}
    </g>
  `;
}

// -------------------------------------------------------------
// MAIN SVG BUILDER
// -------------------------------------------------------------
const TOTAL_W = 6 * (W + GAP_X) + 50;
const TOTAL_H = 2 * (H + GAP_Y) + 50;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${TOTAL_W}" height="${TOTAL_H}" viewBox="0 0 ${TOTAL_W} ${TOTAL_H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap');
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    </style>
  </defs>

  <!-- Canvas Background -->
  <rect width="${TOTAL_W}" height="${TOTAL_H}" fill="#e8ebe9"/>

  <!-- ROW 1 (y = 50) -->
  ${renderWelcome(50 + 0 * (W + GAP_X), 50)}
  ${renderSetup(50 + 1 * (W + GAP_X), 50)}
  ${renderToday(50 + 2 * (W + GAP_X), 50)}
  ${renderDiary(50 + 3 * (W + GAP_X), 50)}
  ${renderSearch(50 + 4 * (W + GAP_X), 50)}
  ${renderFoodDetail(50 + 5 * (W + GAP_X), 50)}

  <!-- ROW 2 (y = 964) -->
  ${renderDeleteModal(50 + 0 * (W + GAP_X), 50 + H + GAP_Y)}
  ${renderPlanner(50 + 1 * (W + GAP_X), 50 + H + GAP_Y)}
  ${renderSwap(50 + 2 * (W + GAP_X), 50 + H + GAP_Y)}
  ${renderProgress(50 + 3 * (W + GAP_X), 50 + H + GAP_Y)}
  ${renderProfile(50 + 4 * (W + GAP_X), 50 + H + GAP_Y)}
</svg>
`;

const outputPath = path.resolve('figma-plugin', 'nutridaily_figma_screens.svg');
fs.writeFileSync(outputPath, svg.trim(), 'utf-8');
console.log('SVG successfully created at:', outputPath);

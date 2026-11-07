// Small date helpers working on ISO "YYYY-MM-DD" strings (local, no timezone math).

const WEEKDAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const WEEKDAY_LONG = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, n: number) {
  const date = toDate(iso);
  date.setDate(date.getDate() + n);
  return toIso(date);
}

export function weekdayShort(iso: string) {
  return WEEKDAY_SHORT[toDate(iso).getDay()];
}

export function weekdayLong(iso: string) {
  return WEEKDAY_LONG[toDate(iso).getDay()];
}

export function dayNumber(iso: string) {
  return String(toDate(iso).getDate());
}

/** "Thứ Năm, 19/06" */
export function longLabel(iso: string) {
  const d = toDate(iso);
  return `${WEEKDAY_LONG[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}`;
}

/** "19/06" */
export function shortDate(iso: string) {
  const d = toDate(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** "THỨ NĂM, 19 THÁNG 6" */
export function overline(iso: string) {
  const d = toDate(iso);
  return `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}`.toUpperCase();
}

export function formatPrice(k: number) {
  return `${k.toLocaleString("vi-VN")}k`;
}

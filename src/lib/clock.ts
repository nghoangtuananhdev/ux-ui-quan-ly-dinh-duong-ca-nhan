import { useEffect, useState } from "react";
import { MealLabel } from "../data/foods";

export function currentHour() {
  return new Date().getHours();
}

export function mealForHour(hour: number): MealLabel {
  if (hour >= 5 && hour < 10) return "Sáng";
  if (hour >= 10 && hour < 14) return "Trưa";
  if (hour >= 17 && hour < 21) return "Tối";
  return "Bữa phụ";
}

export function greetingForHour(hour: number) {
  if (hour >= 5 && hour < 11) return "Chào buổi sáng";
  if (hour >= 11 && hour < 14) return "Chào buổi trưa";
  if (hour >= 14 && hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

/** Giờ hiện tại của thiết bị, cập nhật mỗi phút. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  const h = now.getHours();
  return { now, hour: h, meal: mealForHour(h), greeting: greetingForHour(h) };
}

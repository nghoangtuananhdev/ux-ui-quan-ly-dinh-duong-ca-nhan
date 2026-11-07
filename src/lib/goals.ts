/** Validation shared by Setup and Profile (UX-04, SAF-01). */
export function validateGoals(kcalRaw: string, waterRaw: string) {
  const kcal = Number(kcalRaw);
  const water = Number(waterRaw);
  const errors: { kcal?: string; water?: string } = {};
  if (!kcalRaw.trim() || !Number.isFinite(kcal) || kcal < 800 || kcal > 6000) {
    errors.kcal = "Nhập mức năng lượng từ 800 đến 6.000 kcal.";
  }
  if (!waterRaw.trim() || !Number.isFinite(water) || water < 500 || water > 6000) {
    errors.water = "Nhập lượng nước từ 500 đến 6.000 ml.";
  }
  // Soft, neutral safety hint: still allowed to save.
  const hint =
    !errors.kcal && (kcal < 1200 || kcal > 4000)
      ? "Mức này khác nhiều so với thông thường. Nếu bạn có nhu cầu đặc biệt, nên hỏi ý kiến chuyên gia dinh dưỡng."
      : undefined;
  return { kcal: Math.round(kcal), water: Math.round(water), errors, hint, ok: !errors.kcal && !errors.water };
}

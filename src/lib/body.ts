import { Food, MealLabel, nutritionFor } from "../data/foods";

export type Sex = "female" | "male" | "unspecified";
export type Activity = "low" | "moderate" | "high";

export type Body = {
  heightCm: number;
  weightKg: number;
  age: number;
  sex: Sex;
  activity: Activity;
};

export type BmiBand = "low" | "normal" | "high" | "veryHigh";

export function bmiOf(body: Pick<Body, "heightCm" | "weightKg">) {
  const m = body.heightCm / 100;
  return Number((body.weightKg / (m * m)).toFixed(1));
}

/**
 * Ngưỡng BMI cho người châu Á (WHO 2004): < 18,5 · 18,5–22,9 · 23–24,9 · ≥ 25.
 * Nhãn dùng ngôn ngữ trung tính — BMI chỉ là một chỉ số tham khảo, không phải chẩn đoán.
 */
export function bmiBand(bmi: number): BmiBand {
  if (bmi < 18.5) return "low";
  if (bmi < 23) return "normal";
  if (bmi < 25) return "high";
  return "veryHigh";
}

export const BMI_LABEL: Record<BmiBand, string> = {
  low: "Thấp hơn khoảng khuyến nghị",
  normal: "Trong khoảng khuyến nghị",
  high: "Cao hơn khoảng khuyến nghị một chút",
  veryHigh: "Cao hơn khoảng khuyến nghị",
};

export const BMI_HINT: Record<BmiBand, string> = {
  low: "Gợi ý ưu tiên món đủ năng lượng và giàu đạm để bữa ăn no lâu hơn.",
  normal: "Gợi ý ưu tiên món cân bằng để duy trì thói quen hiện tại.",
  high: "Gợi ý ưu tiên món nhiều đạm, nhiều rau, ít dầu mỡ — vẫn đủ no.",
  veryHigh: "Gợi ý ưu tiên món nhiều đạm, nhiều rau, ít dầu mỡ — vẫn đủ no.",
};

const ACTIVITY_FACTOR: Record<Activity, number> = { low: 1.375, moderate: 1.55, high: 1.725 };

export const ACTIVITY_LABEL: Record<Activity, string> = {
  low: "Ít vận động",
  moderate: "Vừa phải",
  high: "Nhiều",
};

/**
 * Mức năng lượng tham khảo (Mifflin–St Jeor × hệ số vận động), làm tròn 50 kcal.
 * Với BMI ngoài khoảng khuyến nghị chỉ điều chỉnh nhẹ ±10%, giới hạn 1.400–3.500 kcal (SAF-01).
 */
export function suggestedKcal(body: Body) {
  const sexAdj = body.sex === "male" ? 5 : body.sex === "female" ? -161 : -78;
  const bmr = 10 * body.weightKg + 6.25 * body.heightCm - 5 * body.age + sexAdj;
  let kcal = bmr * ACTIVITY_FACTOR[body.activity];
  const band = bmiBand(bmiOf(body));
  if (band === "low") kcal *= 1.1;
  if (band === "veryHigh") kcal *= 0.9;
  return Math.min(3500, Math.max(1400, Math.round(kcal / 50) * 50));
}

export function validateBody(raw: { height: string; weight: string; age: string }) {
  const h = Number(raw.height);
  const w = Number(raw.weight);
  const a = Number(raw.age);
  const errors: { height?: string; weight?: string; age?: string } = {};
  if (!raw.height.trim() || !(h >= 120 && h <= 230)) errors.height = "Nhập chiều cao từ 120 đến 230 cm.";
  if (!raw.weight.trim() || !(w >= 30 && w <= 250)) errors.weight = "Nhập cân nặng từ 30 đến 250 kg.";
  if (!raw.age.trim() || !(a >= 15 && a <= 80)) errors.age = "Nhập tuổi từ 15 đến 80.";
  return { h, w, a: Math.round(a), errors, ok: !errors.height && !errors.weight && !errors.age };
}

/**
 * Xếp hạng món cho một bữa dựa trên: năng lượng còn lại của bữa đó và nhóm BMI.
 * Trả về điểm thấp = phù hợp hơn, kèm lý do ngắn để hiển thị cho người dùng.
 */
export function rankForMeal(
  foods: Food[],
  meal: MealLabel,
  opts: { remainingKcal: number; band: BmiBand | null; kcalGoal: number },
) {
  const share: Record<MealLabel, number> = { Sáng: 0.25, Trưa: 0.35, Tối: 0.3, "Bữa phụ": 0.1 };
  const target = Math.max(80, Math.min(opts.remainingKcal, opts.kcalGoal * share[meal]));
  return foods
    .filter((f) => f.slots.includes(meal) && !f.side && f.kind !== "custom")
    .map((f) => {
      const n = nutritionFor(f, f.servingGrams);
      const proteinRatio = (n.protein * 4) / Math.max(n.kcal, 1); // tỉ lệ năng lượng từ đạm
      const fatRatio = (n.fat * 9) / Math.max(n.kcal, 1);
      let score = Math.abs(n.kcal - target) / target;
      let reason = "Vừa với năng lượng còn lại";
      if (opts.band === "high" || opts.band === "veryHigh") {
        score -= proteinRatio * 1.2;
        score += fatRatio * 0.8;
        if (proteinRatio >= 0.22) reason = "Nhiều đạm, giúp no lâu";
      } else if (opts.band === "low") {
        score -= proteinRatio * 0.8;
        if (n.kcal >= target) reason = "Đủ năng lượng cho bữa này";
      } else if (proteinRatio >= 0.22) {
        reason = "Cân bằng, nhiều đạm";
      }
      return { food: f, score, reason };
    })
    .sort((a, b) => a.score - b.score);
}

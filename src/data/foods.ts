export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type MealLabel = "Sáng" | "Trưa" | "Tối" | "Bữa phụ";

export const MEALS: MealLabel[] = ["Sáng", "Trưa", "Tối", "Bữa phụ"];

export const TODAY = "2025-06-19"; // Thứ Năm, 19/06/2025

export type PortionSize = "small" | "medium" | "large";

export const PORTION_FACTORS: Record<PortionSize, number> = {
  small: 0.7,
  medium: 1,
  large: 1.4,
};

export const PORTION_LABELS: Record<PortionSize, string> = {
  small: "Nhỏ",
  medium: "Vừa",
  large: "Lớn",
};

/** Things a user can choose to exclude when building a meal plan. */
export type Exclusion = "seafood" | "beef" | "pork" | "spicy" | "dairy";

export const EXCLUSION_LABELS: Record<Exclusion, string> = {
  seafood: "Hải sản, cá",
  beef: "Thịt bò",
  pork: "Thịt heo",
  spicy: "Đồ cay",
  dairy: "Sữa",
};

export type FoodUnit = {
  id: string;
  label: string;
  grams: number;
};

export type Food = {
  id: string;
  name: string;
  portion: string; // standard portion label shown in lists, e.g. "1 đĩa (350 g)"
  servingLabel: string; // "1 đĩa", "1 tô", "100 g"
  servingGrams: number; // grams for the medium ("Vừa") portion
  kcal: number; // per 100 g
  protein: number; // per 100 g
  carbs: number;
  fat: number;
  price: number; // giá tham khảo cho khẩu phần vừa, nghìn đồng
  slots: MealLabel[]; // bữa phù hợp để gợi ý thực đơn
  excludes?: Exclusion[];
  homeCook?: boolean;
  side?: boolean; // món ăn kèm/thành phần (cơm trắng, rau luộc…): ghi được, nhưng không gợi ý thay cả bữa
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  category?: "starch" | "protein" | "veg" | "fruit" | "dairy" | "drink" | "dish";
  tag: "Gần đây" | "Phổ biến" | "Tự đặt" | string;
  kind?: "base" | "custom";
  basedOn?: string; // custom foods: id of the food the estimate was borrowed from
  popular?: boolean;
};

export type LogEntry = {
  id: number;
  date: string;
  meal: MealLabel;
  foodId: string;
  name: string;
  portion: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  price?: number;
  loggedAt: number;
};

export type WaterLog = {
  id: string;
  date: string;
  ml: number;
  loggedAt: number;
};

export type PlanDish = {
  id: string;
  date: string;
  meal: MealLabel;
  foodId: string;
  name: string;
  portion: string;
  kcal: number;
  price: number;
  status: "planned" | "logged";
  loggedEntryId?: number;
};

/** "bữa sáng", "bữa trưa", "bữa tối", "bữa phụ" */
export function mealPhrase(meal: MealLabel) {
  return meal === "Bữa phụ" ? "bữa phụ" : `bữa ${meal.toLowerCase()}`;
}

/** "Bữa sáng", …, "Bữa phụ" */
export function mealTitle(meal: MealLabel) {
  const p = mealPhrase(meal);
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export const DATA_SOURCE_NOTE =
  "Giá trị dinh dưỡng là ước tính tham khảo cho khẩu phần phổ biến (dựa trên Bảng thành phần thực phẩm Việt Nam và nguồn công khai). Giá là mức tham khảo quanh trường ở TP.HCM. Không dùng cho mục đích y tế.";

/**
 * Build a food from per-serving numbers (easier to sanity check than per-100 g).
 * Nutrition is stored per 100 g so any gram amount can be computed.
 */
function food(
  id: string,
  name: string,
  servingLabel: string,
  servingGrams: number,
  serving: { kcal: number; p: number; c: number; f: number },
  price: number,
  slots: MealLabel[],
  extra: Partial<Food> = {},
): Food {
  const per100 = (v: number) => Number(((v * 100) / servingGrams).toFixed(1));
  const isGramServing = servingLabel.endsWith(" g") || servingLabel.endsWith(" ml");
  return {
    id,
    name,
    servingLabel,
    servingGrams,
    portion: isGramServing ? servingLabel : `${servingLabel} (${servingGrams} g)`,
    kcal: Math.round((serving.kcal * 100) / servingGrams),
    protein: per100(serving.p),
    carbs: per100(serving.c),
    fat: per100(serving.f),
    price,
    slots,
    tag: "Phổ biến",
    kind: "base",
    popular: true,
    category: "dish",
    ...extra,
  };
}

export const defaultFoods: Food[] = [
  // Món căn-tin / quán quen của sinh viên
  food("f_com_tam_suon", "Cơm tấm sườn", "1 đĩa", 350, { kcal: 620, p: 30, c: 75, f: 22 }, 35, ["Sáng", "Trưa", "Tối"], { excludes: ["pork"] }),
  food("f_com_ga_xe", "Cơm gà xé phay", "1 đĩa", 350, { kcal: 560, p: 32, c: 70, f: 15 }, 30, ["Trưa", "Tối"]),
  food("f_com_ga_rau_cu", "Cơm gà rau củ", "1 phần", 350, { kcal: 560, p: 30, c: 72, f: 14 }, 30, ["Trưa", "Tối"]),
  food("f_com_ca_kho", "Cơm cá kho", "1 phần", 300, { kcal: 540, p: 25.5, c: 72, f: 16.5 }, 30, ["Trưa", "Tối"], { excludes: ["seafood"] }),
  food("f_com_chien", "Cơm chiên dương châu", "1 đĩa", 350, { kcal: 650, p: 20, c: 85, f: 24 }, 35, ["Trưa", "Tối"], { excludes: ["pork", "seafood"] }),
  food("f_bun_thit_nuong", "Bún thịt nướng", "1 tô", 350, { kcal: 520, p: 23, c: 64, f: 20 }, 35, ["Trưa", "Tối"], { excludes: ["pork"] }),
  food("f_bun_cha", "Bún chả", "1 phần", 400, { kcal: 550, p: 25, c: 65, f: 20 }, 40, ["Trưa"], { excludes: ["pork"] }),
  food("f_bun_tron_chay", "Bún trộn chay", "1 tô", 350, { kcal: 430, p: 14, c: 70, f: 10 }, 30, ["Trưa", "Tối"]),
  food("f_bun_bo_hue", "Bún bò Huế", "1 tô", 450, { kcal: 480, p: 28, c: 55, f: 15 }, 40, ["Sáng", "Trưa"], { excludes: ["beef", "spicy"] }),
  food("f_pho_bo", "Phở bò", "1 tô", 400, { kcal: 420, p: 26, c: 55, f: 9 }, 40, ["Sáng", "Trưa"], { excludes: ["beef"] }),
  food("f_hu_tieu", "Hủ tiếu Nam Vang", "1 tô", 400, { kcal: 420, p: 22, c: 60, f: 10 }, 35, ["Sáng", "Trưa"], { excludes: ["pork", "seafood"] }),
  food("f_mi_quang", "Mì Quảng", "1 tô", 400, { kcal: 500, p: 25, c: 60, f: 17 }, 40, ["Trưa"], { excludes: ["pork", "seafood"] }),
  food("f_chao_ga", "Cháo gà", "1 tô", 400, { kcal: 300, p: 18, c: 40, f: 7 }, 25, ["Sáng", "Tối"]),
  food("f_banh_cuon", "Bánh cuốn", "1 đĩa", 300, { kcal: 380, p: 14, c: 55, f: 11 }, 25, ["Sáng"], { excludes: ["pork"] }),
  food("f_xoi_ga", "Xôi gà", "1 gói", 200, { kcal: 450, p: 18, c: 65, f: 12 }, 20, ["Sáng"]),
  food("f_banh_mi_thit", "Bánh mì thịt", "1 ổ", 180, { kcal: 450, p: 18, c: 55, f: 17 }, 20, ["Sáng", "Trưa"], { excludes: ["pork"] }),
  food("f_banhmi_trung", "Bánh mì trứng", "1 ổ", 150, { kcal: 343, p: 14.5, c: 45, f: 12 }, 15, ["Sáng"]),
  food("f_banh_mi", "Bánh mì không", "1 ổ", 100, { kcal: 265, p: 9, c: 49, f: 3.2 }, 5, ["Sáng"], { category: "starch" }),
  food("f_banh_bao", "Bánh bao nhân thịt", "1 cái", 150, { kcal: 320, p: 12, c: 45, f: 10 }, 15, ["Sáng", "Bữa phụ"], { excludes: ["pork"] }),
  food("f_goi_cuon", "Gỏi cuốn", "2 cuốn", 150, { kcal: 220, p: 12, c: 30, f: 5 }, 20, ["Bữa phụ", "Trưa"], { excludes: ["seafood", "pork"] }),
  food("f_lau_thai", "Lẩu Thái (phần 1 người)", "1 phần", 600, { kcal: 750, p: 45, c: 50, f: 38 }, 90, ["Tối"], { excludes: ["seafood", "spicy"] }),
  food("f_ca_hap_rau", "Cá hấp và rau củ", "1 phần", 300, { kcal: 380, p: 32, c: 20, f: 18 }, 35, ["Tối"], { excludes: ["seafood"] }),

  // Món tự nấu / nguyên liệu cơ bản
  food("f_com_trang", "Cơm trắng", "100 g", 100, { kcal: 130, p: 2.7, c: 28, f: 0.3 }, 5, ["Trưa", "Tối"], { homeCook: true, side: true, category: "starch", tag: "Gần đây" }),
  food("f_uc_ga", "Ức gà áp chảo", "100 g", 100, { kcal: 165, p: 31, c: 0, f: 3.6 }, 20, ["Trưa", "Tối"], { homeCook: true, side: true, category: "protein", tag: "Gần đây" }),
  food("f_rau_luoc", "Rau luộc", "100 g", 100, { kcal: 35, p: 2, c: 7, f: 0.2 }, 5, ["Trưa", "Tối"], { homeCook: true, side: true, category: "veg" }),
  food("f_dau_hu_sot_ca", "Đậu hũ sốt cà", "1 phần", 200, { kcal: 220, p: 14, c: 10, f: 14 }, 12, ["Trưa", "Tối"], { homeCook: true, side: true }),
  food("f_canh_thit_bam", "Canh rau ngót thịt bằm", "1 tô", 300, { kcal: 120, p: 10, c: 6, f: 6 }, 10, ["Trưa", "Tối"], { homeCook: true, side: true, excludes: ["pork"] }),
  food("f_com_nha_dau_hu", "Cơm nhà: đậu hũ sốt cà, canh rau", "1 phần", 450, { kcal: 520, p: 22, c: 80, f: 12 }, 18, ["Trưa", "Tối"], { homeCook: true }),
  food("f_com_nha_uc_ga", "Cơm nhà: ức gà áp chảo, rau luộc", "1 phần", 400, { kcal: 540, p: 40, c: 70, f: 8 }, 25, ["Trưa", "Tối"], { homeCook: true }),
  food("f_com_nha_trung", "Cơm nhà: trứng chiên, canh rau", "1 phần", 420, { kcal: 560, p: 20, c: 75, f: 18 }, 15, ["Trưa", "Tối"], { homeCook: true }),
  food("f_trung_luoc", "Trứng luộc", "1 quả", 55, { kcal: 78, p: 6.3, c: 0.6, f: 5.3 }, 4, ["Bữa phụ"], { homeCook: true, category: "protein" }),
  food("f_yen_mach_chuoi", "Yến mạch chuối", "1 bát", 250, { kcal: 330, p: 10, c: 60, f: 6 }, 12, ["Sáng"], { homeCook: true, excludes: ["dairy"] }),

  // Bữa phụ & đồ uống
  food("f_chuoi", "Chuối", "1 quả", 110, { kcal: 105, p: 1.3, c: 27, f: 0.3 }, 4, ["Bữa phụ"], { category: "fruit" }),
  food("f_trai_cay", "Trái cây cắt (dưa hấu, ổi)", "1 hộp", 200, { kcal: 90, p: 1.5, c: 21, f: 0.4 }, 15, ["Bữa phụ"], { category: "fruit" }),
  food("f_sua_chua", "Sữa chua", "1 hộp", 100, { kcal: 100, p: 3.5, c: 17, f: 3 }, 7, ["Bữa phụ"], { category: "dairy", excludes: ["dairy"], tag: "Gần đây" }),
  food("f_sua_dau_nanh", "Sữa đậu nành", "1 ly", 250, { kcal: 130, p: 8, c: 12, f: 5 }, 8, ["Bữa phụ"], { category: "drink" }),
  food("f_tra_sua", "Trà sữa trân châu", "1 ly", 500, { kcal: 380, p: 4, c: 65, f: 12 }, 30, ["Bữa phụ"], { category: "drink", excludes: ["dairy"] }),
];

export function findFood(foods: Food[], id: string) {
  return foods.find((f) => f.id === id);
}

/** Nutrition for an amount of a food (grams). */
export function nutritionFor(food: Food, grams: number) {
  const r = grams / 100;
  return {
    kcal: Math.round(food.kcal * r),
    protein: Number((food.protein * r).toFixed(1)),
    carbs: Number((food.carbs * r).toFixed(1)),
    fat: Number((food.fat * r).toFixed(1)),
    price: Math.round((food.price * grams) / food.servingGrams),
  };
}

export function gramsForPortion(food: Food, size: PortionSize) {
  return Math.round(food.servingGrams * PORTION_FACTORS[size]);
}

/** Which preset (if any) an amount of grams corresponds to. */
export function portionForGrams(food: Food, grams: number): PortionSize | null {
  const sizes: PortionSize[] = ["small", "medium", "large"];
  return sizes.find((s) => gramsForPortion(food, s) === grams) ?? null;
}

/** Human portion label: "1 đĩa vừa (350 g)" or "150 g". */
export function portionLabel(food: Food, grams: number) {
  const size = portionForGrams(food, grams);
  const gramServing = food.servingLabel.endsWith(" g") || food.servingLabel.endsWith(" ml");
  if (!size || gramServing) return `${grams} g`;
  return `${food.servingLabel} ${PORTION_LABELS[size].toLowerCase()} (${grams} g)`;
}

export function makeEntry(
  food: Food,
  grams: number,
  meal: MealLabel,
  date: string,
  id: number = Date.now(),
): LogEntry {
  const n = nutritionFor(food, grams);
  return {
    id,
    date,
    meal,
    foodId: food.id,
    name: food.name,
    portion: portionLabel(food, grams),
    grams,
    kcal: n.kcal,
    protein: n.protein,
    carbs: n.carbs,
    fat: n.fat,
    price: n.price,
    loggedAt: id,
  };
}

/* ---------- Lịch sử ban đầu ---------- */

const seedFood = (id: string) => defaultFoods.find((f) => f.id === id)!;
let seedId = 1;
const seed = (date: string, meal: MealLabel, foodId: string, grams?: number) => {
  const f = seedFood(foodId);
  const id = seedId++;
  return { ...makeEntry(f, grams ?? f.servingGrams, meal, date, id), loggedAt: 1750000000000 + id * 1000 };
};

export const initialMealsData: LogEntry[] = [
  // Thứ Hai 16/06
  seed("2025-06-16", "Sáng", "f_xoi_ga"),
  seed("2025-06-16", "Trưa", "f_com_tam_suon"),
  seed("2025-06-16", "Tối", "f_bun_tron_chay"),
  // Thứ Ba 17/06
  seed("2025-06-17", "Sáng", "f_banh_mi_thit"),
  seed("2025-06-17", "Trưa", "f_com_ga_xe"),
  seed("2025-06-17", "Tối", "f_pho_bo"),
  seed("2025-06-17", "Bữa phụ", "f_tra_sua"),
  // Thứ Tư 18/06: không ghi (ngày trống, không bị "phạt")
  // Hôm nay — Thứ Năm 19/06
  seed(TODAY, "Sáng", "f_banhmi_trung"),
  seed(TODAY, "Trưa", "f_uc_ga"),
  seed(TODAY, "Trưa", "f_rau_luoc"),
  seed(TODAY, "Bữa phụ", "f_sua_chua"),
];

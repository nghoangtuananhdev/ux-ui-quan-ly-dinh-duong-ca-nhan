export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type MealLabel = "Sáng" | "Trưa" | "Tối" | "Bữa phụ";

export const TODAY = "2025-06-19"; // Thứ Năm, 19/06/2025

export type FoodUnit = {
  id: string;
  label: string;
  grams: number;
};

export type Food = {
  id: string;
  name: string;
  portion: string; // standard portion label, e.g. "100 g", "1 tô", "1 phần"
  servingLabel: string;
  servingGrams: number;
  kcal: number; // per 100 g
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  category?: "starch" | "protein" | "veg" | "fruit" | "dairy" | "other";
  tag: "Gần đây" | "Phổ biến" | string;
  tags?: string[];
  allergens?: string[];
  kind?: "base" | "custom" | "recipe" | "packaged";
  units?: FoodUnit[];
  defaultUnitId?: string;
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
  name: string;
  portion: string;
  kcal: number;
  status: "planned" | "logged";
};

export const defaultFoods: Food[] = [
  {
    id: "f_banhmi_trung",
    name: "Bánh mì trứng",
    portion: "1 phần (150 g)",
    servingLabel: "1 phần",
    servingGrams: 150,
    kcal: 229, // 150g -> 343 kcal
    protein: 9.7, // 150g -> 14.5 g
    carbs: 41.3, // 150g -> 62.0 g
    fat: 11.5, // 150g -> 17.3 g
    category: "starch",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_com_trang",
    name: "Cơm trắng",
    portion: "100 g",
    servingLabel: "100 g",
    servingGrams: 100,
    kcal: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    category: "starch",
    tag: "Gần đây",
    popular: true,
  },
  {
    id: "f_pho_bo",
    name: "Phở bò",
    portion: "1 tô",
    servingLabel: "1 tô",
    servingGrams: 350,
    kcal: 100, // per 100g, 350g -> 350 kcal
    protein: 6.9,
    carbs: 13.7,
    fat: 2.3,
    category: "other",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_banh_mi",
    name: "Bánh mì",
    portion: "1 ổ",
    servingLabel: "1 ổ",
    servingGrams: 100,
    kcal: 265,
    protein: 9,
    carbs: 49,
    fat: 3.2,
    category: "starch",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_uc_ga",
    name: "Ức gà áp chảo",
    portion: "100 g",
    servingLabel: "100 g",
    servingGrams: 100,
    kcal: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    category: "protein",
    tag: "Gần đây",
    popular: true,
  },
  {
    id: "f_trung_luoc",
    name: "Trứng luộc",
    portion: "1 quả",
    servingLabel: "1 quả",
    servingGrams: 55,
    kcal: 142, // ~78 kcal / quả 55g
    protein: 11.5,
    carbs: 1.1,
    fat: 9.6,
    category: "protein",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_rau_luoc",
    name: "Rau luộc",
    portion: "100 g",
    servingLabel: "100 g",
    servingGrams: 100,
    kcal: 35,
    protein: 2,
    carbs: 7,
    fat: 0.2,
    category: "veg",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_chuoi",
    name: "Chuối",
    portion: "1 quả",
    servingLabel: "1 quả",
    servingGrams: 110,
    kcal: 95, // ~105 kcal / 1 quả
    protein: 1.2,
    carbs: 24.5,
    fat: 0.3,
    category: "fruit",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_sua_chua",
    name: "Sữa chua",
    portion: "1 hộp",
    servingLabel: "1 hộp",
    servingGrams: 100,
    kcal: 100,
    protein: 3.5,
    carbs: 17,
    fat: 3,
    category: "dairy",
    tag: "Gần đây",
    popular: true,
  },
  {
    id: "f_bun_thit_nuong",
    name: "Bún thịt nướng",
    portion: "1 tô",
    servingLabel: "1 tô",
    servingGrams: 350,
    kcal: 149, // ~520 kcal
    protein: 6.5,
    carbs: 18.2,
    fat: 5.8,
    category: "other",
    tag: "Phổ biến",
    popular: true,
  },
  {
    id: "f_com_ca_kho",
    name: "Cơm cá kho",
    portion: "1 phần",
    servingLabel: "1 phần",
    servingGrams: 300,
    kcal: 180, // ~540 kcal
    protein: 8.5,
    carbs: 24,
    fat: 5.5,
    category: "other",
    tag: "Phổ biến",
    popular: true,
  },
];

export const initialMealsData: LogEntry[] = [
  {
    id: 1,
    date: TODAY,
    meal: "Sáng",
    foodId: "f_banhmi_trung",
    name: "Bánh mì trứng",
    portion: "150 g",
    grams: 150,
    kcal: 343,
    protein: 14.5,
    carbs: 62.0,
    fat: 17.3,
    loggedAt: 1750302000000,
  },
  {
    id: 2,
    date: TODAY,
    meal: "Trưa",
    foodId: "f_uc_ga",
    name: "Ức gà áp chảo",
    portion: "100 g",
    grams: 100,
    kcal: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    loggedAt: 1750318000000,
  },
  {
    id: 3,
    date: TODAY,
    meal: "Trưa",
    foodId: "f_rau_luoc",
    name: "Rau luộc",
    portion: "100 g",
    grams: 100,
    kcal: 35,
    protein: 2.0,
    carbs: 7.0,
    fat: 0.2,
    loggedAt: 1750318200000,
  },
  {
    id: 4,
    date: TODAY,
    meal: "Bữa phụ",
    foodId: "f_sua_chua",
    name: "Sữa chua",
    portion: "100 g",
    grams: 100,
    kcal: 100,
    protein: 3.5,
    carbs: 17.0,
    fat: 3.0,
    loggedAt: 1750328000000,
  },
];

export const initialPlanDishes: PlanDish[] = [
  {
    id: "p_1",
    date: "2025-06-20", // Ngày mai (Thứ Sáu)
    meal: "Sáng",
    name: "Yến mạch chuối",
    portion: "1 phần · 410 kcal",
    kcal: 410,
    status: "planned",
  },
  {
    id: "p_2",
    date: "2025-06-20",
    meal: "Trưa",
    name: "Cơm gà rau củ",
    portion: "1 phần · 560 kcal",
    kcal: 560,
    status: "planned",
  },
  {
    id: "p_3",
    date: "2025-06-20",
    meal: "Tối",
    name: "Cá hấp và rau củ",
    portion: "1 phần · 530 kcal",
    kcal: 530,
    status: "planned",
  },
  {
    id: "p_4",
    date: "2025-06-20",
    meal: "Bữa phụ",
    name: "Sữa chua trái cây",
    portion: "1 phần · 320 kcal",
    kcal: 320,
    status: "planned",
  },
];

import { Exclusion, Food, MEALS, MealLabel, PlanDish, nutritionFor, portionLabel } from "../data/foods";
import { addDays } from "./date";

export type PlanGoal = "Ăn uống cân bằng" | "Tiết kiệm tối đa" | "Nhiều đạm hơn";

export type PlanSettings = {
  goal: PlanGoal;
  budgetPerDay: number; // nghìn đồng
  exclusions: Exclusion[];
  homeCook: boolean;
};

export const defaultPlanSettings: PlanSettings = {
  goal: "Ăn uống cân bằng",
  budgetPerDay: 80,
  exclusions: [],
  homeCook: true,
};

const BUDGET_SHARE: Record<MealLabel, number> = { Sáng: 0.22, Trưa: 0.36, Tối: 0.32, "Bữa phụ": 0.1 };
const KCAL_SHARE: Record<MealLabel, number> = { Sáng: 0.25, Trưa: 0.35, Tối: 0.3, "Bữa phụ": 0.1 };

export function allowedFoods(foods: Food[], settings: PlanSettings, meal?: MealLabel) {
  return foods.filter(
    (f) =>
      f.kind !== "custom" &&
      !f.side &&
      (!meal || f.slots.includes(meal)) &&
      !(f.excludes ?? []).some((x) => settings.exclusions.includes(x)) &&
      (settings.homeCook || !f.homeCook),
  );
}

export function dishFromFood(food: Food, date: string, meal: MealLabel, id: string): PlanDish {
  const n = nutritionFor(food, food.servingGrams);
  return {
    id,
    date,
    meal,
    foodId: food.id,
    name: food.name,
    portion: portionLabel(food, food.servingGrams),
    kcal: n.kcal,
    price: n.price,
    status: "planned",
  };
}

/** Score: lower is better. Mixes calorie fit, price and the chosen goal. */
function score(food: Food, meal: MealLabel, settings: PlanSettings, kcalGoal: number) {
  const n = nutritionFor(food, food.servingGrams);
  const kcalTarget = kcalGoal * KCAL_SHARE[meal];
  const kcalFit = Math.abs(n.kcal - kcalTarget) / kcalTarget;
  const priceTarget = settings.budgetPerDay * BUDGET_SHARE[meal];
  const overBudget = Math.max(0, n.price - priceTarget) / Math.max(priceTarget, 1);
  let s = kcalFit + overBudget * 3;
  if (settings.goal === "Tiết kiệm tối đa") s += n.price / 40;
  if (settings.goal === "Nhiều đạm hơn") s -= (n.protein * 4) / Math.max(n.kcal, 1);
  return s;
}

/**
 * Build a simple, varied plan for `days` days. It is deliberately transparent:
 * best-scoring dishes per meal, rotated by day so the week does not repeat,
 * then the snack is dropped to the cheapest option if the day runs over budget.
 */
export function generatePlan(
  foods: Food[],
  settings: PlanSettings,
  kcalGoal: number,
  startDate: string,
  days = 7,
  locked: PlanDish[] = [], // món đã ghi vào nhật ký: giữ nguyên, tính vào ngân sách ngày
): PlanDish[] {
  const plan: PlanDish[] = [];
  for (let d = 0; d < days; d++) {
    const date = addDays(startDate, d);
    const fixed = locked.filter((l) => l.date === date);
    const dayDishes: PlanDish[] = [...fixed];
    for (const meal of MEALS) {
      if (fixed.some((f) => f.meal === meal)) continue;
      const used = new Set(dayDishes.map((x) => x.foodId));
      const ranked = allowedFoods(foods, settings, meal)
        .filter((f) => !used.has(f.id))
        .sort(
        (a, b) => score(a, meal, settings, kcalGoal) - score(b, meal, settings, kcalGoal),
      );
      if (ranked.length === 0) continue;
      const pool = ranked.slice(0, Math.min(6, ranked.length));
      const pick = pool[(d * 5 + MEALS.indexOf(meal) * 2) % pool.length];
      dayDishes.push(dishFromFood(pick, date, meal, `p_${date}_${meal}`));
    }
    // Keep the day within budget where possible: swap the most expensive meal for a cheaper option.
    for (let guard = 0; guard < 8 && dayCost(dayDishes) > settings.budgetPerDay; guard++) {
      const usedIds = new Set(dayDishes.map((x) => x.foodId));
      let replaced = false;
      for (const dish of [...dayDishes].filter((x) => !fixed.includes(x)).sort((a, b) => b.price - a.price)) {
        const need = dayCost(dayDishes) - settings.budgetPerDay;
        const options = allowedFoods(foods, settings, dish.meal)
          .filter((f) => !usedIds.has(f.id) && nutritionFor(f, f.servingGrams).price < dish.price)
          .sort((a, b) => b.price - a.price);
        // Bớt vừa đủ để vào ngân sách; nếu không đủ thì lấy món rẻ nhất.
        const cheaper = options.find((f) => nutritionFor(f, f.servingGrams).price <= dish.price - need) ?? options[options.length - 1];
        if (cheaper) {
          dayDishes[dayDishes.indexOf(dish)] = dishFromFood(cheaper, date, dish.meal, dish.id);
          replaced = true;
          break;
        }
      }
      if (!replaced) break;
    }
    plan.push(...dayDishes.filter((x) => !fixed.includes(x)));
  }
  return plan;
}

export function dayCost(dishes: PlanDish[]) {
  return dishes.reduce((s, d) => s + d.price, 0);
}

export function dayKcal(dishes: PlanDish[]) {
  return dishes.reduce((s, d) => s + d.kcal, 0);
}

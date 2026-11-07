import { useEffect, useMemo, useReducer } from "react";
import {
  TODAY,
  Food,
  LogEntry,
  WaterLog,
  PlanDish,
  MealLabel,
  defaultFoods,
  initialMealsData,
  makeEntry,
  findFood,
} from "../data/foods";
import { PlanSettings, defaultPlanSettings, dishFromFood, generatePlan } from "../lib/plan";
import { Body } from "../lib/body";

export type Goals = {
  kcal: number;
  waterMl: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type ReminderMeal = "Sáng" | "Trưa" | "Tối";

export type Reminders = {
  meal: { enabled: boolean; times: Record<ReminderMeal, string> };
  water: { enabled: boolean; everyHours: 2 | 3 | 4 };
  quietWeekend: boolean;
};

export type NutritionState = {
  meals: LogEntry[];
  waterLogs: WaterLog[];
  goals: Goals;
  selectedGoal: string;
  planDishes: PlanDish[];
  planSettings: PlanSettings;
  customFoods: Food[];
  favorites: string[];
  reminders: Reminders;
  body: Body | null;
};

export const macroGoalsFor = (kcal: number) => ({
  proteinG: Math.round((kcal * 0.2) / 4),
  carbsG: Math.round((kcal * 0.5) / 4),
  fatG: Math.round((kcal * 0.3) / 9),
});

export const defaultGoals: Goals = { kcal: 2000, waterMl: 2000, ...macroGoalsFor(2000) };

// Mặc định TẮT toàn bộ nhắc nhở: người dùng tự quyết định (UX-03, PP5).
export const defaultReminders: Reminders = {
  meal: { enabled: false, times: { Sáng: "07:30", Trưa: "12:15", Tối: "19:00" } },
  water: { enabled: false, everyHours: 3 },
  quietWeekend: false,
};

export const initialWaterLogs: WaterLog[] = [
  { id: "w_16_1", date: "2025-06-16", ml: 1500, loggedAt: 1750050000000 },
  { id: "w_17_1", date: "2025-06-17", ml: 1750, loggedAt: 1750140000000 },
  { id: "w_init_1", date: TODAY, ml: 500, loggedAt: 1750305600000 },
  { id: "w_init_2", date: TODAY, ml: 500, loggedAt: 1750312800000 },
  { id: "w_init_3", date: TODAY, ml: 250, loggedAt: 1750320000000 },
];

export const getInitialState = (): NutritionState => ({
  meals: [...initialMealsData],
  waterLogs: [...initialWaterLogs],
  goals: { ...defaultGoals },
  selectedGoal: "Ăn uống cân bằng",
  planDishes: generatePlan(defaultFoods, defaultPlanSettings, defaultGoals.kcal, TODAY),
  planSettings: { ...defaultPlanSettings },
  customFoods: [],
  favorites: ["f_com_tam_suon", "f_banhmi_trung"],
  reminders: structuredClone(defaultReminders),
  body: null,
});

/** Tài khoản mới: chưa có nhật ký, chỉ có thực đơn gợi ý. */
export const getNewUserState = (): NutritionState => ({
  ...getInitialState(),
  meals: [],
  waterLogs: [],
  favorites: [],
});

/** "Xóa toàn bộ dữ liệu": nothing personal is left, sample foods stay. */
const getEmptyState = (): NutritionState => ({
  ...getInitialState(),
  meals: [],
  waterLogs: [],
  planDishes: [],
  favorites: [],
  customFoods: [],
});

export type Action =
  | { type: "ADD_MEAL"; payload: LogEntry }
  | { type: "UPDATE_MEAL"; payload: { id: number; grams: number; meal?: MealLabel } }
  | { type: "DELETE_MEAL"; payload: { id: number } }
  | { type: "ADD_WATER"; payload: { ml: number; id: string; date?: string } }
  | { type: "REMOVE_LAST_WATER"; payload?: { date?: string } }
  | { type: "REMOVE_WATER_LOG"; payload: { id: string } }
  | { type: "SET_WATER"; payload: { ml: number; id: string; date?: string } }
  | { type: "SET_GOALS"; payload: { kcal?: number; waterMl?: number } }
  | { type: "SET_SELECTED_GOAL"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: { foodId: string } }
  | { type: "ADD_CUSTOM_FOOD"; payload: Food }
  | { type: "UPDATE_CUSTOM_FOOD"; payload: Food }
  | { type: "DELETE_CUSTOM_FOOD"; payload: { id: string } }
  | { type: "SET_REMINDERS"; payload: Reminders }
  | { type: "SET_PLAN"; payload: { dishes: PlanDish[]; settings: PlanSettings } }
  | { type: "SET_PLAN_SETTINGS"; payload: Partial<PlanSettings> }
  | { type: "SWAP_PLAN_DISH"; payload: { id: string; foodId: string } }
  | { type: "LOG_PLAN_DISH"; payload: { id: string; entryId: number } }
  | { type: "UNLOG_PLAN_DISH"; payload: { id: string } }
  | { type: "SET_BODY"; payload: Body }
  | { type: "RESET_DATA" }
  | { type: "CLEAR_ALL" };

const allFoods = (state: NutritionState) => [...defaultFoods, ...state.customFoods];

function nutritionReducer(state: NutritionState, action: Action): NutritionState {
  switch (action.type) {
    case "ADD_MEAL":
      return { ...state, meals: [...state.meals, action.payload] };

    case "UPDATE_MEAL": {
      const { id, grams, meal } = action.payload;
      return {
        ...state,
        meals: state.meals.map((m) => {
          if (m.id !== id) return m;
          const food = findFood(allFoods(state), m.foodId);
          if (!food) return m;
          const updated = makeEntry(food, grams, meal ?? m.meal, m.date, m.id);
          return { ...updated, loggedAt: m.loggedAt };
        }),
      };
    }

    case "DELETE_MEAL":
      return {
        ...state,
        meals: state.meals.filter((m) => m.id !== action.payload.id),
        planDishes: state.planDishes.map((p) =>
          p.loggedEntryId === action.payload.id ? { ...p, status: "planned", loggedEntryId: undefined } : p,
        ),
      };

    case "ADD_WATER": {
      const log: WaterLog = {
        id: action.payload.id,
        date: action.payload.date ?? TODAY,
        ml: action.payload.ml,
        loggedAt: Date.now(),
      };
      return { ...state, waterLogs: [...state.waterLogs, log] };
    }

    case "REMOVE_LAST_WATER": {
      const date = action.payload?.date ?? TODAY;
      const dayLogs = state.waterLogs.filter((l) => l.date === date);
      if (dayLogs.length === 0) return state;
      const last = dayLogs[dayLogs.length - 1];
      return { ...state, waterLogs: state.waterLogs.filter((l) => l.id !== last.id) };
    }

    case "SET_WATER": {
      // Đưa tổng nước trong ngày về đúng mức ml: thêm phần thiếu, hoặc bớt các lần ghi gần nhất.
      const date = action.payload.date ?? TODAY;
      const target = Math.max(0, action.payload.ml);
      let logs = [...state.waterLogs];
      const total = () => logs.filter((l) => l.date === date).reduce((s, l) => s + l.ml, 0);
      while (total() > target) {
        const idx = logs.map((l) => l.date).lastIndexOf(date);
        const over = total() - target;
        if (logs[idx].ml <= over) logs.splice(idx, 1);
        else logs[idx] = { ...logs[idx], ml: logs[idx].ml - over };
      }
      const missing = target - total();
      if (missing > 0) logs.push({ id: action.payload.id, date, ml: missing, loggedAt: Date.now() });
      return { ...state, waterLogs: logs };
    }

    case "REMOVE_WATER_LOG":
      return { ...state, waterLogs: state.waterLogs.filter((l) => l.id !== action.payload.id) };

    case "SET_GOALS": {
      const kcal = action.payload.kcal ?? state.goals.kcal;
      const waterMl = action.payload.waterMl ?? state.goals.waterMl;
      return { ...state, goals: { kcal, waterMl, ...macroGoalsFor(kcal) } };
    }

    case "SET_SELECTED_GOAL":
      return { ...state, selectedGoal: action.payload };

    case "TOGGLE_FAVORITE": {
      const { foodId } = action.payload;
      const has = state.favorites.includes(foodId);
      return {
        ...state,
        favorites: has ? state.favorites.filter((f) => f !== foodId) : [foodId, ...state.favorites],
      };
    }

    case "ADD_CUSTOM_FOOD":
      return { ...state, customFoods: [...state.customFoods, action.payload] };

    case "UPDATE_CUSTOM_FOOD":
      return { ...state, customFoods: state.customFoods.map((f) => (f.id === action.payload.id ? action.payload : f)) };

    case "DELETE_CUSTOM_FOOD":
      return {
        ...state,
        customFoods: state.customFoods.filter((f) => f.id !== action.payload.id),
        favorites: state.favorites.filter((id) => id !== action.payload.id),
        planDishes: state.planDishes.filter((p) => p.foodId !== action.payload.id),
      };

    case "SET_REMINDERS":
      return { ...state, reminders: action.payload };

    case "SET_PLAN": {
      // Keep dishes that were already logged so the diary and plan stay consistent.
      const logged = state.planDishes.filter((p) => p.status === "logged");
      const fresh = action.payload.dishes.filter(
        (d) => !logged.some((l) => l.date === d.date && l.meal === d.meal),
      );
      return { ...state, planDishes: [...logged, ...fresh], planSettings: action.payload.settings };
    }

    case "SET_PLAN_SETTINGS":
      return { ...state, planSettings: { ...state.planSettings, ...action.payload } };

    case "SWAP_PLAN_DISH": {
      const food = findFood(allFoods(state), action.payload.foodId);
      if (!food) return state;
      return {
        ...state,
        planDishes: state.planDishes.map((p) =>
          p.id === action.payload.id ? dishFromFood(food, p.date, p.meal, p.id) : p,
        ),
      };
    }

    case "LOG_PLAN_DISH": {
      const dish = state.planDishes.find((p) => p.id === action.payload.id);
      if (!dish) return state;
      const food = findFood(allFoods(state), dish.foodId);
      if (!food) return state;
      const entry = makeEntry(food, food.servingGrams, dish.meal, dish.date, action.payload.entryId);
      return {
        ...state,
        meals: [...state.meals, entry],
        planDishes: state.planDishes.map((p) =>
          p.id === dish.id ? { ...p, status: "logged", loggedEntryId: entry.id } : p,
        ),
      };
    }

    case "UNLOG_PLAN_DISH": {
      const dish = state.planDishes.find((p) => p.id === action.payload.id);
      if (!dish) return state;
      return {
        ...state,
        meals: state.meals.filter((m) => m.id !== dish.loggedEntryId),
        planDishes: state.planDishes.map((p) =>
          p.id === dish.id ? { ...p, status: "planned", loggedEntryId: undefined } : p,
        ),
      };
    }

    case "SET_BODY":
      return { ...state, body: action.payload };

    case "RESET_DATA":
      return getInitialState();

    case "CLEAR_ALL":
      return getEmptyState();

    default:
      return state;
  }
}

/* ---------- Persistence (dữ liệu chỉ lưu trên thiết bị) ---------- */

const storageKey = (userId: string) => `nutridaily:state:v3:${userId}`;

function loadState(userId: string): NutritionState {
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NutritionState>;
      return { ...getNewUserState(), ...parsed };
    }
  } catch {
    // corrupted or unavailable storage: start fresh
  }
  return getNewUserState();
}

/** Mỗi tài khoản có kho dữ liệu riêng. Component gọi hook nên được gắn key theo userId. */
export function useNutritionStore(userId: string) {
  const [state, dispatch] = useReducer(nutritionReducer, userId, loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(state));
    } catch {
      // ignore: the session still works, it just won't survive a reload
    }
  }, [state, userId]);

  const selectors = useMemo(() => {
    const foods = allFoods(state);
    const dayTotals = (date: string = TODAY) => {
      const day = state.meals.filter((m) => m.date === date);
      const sum = (k: "kcal" | "protein" | "carbs" | "fat") =>
        Number(day.reduce((s, m) => s + (m[k] || 0), 0).toFixed(1));
      return { kcal: Math.round(sum("kcal")), protein: sum("protein"), carbs: sum("carbs"), fat: sum("fat"), count: day.length };
    };
    const water = (date: string = TODAY) =>
      state.waterLogs.filter((l) => l.date === date).reduce((s, l) => s + l.ml, 0);
    const recentFoods = (limit = 5) => {
      const seen: Food[] = [];
      for (const m of [...state.meals].sort((a, b) => b.loggedAt - a.loggedAt)) {
        const f = findFood(foods, m.foodId);
        if (f && !seen.some((s) => s.id === f.id)) seen.push(f);
        if (seen.length >= limit) break;
      }
      return seen;
    };
    const favoriteFoods = () =>
      state.favorites.map((id) => findFood(foods, id)).filter((f): f is Food => Boolean(f));
    return { foods, dayTotals, water, recentFoods, favoriteFoods };
  }, [state]);

  return { state, dispatch, selectors };
}

export default useNutritionStore;

import { useReducer, useMemo } from "react";
import {
  TODAY,
  Food,
  LogEntry,
  WaterLog,
  PlanDish,
  defaultFoods,
  initialMealsData,
  initialPlanDishes,
  MealLabel,
} from "../data/foods";

export type Goals = {
  kcal: number;
  waterMl: number;
  macroMode?: "percent" | "grams";
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  source?: "suggested" | "manual";
};

export type NutritionState = {
  meals: LogEntry[];
  waterLogs: WaterLog[];
  water: number; // cached today water for convenience
  goals: Goals;
  planDishes: PlanDish[];
  foods: Food[];
  selectedGoal: string;
};

export const defaultGoals: Goals = {
  kcal: 2000,
  waterMl: 2000,
  proteinPct: 20,
  carbsPct: 50,
  fatPct: 30,
  proteinG: 100, // 2000 * 0.20 / 4
  carbsG: 250,   // 2000 * 0.50 / 4
  fatG: 67,      // 2000 * 0.30 / 9
  source: "manual",
};

export const initialWaterLogs: WaterLog[] = [
  { id: "w_init_1", date: TODAY, ml: 500, loggedAt: 1750305600000 },
  { id: "w_init_2", date: TODAY, ml: 500, loggedAt: 1750312800000 },
  { id: "w_init_3", date: TODAY, ml: 250, loggedAt: 1750320000000 },
];

export const getInitialState = (): NutritionState => ({
  meals: [...initialMealsData],
  waterLogs: [...initialWaterLogs],
  water: 1250,
  goals: { ...defaultGoals },
  planDishes: [...initialPlanDishes],
  foods: [...defaultFoods],
  selectedGoal: "Ăn uống cân bằng",
});

export type Action =
  | { type: "ADD_MEAL"; payload: LogEntry }
  | { type: "UPDATE_MEAL"; payload: { id: number; grams: number; portion?: string; kcal?: number; meal?: MealLabel } }
  | { type: "DELETE_MEAL"; payload: { id: number } }
  | { type: "RESTORE_MEALS"; payload: LogEntry[] }
  | { type: "ADD_WATER"; payload: { ml: number; date?: string } }
  | { type: "REMOVE_WATER"; payload: { ml: number; date?: string } }
  | { type: "SET_WATER"; payload: { ml: number } }
  | { type: "UNDO_WATER"; payload: { logId: string } }
  | { type: "SET_GOALS"; payload: Partial<Goals> }
  | { type: "SET_SELECTED_GOAL"; payload: string }
  | { type: "UPDATE_PLAN_DISH"; payload: { id: string; name: string; kcal?: number; portion?: string } }
  | { type: "LOG_PLAN_DISH"; payload: { id: string; meal: MealLabel; date?: string } }
  | { type: "RESET_DATA" };

function nutritionReducer(state: NutritionState, action: Action): NutritionState {
  switch (action.type) {
    case "ADD_MEAL":
      return {
        ...state,
        meals: [...state.meals, action.payload],
      };

    case "UPDATE_MEAL": {
      const { id, grams, meal } = action.payload;
      return {
        ...state,
        meals: state.meals.map((m) => {
          if (m.id !== id) return m;
          const food = state.foods.find((f) => f.id === m.foodId) || defaultFoods[0];
          const calculatedKcal = Math.round((food.kcal * grams) / 100);
          const calculatedProtein = Number(((food.protein * grams) / 100).toFixed(1));
          const calculatedCarbs = Number(((food.carbs * grams) / 100).toFixed(1));
          const calculatedFat = Number(((food.fat * grams) / 100).toFixed(1));
          return {
            ...m,
            grams,
            portion: `${grams} g`,
            kcal: calculatedKcal,
            protein: calculatedProtein,
            carbs: calculatedCarbs,
            fat: calculatedFat,
            meal: meal || m.meal,
          };
        }),
      };
    }

    case "DELETE_MEAL":
      return {
        ...state,
        meals: state.meals.filter((m) => m.id !== action.payload.id),
      };

    case "RESTORE_MEALS":
      return {
        ...state,
        meals: action.payload,
      };

    case "ADD_WATER": {
      const date = action.payload.date || TODAY;
      const newLog: WaterLog = {
        id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date,
        ml: action.payload.ml,
        loggedAt: Date.now(),
      };
      const updatedLogs = [...state.waterLogs, newLog];
      const todayTotal = updatedLogs
        .filter((l) => l.date === TODAY)
        .reduce((sum, l) => sum + l.ml, 0);
      return {
        ...state,
        waterLogs: updatedLogs,
        water: todayTotal,
      };
    }

    case "REMOVE_WATER": {
      const date = action.payload.date || TODAY;
      const targetLogs = state.waterLogs.filter((l) => l.date === date);
      if (targetLogs.length === 0) return state;
      const last = targetLogs[targetLogs.length - 1];
      const updatedLogs = state.waterLogs.filter((l) => l.id !== last.id);
      const todayTotal = updatedLogs
        .filter((l) => l.date === TODAY)
        .reduce((sum, l) => sum + l.ml, 0);
      return {
        ...state,
        waterLogs: updatedLogs,
        water: todayTotal,
      };
    }

    case "SET_WATER": {
      return {
        ...state,
        water: action.payload.ml,
      };
    }

    case "UNDO_WATER": {
      const updatedLogs = state.waterLogs.filter((l) => l.id !== action.payload.logId);
      const todayTotal = updatedLogs
        .filter((l) => l.date === TODAY)
        .reduce((sum, l) => sum + l.ml, 0);
      return {
        ...state,
        waterLogs: updatedLogs,
        water: todayTotal,
      };
    }

    case "SET_GOALS": {
      const updatedGoals = { ...state.goals, ...action.payload };
      if (action.payload.kcal && !action.payload.proteinG) {
        updatedGoals.proteinG = Math.round((updatedGoals.kcal * 0.2) / 4);
        updatedGoals.carbsG = Math.round((updatedGoals.kcal * 0.5) / 4);
        updatedGoals.fatG = Math.round((updatedGoals.kcal * 0.3) / 9);
      }
      return {
        ...state,
        goals: updatedGoals,
      };
    }

    case "SET_SELECTED_GOAL":
      return {
        ...state,
        selectedGoal: action.payload,
      };

    case "UPDATE_PLAN_DISH": {
      return {
        ...state,
        planDishes: state.planDishes.map((p) =>
          p.id === action.payload.id
            ? {
                ...p,
                name: action.payload.name,
                kcal: action.payload.kcal ?? p.kcal,
                portion: action.payload.portion ?? p.portion,
              }
            : p
        ),
      };
    }

    case "LOG_PLAN_DISH": {
      const dish = state.planDishes.find((p) => p.id === action.payload.id);
      if (!dish) return state;
      const matchedFood =
        state.foods.find((f) => f.name.toLowerCase() === dish.name.toLowerCase()) ||
        state.foods[0];
      const newEntry: LogEntry = {
        id: Date.now(),
        date: action.payload.date || TODAY,
        meal: action.payload.meal,
        foodId: matchedFood.id,
        name: dish.name,
        portion: dish.portion,
        grams: matchedFood.servingGrams || 100,
        kcal: dish.kcal,
        protein: matchedFood.protein,
        carbs: matchedFood.carbs,
        fat: matchedFood.fat,
        loggedAt: Date.now(),
      };
      return {
        ...state,
        meals: [...state.meals, newEntry],
        planDishes: state.planDishes.map((p) =>
          p.id === dish.id ? { ...p, status: "logged" } : p
        ),
      };
    }

    case "RESET_DATA":
      return getInitialState();

    default:
      return state;
  }
}

export function useNutritionStore() {
  const [state, dispatch] = useReducer(nutritionReducer, null, getInitialState);

  const selectors = useMemo(() => {
    return {
      selectDayTotals: (date: string = TODAY) => {
        const dayMeals = state.meals.filter((m) => m.date === date);
        const kcal = dayMeals.reduce((sum, m) => sum + m.kcal, 0);
        const protein = Number(dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1));
        const carbs = Number(dayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0).toFixed(1));
        const fat = Number(dayMeals.reduce((sum, m) => sum + (m.fat || 0), 0).toFixed(1));
        return { kcal, protein, carbs, fat, count: dayMeals.length };
      },

      selectMealTotals: (date: string = TODAY, meal: MealLabel) => {
        const list = state.meals.filter((m) => m.date === date && m.meal === meal);
        const kcal = list.reduce((sum, m) => sum + m.kcal, 0);
        const protein = Number(list.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1));
        const carbs = Number(list.reduce((sum, m) => sum + (m.carbs || 0), 0).toFixed(1));
        const fat = Number(list.reduce((sum, m) => sum + (m.fat || 0), 0).toFixed(1));
        return { list, kcal, protein, carbs, fat, count: list.length };
      },

      selectWater: (date: string = TODAY) => {
        return state.waterLogs
          .filter((l) => l.date === date)
          .reduce((sum, l) => sum + l.ml, 0);
      },

      selectRecentFoods: (limit: number = 5) => {
        const loggedFoodIds = [...state.meals].reverse().map((m) => m.foodId);
        const recent: Food[] = [];
        for (const fid of loggedFoodIds) {
          const f = state.foods.find((food) => food.id === fid);
          if (f && !recent.some((r) => r.id === f.id)) {
            recent.push(f);
          }
          if (recent.length >= limit) break;
        }
        // Fill up with popular foods if needed
        for (const f of state.foods) {
          if (!recent.some((r) => r.id === f.id)) {
            recent.push(f);
          }
          if (recent.length >= limit) break;
        }
        return recent;
      },
    };
  }, [state]);

  return { state, dispatch, selectors };
}

export default useNutritionStore;

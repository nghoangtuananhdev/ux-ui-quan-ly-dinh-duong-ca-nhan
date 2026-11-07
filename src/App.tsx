import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastProvider, useToast } from "./components/ui/Toast";
import AppLayout from "./components/layout/AppLayout";
import ExplainSheet, { ExplainTopic } from "./components/nutrition/ExplainSheet";
import useNutritionStore, { defaultReminders } from "./state/useNutritionStore";
import { Food, MealLabel, TODAY, findFood, makeEntry, nutritionFor, PlanDish, mealPhrase } from "./data/foods";
import { dayCost, generatePlan } from "./lib/plan";
import { formatPrice } from "./lib/date";
import { useClock } from "./lib/clock";
import { Session, clearNewSignup, isNewSignup, deleteAccount, signOut, useSession } from "./lib/auth";
import AuthScreen from "./screens/AuthScreen";
import { bmiBand, bmiOf, rankForMeal } from "./lib/body";

import WelcomeScreen from "./screens/WelcomeScreen";
import SetupScreen from "./screens/SetupScreen";
import TodayScreen from "./screens/TodayScreen";
import DiaryScreen from "./screens/DiaryScreen";
import FoodSearchScreen from "./screens/FoodSearchScreen";
import FoodDetailScreen from "./screens/FoodDetailScreen";
import CustomFoodScreen from "./screens/CustomFoodScreen";
import PlannerScreen from "./screens/PlannerScreen";
import PlanBuilderScreen from "./screens/PlanBuilderScreen";
import SwapScreen from "./screens/SwapScreen";
import ProgressScreen, { weekSummary } from "./screens/ProgressScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RemindersScreen from "./screens/RemindersScreen";
import PrivacyScreen from "./screens/PrivacyScreen";

type Screen =
  | "welcome"
  | "setup"
  | "today"
  | "diary"
  | "search"
  | "food"
  | "custom"
  | "planner"
  | "planBuilder"
  | "swap"
  | "progress"
  | "profile"
  | "reminders"
  | "privacy";

const SCREENS: Screen[] = [
  "setup", "today", "diary", "search", "food", "custom", "planner",
  "planBuilder", "swap", "progress", "profile", "reminders", "privacy",
];

// Liên kết sâu tới từng màn: http://localhost:8443/#planner
function screenFromHash(): Screen {
  const h = window.location.hash.replace("#", "") as Screen;
  return SCREENS.includes(h) && !["search", "food", "custom", "swap", "welcome"].includes(h) ? h : "today";
}

function AppContent({ session, initialScreen }: { session: Session; initialScreen: Screen }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  useEffect(() => clearNewSignup(), []);
  const { state, dispatch, selectors } = useNutritionStore(session.email);
  const { showToast } = useToast();
  const { meal: nowMeal } = useClock();

  // Context of the "add food" flow
  const [activeMeal, setActiveMeal] = useState<MealLabel>(nowMeal);
  const [activeDate, setActiveDate] = useState(TODAY);
  const [returnTo, setReturnTo] = useState<Screen>("today");
  const [selectedFoodId, setSelectedFoodId] = useState("f_com_trang");
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [detailGrams, setDetailGrams] = useState<number | undefined>(undefined);
  const [customName, setCustomName] = useState("");
  const [editingCustom, setEditingCustom] = useState<Food | null>(null);

  // Planner context
  const [plannerDate, setPlannerDate] = useState(TODAY);
  const [swapDishId, setSwapDishId] = useState<string | null>(null);

  const [explain, setExplain] = useState<ExplainTopic | null>(null);
  const closeExplain = useCallback(() => setExplain(null), []);

  const go = (s: string) => setScreen(s as Screen);

  useEffect(() => {
    document.querySelector(".phone-content")?.scrollTo({ top: 0 });
    window.history.replaceState(null, "", `#${screen}`);
  }, [screen]);

  const foods = selectors.foods;
  const selectedFood = findFood(foods, selectedFoodId) ?? foods[0];
  const water = selectors.water(TODAY);
  const week = weekSummary(selectors.dayTotals, selectors.water);
  const band = state.body ? bmiBand(bmiOf(state.body)) : null;
  const searchCtx = useMemo(
    () => ({ remainingKcal: state.goals.kcal - selectors.dayTotals(activeDate).kcal, band, kcalGoal: state.goals.kcal }),
    [state.goals.kcal, selectors, activeDate, band],
  );
  const todaySuggestions = useMemo(
    () => rankForMeal(foods, nowMeal, { remainingKcal: state.goals.kcal - selectors.dayTotals(TODAY).kcal, band, kcalGoal: state.goals.kcal }).slice(0, 2),
    [foods, nowMeal, state.goals.kcal, selectors, band],
  );

  /* ---------- Food logging ---------- */

  const openSearch = (meal: MealLabel, date: string = TODAY, from: Screen = screen) => {
    setActiveMeal(meal);
    setActiveDate(date);
    setReturnTo(from === "search" || from === "food" ? "today" : from);
    setEditingMealId(null);
    go("search");
  };

  const logFood = (food: Food, grams: number, meal: MealLabel) => {
    const entry = makeEntry(food, grams, meal, activeDate);
    dispatch({ type: "ADD_MEAL", payload: entry });
    showToast({
      text: `Đã ghi ${food.name} vào ${mealPhrase(meal)} · ${entry.kcal} kcal`,
      actionLabel: "Hoàn tác",
      onAction: () => dispatch({ type: "DELETE_MEAL", payload: { id: entry.id } }),
    });
  };

  const handleQuickAdd = (food: Food, meal: MealLabel) => {
    logFood(food, food.servingGrams, meal);
    go(returnTo);
  };

  const handleSaveFoodDetail = (grams: number, meal: MealLabel) => {
    if (editingMealId) {
      dispatch({ type: "UPDATE_MEAL", payload: { id: editingMealId, grams, meal } });
      showToast(`Đã cập nhật ${selectedFood.name} · ${nutritionFor(selectedFood, grams).kcal} kcal`);
      setEditingMealId(null);
      go("diary");
      return;
    }
    logFood(selectedFood, grams, meal);
    go(returnTo);
  };

  const handleEditMeal = (id: number) => {
    const item = state.meals.find((m) => m.id === id);
    if (!item || !findFood(foods, item.foodId)) return;
    setEditingMealId(id);
    setSelectedFoodId(item.foodId);
    setDetailGrams(item.grams);
    setActiveMeal(item.meal);
    setActiveDate(item.date);
    go("food");
  };

  const handleDeleteMeal = () => {
    if (!editingMealId) return;
    const deleted = state.meals.find((m) => m.id === editingMealId);
    dispatch({ type: "DELETE_MEAL", payload: { id: editingMealId } });
    setEditingMealId(null);
    go("diary");
    showToast({
      text: `Đã xóa ${deleted?.name ?? "món"} khỏi nhật ký`,
      actionLabel: deleted ? "Hoàn tác" : undefined,
      onAction: deleted ? () => dispatch({ type: "ADD_MEAL", payload: deleted }) : undefined,
    });
  };

  /* ---------- Water ---------- */

  /** Đặt tổng nước hôm nay (0 → mục tiêu), có hoàn tác. */
  const handleSetWater = (target: number) => {
    const next = Math.min(Math.max(0, target), Math.max(state.goals.waterMl, 1));
    if (next === water) return;
    const prev = water;
    dispatch({ type: "SET_WATER", payload: { ml: next, id: `w_${Date.now()}` } });
    // Chỉ báo khi vừa uống đủ nước; các lần chạm khác im lặng.
    if (next >= state.goals.waterMl && prev < state.goals.waterMl) {
      showToast({
        text: `Chúc mừng! Bạn đã uống đủ ${state.goals.waterMl.toLocaleString("vi-VN")} ml nước hôm nay 🎉`,
      });
    }
  };
  const handleAddWater = (ml: number) => handleSetWater(water + ml);
  const handleRemoveWater = (ml: number) => handleSetWater(water - ml);

  /* ---------- Plan ---------- */

  const handleLogDish = (dish: PlanDish) => {
    const entryId = Date.now();
    dispatch({ type: "LOG_PLAN_DISH", payload: { id: dish.id, entryId } });
    showToast({
      text: `Đã ghi ${dish.name} vào ${mealPhrase(dish.meal)}`,
      actionLabel: "Hoàn tác",
      onAction: () => dispatch({ type: "UNLOG_PLAN_DISH", payload: { id: dish.id } }),
    });
  };

  const swapDish = state.planDishes.find((p) => p.id === swapDishId) ?? null;


  const renderScreen = () => {
    switch (screen) {
      case "setup":
        return (
          <SetupScreen
            initialGoal={state.goals.kcal}
            initialWaterGoal={state.goals.waterMl}
            initialSelectedGoal={state.selectedGoal}
            initialBudget={state.planSettings.budgetPerDay}
            initialBody={state.body}
            userName={session.name}
            onBack={() => go("today")}
            onSave={(kcal, waterGoal, selGoal, habits, body) => {
              if (body) dispatch({ type: "SET_BODY", payload: body });
              dispatch({ type: "SET_GOALS", payload: { kcal, waterMl: waterGoal } });
              dispatch({ type: "SET_SELECTED_GOAL", payload: selGoal });
              if (habits) {
                const settings = { ...state.planSettings, budgetPerDay: habits.budgetPerDay, exclusions: habits.exclusions };
                dispatch({ type: "SET_PLAN", payload: { dishes: generatePlan(foods, settings, kcal, TODAY, 7, state.planDishes.filter((p) => p.status === "logged")), settings } });
                dispatch({
                  type: "SET_REMINDERS",
                  payload: { ...state.reminders, meal: { ...state.reminders.meal, enabled: habits.remindMeals } },
                });
              }
              go("today");
              showToast("Đã lưu thiết lập của bạn");
            }}
            onSkip={() => go("today")}
          />
        );

      case "today":
        return (
          <TodayScreen
            meals={state.meals}
            water={water}
            goals={state.goals}
            weekAvgKcal={week.avgKcal}
            onNavigate={go}
            onAddFoodToMeal={(meal) => openSearch(meal, TODAY, "today")}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
            onSetWater={handleSetWater}
            onExplain={setExplain}
            suggestions={todaySuggestions}
            hasBody={Boolean(state.body)}
            onQuickAddSuggestion={(food) => {
              setActiveDate(TODAY);
              const entry = makeEntry(food, food.servingGrams, nowMeal, TODAY);
              dispatch({ type: "ADD_MEAL", payload: entry });
              showToast({
                text: `Đã ghi ${food.name} vào ${mealPhrase(nowMeal)} · ${entry.kcal} kcal`,
                actionLabel: "Hoàn tác",
                onAction: () => dispatch({ type: "DELETE_MEAL", payload: { id: entry.id } }),
              });
            }}
            onOpenFood={(food) => {
              setActiveMeal(nowMeal);
              setActiveDate(TODAY);
              setReturnTo("today");
              setSelectedFoodId(food.id);
              setDetailGrams(undefined);
              setEditingMealId(null);
              go("food");
            }}
          />
        );

      case "diary":
        return (
          <DiaryScreen
            meals={state.meals}
            goals={state.goals}
            onNavigate={go}
            onAddFood={(meal, date) => openSearch(meal, date, "diary")}
            onEditMeal={handleEditMeal}
          />
        );

      case "search":
        return (
          <FoodSearchScreen
            foods={foods}
            recentFoods={selectors.recentFoods(12)}
            favoriteIds={state.favorites}
            meal={activeMeal}
            onBack={() => go(returnTo)}
            onSelectFood={(f) => {
              setSelectedFoodId(f.id);
              setDetailGrams(undefined);
              setEditingMealId(null);
              go("food");
            }}
            onQuickAdd={handleQuickAdd}
            suggestCtx={searchCtx}
            onCreateCustom={(name) => {
              setCustomName(name);
              setEditingCustom(null);
              go("custom");
            }}
          />
        );

      case "food":
        return (
          <FoodDetailScreen
            key={`${selectedFood.id}-${editingMealId ?? "new"}`}
            food={selectedFood}
            initialGrams={detailGrams}
            initialMeal={activeMeal}
            isEditing={Boolean(editingMealId)}
            isFavorite={state.favorites.includes(selectedFood.id)}
            onToggleFavorite={() => {
              const was = state.favorites.includes(selectedFood.id);
              dispatch({ type: "TOGGLE_FAVORITE", payload: { foodId: selectedFood.id } });
              showToast(was ? `Đã bỏ ${selectedFood.name} khỏi Yêu thích` : `Đã lưu ${selectedFood.name} vào Yêu thích`);
            }}
            onBack={() => go(editingMealId ? "diary" : "search")}
            onSave={handleSaveFoodDetail}
            onDelete={handleDeleteMeal}
            onEditCustom={() => {
              setEditingCustom(selectedFood);
              go("custom");
            }}
            onExplain={setExplain}
          />
        );

      case "custom":
        return (
          <CustomFoodScreen
            key={editingCustom?.id ?? "new"}
            initialName={customName}
            foods={foods}
            meal={activeMeal}
            editing={editingCustom ?? undefined}
            onBack={() => go(editingCustom ? "food" : "search")}
            onSave={(food, grams, meal) => {
              if (editingCustom) {
                dispatch({ type: "UPDATE_CUSTOM_FOOD", payload: food });
                setEditingCustom(null);
                showToast(`Đã cập nhật ${food.name}`);
                go("food");
                return;
              }
              dispatch({ type: "ADD_CUSTOM_FOOD", payload: food });
              logFood(food, grams, meal);
              go(returnTo);
            }}
            onDelete={() => {
              if (!editingCustom) return;
              dispatch({ type: "DELETE_CUSTOM_FOOD", payload: { id: editingCustom.id } });
              showToast(`Đã xóa ${editingCustom.name}`);
              setEditingCustom(null);
              go("search");
            }}
          />
        );

      case "planner":
        return (
          <PlannerScreen
            planDishes={state.planDishes}
            settings={state.planSettings}
            kcalGoal={state.goals.kcal}
            selectedDate={plannerDate}
            onSelectDate={setPlannerDate}
            onNavigate={go}
            onSwapClick={(dish) => {
              setSwapDishId(dish.id);
              go("swap");
            }}
            onLogDish={handleLogDish}
            onUnlogDish={(dish) => {
              dispatch({ type: "UNLOG_PLAN_DISH", payload: { id: dish.id } });
              showToast(`Đã bỏ ${dish.name} khỏi nhật ký`);
            }}
            onBuildPlan={() => go("planBuilder")}
          />
        );

      case "planBuilder":
        return (
          <PlanBuilderScreen
            initial={state.planSettings}
            onBack={() => go("planner")}
            onGenerate={(settings) => {
              dispatch({ type: "SET_PLAN", payload: { dishes: generatePlan(foods, settings, state.goals.kcal, TODAY, 7, state.planDishes.filter((p) => p.status === "logged")), settings } });
              setPlannerDate(TODAY);
              go("planner");
              showToast("Đã tạo thực đơn 7 ngày · bạn đổi được bất kỳ món nào");
            }}
          />
        );

      case "swap":
        if (!swapDish) return null;
        return (
          <SwapScreen
            currentDish={swapDish}
            foods={foods}
            settings={state.planSettings}
            onBack={() => go("planner")}
            onConfirmSwap={(food) => {
              const newPrice = nutritionFor(food, food.servingGrams).price;
              const day = state.planDishes.filter((p) => p.date === swapDish.date);
              const newCost = dayCost(day) - swapDish.price + newPrice;
              const budget = state.planSettings.budgetPerDay;
              dispatch({ type: "SWAP_PLAN_DISH", payload: { id: swapDish.id, foodId: food.id } });
              setPlannerDate(swapDish.date);
              go("planner");
              showToast(
                newCost <= budget
                  ? `Đã đổi sang ${food.name} · vẫn trong ngân sách (${formatPrice(newCost)}/${formatPrice(budget)})`
                  : `Đã đổi sang ${food.name} · cao hơn ngân sách ${formatPrice(newCost - budget)}, vẫn ổn nếu bạn muốn`,
              );
            }}
          />
        );

      case "progress":
        return <ProgressScreen dayTotals={selectors.dayTotals} waterFor={selectors.water} goals={state.goals} onNavigate={go} />;

      case "profile":
        return (
          <ProfileScreen
            key={`${state.goals.kcal}-${state.goals.waterMl}`}
            goals={state.goals}
            session={session}
            body={state.body}
            onSaveBody={(body) => {
              dispatch({ type: "SET_BODY", payload: body });
              showToast("Đã cập nhật chiều cao, cân nặng");
            }}
            onSignOut={() => {
              signOut();
              showToast("Đã đăng xuất");
            }}
            remindersOn={state.reminders.meal.enabled || state.reminders.water.enabled}
            onSaveGoals={(kcal, waterMl) => {
              dispatch({ type: "SET_GOALS", payload: { kcal, waterMl } });
              showToast("Đã lưu mục tiêu mới");
            }}
            onNavigate={go}
            onBack={() => go("today")}
          />
        );

      case "reminders":
        return (
          <RemindersScreen
            reminders={state.reminders ?? defaultReminders}
            onChange={(next) => dispatch({ type: "SET_REMINDERS", payload: next })}
            onBack={() => go("profile")}
          />
        );

      case "privacy":
        return (
          <PrivacyScreen
            counts={{ meals: state.meals.length, water: state.waterLogs.length, custom: state.customFoods.length }}
            email={session.email}
            hasBody={Boolean(state.body)}
            onBack={() => go("profile")}
            onClearAll={() => {
              try {
                window.localStorage.removeItem(`nutridaily:state:v3:${session.email}`);
              } catch {
                // ignore
              }
              dispatch({ type: "CLEAR_ALL" });
              deleteAccount(session.email);
              showToast("Đã xóa tài khoản và toàn bộ dữ liệu");
            }}
          />
        );
    }
  };

  return (
    <AppLayout
      currentScreen={screen}
      onNavigate={go}
      onAddFood={() => openSearch(nowMeal, TODAY, screen)}
      onAddWater={handleAddWater}
      onGoPlanner={() => {
        setPlannerDate(TODAY);
        go("planner");
      }}
      recentFoods={selectors.recentFoods(4)}
      onQuickLogFood={(food) => {
        setActiveDate(TODAY);
        const entry = makeEntry(food, food.servingGrams, nowMeal, TODAY);
        dispatch({ type: "ADD_MEAL", payload: entry });
        showToast({
          text: `Đã ghi ${food.name} vào ${mealPhrase(nowMeal)} · ${entry.kcal} kcal`,
          actionLabel: "Hoàn tác",
          onAction: () => dispatch({ type: "DELETE_MEAL", payload: { id: entry.id } }),
        });
      }}
      quickLogMeal={nowMeal}
    >
      {renderScreen()}
      <ExplainSheet topic={explain} onClose={closeExplain} />
    </AppLayout>
  );
}

/** Màn chưa đăng nhập: Chào mừng → Đăng ký / Đăng nhập. */
function Root() {
  const session = useSession();
  // Liên kết sâu (#planner…) chỉ áp dụng khi mở trang lúc đã đăng nhập sẵn.
  const [restoredEmail] = useState(() => session?.email ?? null);
  const [authScreen, setAuthScreen] = useState<"welcome" | "login" | "signup">("welcome");

  if (session) {
    return (
      <AppContent
        key={session.email}
        session={session}
        initialScreen={isNewSignup(session.email) ? "setup" : session.email === restoredEmail ? screenFromHash() : "today"}
      />
    );
  }

  return (
    <AppLayout
      currentScreen={authScreen}
      onNavigate={() => undefined}
      onAddFood={() => undefined}
      onAddWater={() => undefined}
      onGoPlanner={() => undefined}
      recentFoods={[]}
      onQuickLogFood={() => undefined}
      quickLogMeal="Trưa"
    >
      {authScreen === "welcome" ? (
        <WelcomeScreen onStart={() => setAuthScreen("signup")} onExplore={() => setAuthScreen("login")} />
      ) : (
        <AuthScreen
          key={authScreen}
          mode={authScreen}
          onSwitchMode={setAuthScreen}
          onBack={() => setAuthScreen("welcome")}
          onDone={() => setAuthScreen("welcome")}
        />
      )}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Root />
    </ToastProvider>
  );
}

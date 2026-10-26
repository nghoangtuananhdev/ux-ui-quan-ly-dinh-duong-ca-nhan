import React, { useState } from "react";
import { ToastProvider, useToast } from "./components/ui/Toast";
import AppLayout from "./components/layout/AppLayout";
import useNutritionStore from "./state/useNutritionStore";
import { Food, LogEntry, MealLabel, TODAY } from "./data/foods";

import WelcomeScreen from "./screens/WelcomeScreen";
import SetupScreen from "./screens/SetupScreen";
import TodayScreen from "./screens/TodayScreen";
import DiaryScreen from "./screens/DiaryScreen";
import FoodSearchScreen from "./screens/FoodSearchScreen";
import FoodDetailScreen from "./screens/FoodDetailScreen";
import PlannerScreen from "./screens/PlannerScreen";
import SwapScreen from "./screens/SwapScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TestingHub from "./testing/TestingHub";

type Screen =
  | "welcome"
  | "setup"
  | "today"
  | "diary"
  | "search"
  | "food"
  | "planner"
  | "swap"
  | "progress"
  | "profile"
  | "testing";

function AppContent() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const { state, dispatch, selectors } = useNutritionStore();
  const { showToast } = useToast();

  const [activeMeal, setActiveMeal] = useState<MealLabel>("Trưa");
  const [selectedFood, setSelectedFood] = useState<Food>(state.foods[1]); // default Cơm trắng
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [detailGrams, setDetailGrams] = useState(150);

  const go = (s: string) => setScreen(s as Screen);

  // Quick log food directly from Search or QuickLogSheet
  const handleQuickAddFood = (food: Food, meal: MealLabel = activeMeal) => {
    const grams = food.name === "Cơm trắng" ? 150 : food.servingGrams || 100;
    const kcal = Math.round((food.kcal * grams) / 100);
    const entryId = Date.now();

    const newEntry: LogEntry = {
      id: entryId,
      date: TODAY,
      meal,
      foodId: food.id,
      name: food.name,
      portion: `${grams} g`,
      grams,
      kcal,
      protein: Number(((food.protein * grams) / 100).toFixed(1)),
      carbs: Number(((food.carbs * grams) / 100).toFixed(1)),
      fat: Number(((food.fat * grams) / 100).toFixed(1)),
      loggedAt: Date.now(),
    };

    dispatch({ type: "ADD_MEAL", payload: newEntry });
    showToast({
      text: `Đã thêm ${food.name} (${grams} g) vào bữa ${meal.toLowerCase()}`,
      actionLabel: "Hoàn tác",
      onAction: () => dispatch({ type: "DELETE_MEAL", payload: { id: entryId } }),
    });
  };

  // Add or update food from FoodDetail
  const handleSaveFoodDetail = (grams: number, meal: MealLabel) => {
    const kcal = Math.round((selectedFood.kcal * grams) / 100);

    if (editingMealId) {
      dispatch({
        type: "UPDATE_MEAL",
        payload: { id: editingMealId, grams, meal },
      });
      showToast("Đã cập nhật khẩu phần");
    } else {
      const entryId = Date.now();
      const newEntry: LogEntry = {
        id: entryId,
        date: TODAY,
        meal,
        foodId: selectedFood.id,
        name: selectedFood.name,
        portion: `${grams} g`,
        grams,
        kcal,
        protein: Number(((selectedFood.protein * grams) / 100).toFixed(1)),
        carbs: Number(((selectedFood.carbs * grams) / 100).toFixed(1)),
        fat: Number(((selectedFood.fat * grams) / 100).toFixed(1)),
        loggedAt: Date.now(),
      };
      dispatch({ type: "ADD_MEAL", payload: newEntry });
      showToast({
        text: `Đã thêm vào bữa ${meal.toLowerCase()}`,
        actionLabel: "Hoàn tác",
        onAction: () => dispatch({ type: "DELETE_MEAL", payload: { id: entryId } }),
      });
    }

    setEditingMealId(null);
    go("diary");
  };

  const handleEditMeal = (id: number) => {
    const item = state.meals.find((m) => m.id === id);
    if (!item) return;
    setEditingMealId(id);
    const matchedFood =
      state.foods.find((f) => f.id === item.foodId || f.name === item.name) ||
      state.foods[0];
    setSelectedFood(matchedFood);
    setDetailGrams(item.grams || 100);
    setActiveMeal(item.meal);
    go("food");
  };

  const handleDeleteMeal = () => {
    if (!editingMealId) return;
    const deletedItem = state.meals.find((m) => m.id === editingMealId);
    dispatch({ type: "DELETE_MEAL", payload: { id: editingMealId } });
    setEditingMealId(null);
    go("diary");

    showToast({
      text: "Đã xóa món khỏi nhật ký",
      actionLabel: deletedItem ? "Hoàn tác" : undefined,
      onAction: deletedItem
        ? () => dispatch({ type: "ADD_MEAL", payload: deletedItem })
        : undefined,
    });
  };

  const handleAddWater = (ml: number) => {
    dispatch({ type: "ADD_WATER", payload: { ml } });
    showToast({
      text: `Đã thêm ${ml} ml nước`,
      actionLabel: "Hoàn tác",
      onAction: () => dispatch({ type: "REMOVE_WATER", payload: { ml } }),
    });
  };

  if (screen === "testing") {
    return <TestingHub onBack={() => go("welcome")} />;
  }

  const plannedLunch =
    state.planDishes.find((p) => p.meal === "Trưa") || state.planDishes[1];

  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return (
          <WelcomeScreen
            onStart={() => go("setup")}
            onExplore={() => go("today")}
          />
        );
      case "setup":
        return (
          <SetupScreen
            initialGoal={state.goals.kcal}
            initialWaterGoal={state.goals.waterMl}
            initialSelectedGoal={state.selectedGoal}
            onBack={() => go("welcome")}
            onSave={(kcal, waterGoal, selGoal) => {
              dispatch({ type: "SET_GOALS", payload: { kcal, waterMl: waterGoal } });
              dispatch({ type: "SET_SELECTED_GOAL", payload: selGoal });
              go("today");
              showToast("Đã lưu mục tiêu của bạn");
            }}
            onSkip={() => go("today")}
          />
        );
      case "today":
        return (
          <TodayScreen
            meals={state.meals}
            water={state.water}
            goals={state.goals}
            onNavigate={go}
            onAddFoodToMeal={(meal) => {
              setActiveMeal(meal);
              setEditingMealId(null);
              go("search");
            }}
            onAddWater={handleAddWater}
            onRemoveWater={(ml) => {
              dispatch({ type: "REMOVE_WATER", payload: { ml } });
              showToast("Đã giảm 250 ml nước");
            }}
          />
        );
      case "diary":
        return (
          <DiaryScreen
            meals={state.meals}
            goals={state.goals}
            onNavigate={go}
            onAddFood={(meal) => {
              setActiveMeal(meal);
              setEditingMealId(null);
              go("search");
            }}
            onEditMeal={handleEditMeal}
          />
        );
      case "search":
        return (
          <FoodSearchScreen
            foods={state.foods}
            meal={activeMeal}
            onBack={() => go("diary")}
            onSelectFood={(f) => {
              setSelectedFood(f);
              setDetailGrams(f.name === "Cơm trắng" ? 150 : f.servingGrams || 100);
              setEditingMealId(null);
              go("food");
            }}
            onQuickAdd={(f, m) => {
              handleQuickAddFood(f, m);
              go("diary");
            }}
          />
        );
      case "food":
        return (
          <FoodDetailScreen
            food={selectedFood}
            initialGrams={detailGrams}
            initialMeal={activeMeal}
            isEditing={Boolean(editingMealId)}
            onBack={() => go(editingMealId ? "diary" : "search")}
            onSave={handleSaveFoodDetail}
            onDelete={handleDeleteMeal}
          />
        );
      case "planner":
        return (
          <PlannerScreen
            planDishes={state.planDishes}
            onNavigate={go}
            onSwapClick={() => go("swap")}
          />
        );
      case "swap":
        return (
          <SwapScreen
            currentDish={plannedLunch}
            onBack={() => go("planner")}
            onConfirmSwap={(name, kcal, portion) => {
              dispatch({
                type: "UPDATE_PLAN_DISH",
                payload: { id: plannedLunch.id, name, kcal, portion },
              });
              go("planner");
              showToast("Đã cập nhật thực đơn ngày mai");
            }}
          />
        );
      case "progress":
        return (
          <ProgressScreen
            meals={state.meals}
            water={state.water}
            goals={state.goals}
            onNavigate={go}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            goals={state.goals}
            onSaveGoals={(kcal, waterMl) => {
              dispatch({ type: "SET_GOALS", payload: { kcal, waterMl } });
              showToast("Đã lưu mục tiêu mới");
            }}
            onResetData={() => {
              dispatch({ type: "RESET_DATA" });
              showToast("Đã đặt lại dữ liệu mẫu");
            }}
            onBack={() => go("today")}
          />
        );
    }
  };

  return (
    <AppLayout
      currentScreen={screen}
      onNavigate={go}
      onAddFood={() => {
        setActiveMeal("Trưa");
        setEditingMealId(null);
        go("search");
      }}
      onAddWater={handleAddWater}
      onGoPlanner={() => go("planner")}
      recentFoods={selectors.selectRecentFoods(3)}
      onQuickLogFood={(food) => handleQuickAddFood(food, activeMeal)}
    >
      {renderScreen()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

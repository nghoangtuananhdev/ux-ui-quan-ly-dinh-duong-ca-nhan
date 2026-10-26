import React from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import CalorieRing from "../components/nutrition/CalorieRing";
import MacroBar from "../components/nutrition/MacroBar";
import MealSection from "../components/nutrition/MealSection";
import WaterCard from "../components/nutrition/WaterCard";
import { LogEntry, MealLabel, TODAY } from "../data/foods";
import { Goals } from "../state/useNutritionStore";

export interface TodayScreenProps {
  meals: LogEntry[];
  water: number;
  goals: Goals;
  onNavigate: (screen: string) => void;
  onAddFoodToMeal: (meal: MealLabel) => void;
  onAddWater: (ml: number) => void;
  onRemoveWater: (ml: number) => void;
}

export default function TodayScreen({
  meals,
  water,
  goals,
  onNavigate,
  onAddFoodToMeal,
  onAddWater,
  onRemoveWater,
}: TodayScreenProps) {
  const todayMeals = meals.filter((m) => m.date === TODAY);
  const totalKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0);
  const totalProtein = Number(
    todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1)
  );
  const totalCarbs = Number(
    todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0).toFixed(1)
  );
  const totalFat = Number(
    todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0).toFixed(1)
  );

  const remainingKcal = Math.max(goals.kcal - totalKcal, 0);
  const isOver = totalKcal > goals.kcal;

  const mealLabels: MealLabel[] = ["Sáng", "Trưa", "Tối", "Bữa phụ"];

  return (
    <>
      <Header
        title="Hôm nay"
        onAvatarClick={() => onNavigate("profile")}
      />

      <main className="screen pad with-nav">
        <div className="eyebrow">THỨ NĂM, 19 THÁNG 6</div>
        <h1>Chào buổi sáng, An</h1>
        <p className="muted">Một chút đều đặn mỗi ngày là đủ.</p>

        {/* Hero Card */}
        <section className="energy-card space-y-4">
          <div className="card-top">
            <div>
              <span>Năng lượng đã ghi</span>
              <strong>
                {isOver
                  ? `Vượt ${(totalKcal - goals.kcal).toLocaleString("vi-VN")} kcal`
                  : `Còn ${remainingKcal.toLocaleString("vi-VN")} kcal`}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("diary")}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <Icon name="chevron" size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
            <CalorieRing value={totalKcal} total={goals.kcal} size={150} />

            <div className="flex-1 w-full space-y-3">
              <MacroBar
                type="protein"
                label="Chất đạm"
                value={totalProtein}
                total={goals.proteinG}
                onDark
              />
              <MacroBar
                type="carbs"
                label="Tinh bột"
                value={totalCarbs}
                total={goals.carbsG}
                onDark
              />
              <MacroBar
                type="fat"
                label="Chất béo"
                value={totalFat}
                total={goals.fatG}
                onDark
              />
            </div>
          </div>

          {/* 3-column summary */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center">
            <div>
              <span className="block text-caption text-white/60">Mục tiêu</span>
              <b className="text-body font-bold text-white tabular-nums">
                {goals.kcal.toLocaleString("vi-VN")}
              </b>
            </div>
            <div className="border-x border-white/15 px-1">
              <span className="block text-caption text-white/60">Đã ăn</span>
              <b className="text-body font-bold text-white tabular-nums">
                {totalKcal.toLocaleString("vi-VN")}
              </b>
            </div>
            <div>
              <span className="block text-caption text-white/60">
                {isOver ? "Vượt mức" : "Còn lại"}
              </span>
              <b
                className={`text-body font-bold tabular-nums ${
                  isOver ? "text-accent-500" : "text-white"
                }`}
              >
                {Math.abs(goals.kcal - totalKcal).toLocaleString("vi-VN")}
              </b>
            </div>
          </div>
        </section>

        {/* Meals Section */}
        <div className="section-heading">
          <div>
            <h2>Bữa ăn hôm nay</h2>
            <span>{todayMeals.length} món đã ghi</span>
          </div>
          <button
            type="button"
            className="small-add"
            onClick={() => onAddFoodToMeal("Trưa")}
          >
            <Icon name="plus" size={16} />
            <span>Thêm món</span>
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {mealLabels.map((name) => {
            const list = todayMeals.filter((m) => m.meal === name);
            return (
              <MealSection
                key={name}
                meal={name}
                entries={list}
                onAddClick={(meal) => onAddFoodToMeal(meal)}
                onMealClick={() => onNavigate("diary")}
              />
            );
          })}
        </div>

        {/* Water Card */}
        <WaterCard
          water={water}
          waterGoal={goals.waterMl}
          onAddWater={onAddWater}
          onRemoveWater={onRemoveWater}
        />

        {/* Link to Planner */}
        <button
          type="button"
          className="planner-link mt-2"
          onClick={() => onNavigate("planner")}
        >
          <span>
            <Icon name="calendar" size={20} />
            <b>Xem thực đơn hôm nay</b>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      </main>
    </>
  );
}

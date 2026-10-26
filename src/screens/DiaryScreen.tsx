import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import FoodRow from "../components/nutrition/FoodRow";
import MacroBar from "../components/nutrition/MacroBar";
import { LogEntry, MealLabel, TODAY } from "../data/foods";
import { Goals } from "../state/useNutritionStore";

export interface DiaryScreenProps {
  meals: LogEntry[];
  goals: Goals;
  onNavigate: (screen: string) => void;
  onAddFood: (meal: MealLabel) => void;
  onEditMeal: (id: number) => void;
}

export default function DiaryScreen({
  meals,
  goals,
  onNavigate,
  onAddFood,
  onEditMeal,
}: DiaryScreenProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const dayMeals = meals.filter((m) => m.date === selectedDate);
  const totalKcal = dayMeals.reduce((sum, m) => sum + m.kcal, 0);
  const totalProtein = Number(
    dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1)
  );
  const totalCarbs = Number(
    dayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0).toFixed(1)
  );
  const totalFat = Number(
    dayMeals.reduce((sum, m) => sum + (m.fat || 0), 0).toFixed(1)
  );

  const mealLabels: MealLabel[] = ["Sáng", "Trưa", "Tối", "Bữa phụ"];

  return (
    <>
      <Header
        title="Nhật ký ăn uống"
        action={
          <button
            type="button"
            className="icon-btn"
            onClick={() => onAddFood("Trưa")}
            aria-label="Thêm món ăn"
          >
            <Icon name="plus" size={22} />
          </button>
        }
        onAvatarClick={() => onNavigate("profile")}
      />

      <main className="screen pad with-nav">
        {/* Date Navigator */}
        <div className="date-picker mb-4">
          <button
            type="button"
            onClick={() => setSelectedDate("2025-06-18")}
            aria-label="Ngày trước"
          >
            <Icon name="arrow" size={18} />
          </button>
          <div>
            <b>{selectedDate === TODAY ? "Hôm nay" : "Hôm qua"}</b>
            <span>
              {selectedDate === TODAY ? "Thứ Năm, 19/06" : "Thứ Tư, 18/06"}
            </span>
          </div>
          <button
            type="button"
            disabled={selectedDate === TODAY}
            onClick={() => setSelectedDate(TODAY)}
            aria-label="Ngày sau"
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="chevron" size={18} />
          </button>
        </div>

        {/* Summary Card */}
        <section className="diary-summary space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-caption text-white/70">Tổng năng lượng</span>
              <b className="text-body font-bold text-white tabular-nums">
                {totalKcal.toLocaleString("vi-VN")} kcal
              </b>
            </div>
            <div>
              <span className="block text-caption text-white/70">Mục tiêu</span>
              <b className="text-body font-bold text-white tabular-nums">
                {goals.kcal.toLocaleString("vi-VN")} kcal
              </b>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/15 pt-2">
            <MacroBar
              type="protein"
              label="Đạm"
              value={totalProtein}
              total={goals.proteinG}
              onDark
              compact
            />
            <MacroBar
              type="carbs"
              label="Tinh bột"
              value={totalCarbs}
              total={goals.carbsG}
              onDark
              compact
            />
            <MacroBar
              type="fat"
              label="Chất béo"
              value={totalFat}
              total={goals.fatG}
              onDark
              compact
            />
          </div>
        </section>

        {/* Meal Groups */}
        <div className="space-y-5 mb-5">
          {mealLabels.map((name) => {
            const list = dayMeals.filter((m) => m.meal === name);
            const groupKcal = list.reduce((s, m) => s + m.kcal, 0);

            return (
              <section className="diary-group" key={name}>
                <div className="group-head flex items-center justify-between mb-2">
                  <h2 className="text-h2 font-bold text-ink">{name}</h2>
                  <span className="text-label font-bold text-ink tabular-nums">
                    {groupKcal > 0 ? `${groupKcal.toLocaleString("vi-VN")} kcal` : "0 kcal"}
                  </span>
                </div>

                {list.length > 0 ? (
                  <div className="space-y-2">
                    {list.map((item) => (
                      <FoodRow
                        key={item.id}
                        entry={item}
                        onClick={() => onEditMeal(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="empty-meal"
                    onClick={() => onAddFood(name)}
                  >
                    <Icon name="plus" size={16} />
                    <span>Ghi món đầu tiên</span>
                  </button>
                )}
              </section>
            );
          })}
        </div>

        <Button
          icon="plus"
          onClick={() => onAddFood("Trưa")}
        >
          Thêm món
        </Button>
      </main>
    </>
  );
}

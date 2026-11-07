import React from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import CalorieRing from "../components/nutrition/CalorieRing";
import MacroBar from "../components/nutrition/MacroBar";
import MealSection from "../components/nutrition/MealSection";
import WaterCard from "../components/nutrition/WaterCard";
import { ExplainTopic } from "../components/nutrition/ExplainSheet";
import { LogEntry, MEALS, MealLabel, TODAY, mealPhrase } from "../data/foods";
import { Goals } from "../state/useNutritionStore";
import { useClock } from "../lib/clock";
import { givenName, useSession } from "../lib/auth";
import { formatPrice, overline } from "../lib/date";
import { Food, nutritionFor } from "../data/foods";

export interface TodayScreenProps {
  meals: LogEntry[];
  water: number;
  goals: Goals;
  weekAvgKcal: number;
  onNavigate: (screen: string) => void;
  onAddFoodToMeal: (meal: MealLabel) => void;
  onAddWater: (ml: number) => void;
  onRemoveWater: (ml: number) => void;
  onSetWater: (ml: number) => void;
  onExplain: (topic: ExplainTopic) => void;
  suggestions: { food: Food; reason: string }[];
  hasBody: boolean;
  onQuickAddSuggestion: (food: Food) => void;
  onOpenFood: (food: Food) => void;
}

export default function TodayScreen({
  meals,
  water,
  goals,
  weekAvgKcal,
  onNavigate,
  onAddFoodToMeal,
  onAddWater,
  onRemoveWater,
  onSetWater,
  onExplain,
  suggestions,
  hasBody,
  onQuickAddSuggestion,
  onOpenFood,
}: TodayScreenProps) {
  const { meal: nowMeal, greeting } = useClock();
  const session = useSession();
  const todayMeals = meals.filter((m) => m.date === TODAY);
  const sum = (k: "kcal" | "protein" | "carbs" | "fat") =>
    Number(todayMeals.reduce((s, m) => s + (m[k] || 0), 0).toFixed(1));
  const totalKcal = Math.round(sum("kcal"));
  const remainingKcal = Math.max(goals.kcal - totalKcal, 0);
  const isOver = totalKcal > goals.kcal;
  const nowMealCount = todayMeals.filter((m) => m.meal === nowMeal).length;
  const ctaLabel = `Ghi ${mealPhrase(nowMeal)}`;
  const ctaHint = nowMealCount
    ? `Đã có ${nowMealCount} món · chọn món gần đây, 2 chạm là xong`
    : "Chọn món gần đây — 2 chạm là xong";

  return (
    <>
      <Header title="Hôm nay" onAvatarClick={() => onNavigate("profile")} />

      <main className="screen pad with-nav">
        <div className="eyebrow">{overline(TODAY)}</div>
        <h1>
          {greeting}, {givenName(session?.name ?? "bạn")}
        </h1>
        <p className="muted">Một chút đều đặn mỗi ngày là đủ.</p>

        {/* Hero Card */}
        <section className="energy-card space-y-4" aria-label="Tổng quan năng lượng hôm nay">
          <div className="card-top">
            <div>
              <span className="flex items-center gap-1.5">
                Năng lượng đã ghi
                <button
                  type="button"
                  onClick={() => onExplain("estimate")}
                  className="hit-area relative inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-0.5 text-caption font-semibold text-white/90 hover:bg-white/20 cursor-pointer"
                  aria-label="Vì sao là số ước tính?"
                >
                  <Icon name="info" size={12} /> ước tính
                </button>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("diary")}
              className="hit-area relative hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <Icon name="chevron" size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
            <button
              type="button"
              onClick={() => onExplain("kcal")}
              className="rounded-full cursor-pointer focus-visible:outline-3 focus-visible:outline-white/60"
              aria-label="Giải thích năng lượng"
            >
              <CalorieRing value={totalKcal} total={goals.kcal} size={150} />
            </button>

            <div className="flex-1 w-full space-y-1">
              {(
                [
                  ["protein", "Chất đạm", sum("protein"), goals.proteinG],
                  ["carbs", "Tinh bột", sum("carbs"), goals.carbsG],
                  ["fat", "Chất béo", sum("fat"), goals.fatG],
                ] as const
              ).map(([type, label, value, total]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onExplain(type)}
                  className="w-full rounded-md px-1.5 py-1 text-left hover:bg-white/8 cursor-pointer"
                  aria-label={`${label}: ${Math.round(value)} trên ${total} gam. Chạm để xem giải thích`}
                >
                  <MacroBar type={type} label={label} value={value} total={total} onDark />
                </button>
              ))}
              <p className="m-0 px-1.5 text-caption text-white/60">Chạm vào từng chất để xem giải thích</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-white/15 pt-3 text-center">
            <div>
              <span className="block text-caption text-white/70">Mục tiêu</span>
              <b className="text-body font-bold text-white tabular-nums">{goals.kcal.toLocaleString("vi-VN")}</b>
            </div>
            <div className="border-l border-white/15 px-1">
              <span className="block text-caption text-white/70">Đã ăn</span>
              <b className="text-body font-bold text-white tabular-nums">{totalKcal.toLocaleString("vi-VN")}</b>
            </div>
          </div>
        </section>

        {/* Over-goal: thông tin trung tính, không phán xét (UX-02, Kịch bản 3) */}
        {isOver && (
          <div className="mt-3 flex gap-3 rounded-lg border border-accent-100 bg-accent-100/60 p-3.5" role="note">
            <Icon name="sparkle" size={20} className="shrink-0 text-accent-700" />
            <p className="m-0 text-label text-ink">
              Hôm nay bạn đã dùng {totalKcal.toLocaleString("vi-VN")}/{goals.kcal.toLocaleString("vi-VN")} kcal.{" "}
              <b>Một ngày không quyết định cả tuần</b>
              {weekAvgKcal > 0 && <> — trung bình tuần của bạn là {weekAvgKcal.toLocaleString("vi-VN")} kcal/ngày</>}.
            </p>
          </div>
        )}

        {/* Contextual CTA theo khung giờ (FR-01, Kịch bản 1) */}
        <button
          type="button"
          onClick={() => onAddFoodToMeal(nowMeal)}
          className="mt-4 w-full min-h-[56px] rounded-lg bg-brand-100 text-brand-text px-4 flex items-center justify-between gap-3 font-bold hover:bg-brand-100/80 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-900 text-white">
              <Icon name="plus" size={18} strokeWidth={2.4} />
            </span>
            <span className="text-left">
              <span className="block text-body">{ctaLabel}</span>
              <span className="block text-caption font-medium text-ink-muted">{ctaHint}</span>
            </span>
          </span>
          <Icon name="chevron" size={18} />
        </button>

        {suggestions.length > 0 && remainingKcal > 0 && (
          <section className="mt-3 rounded-lg border border-line bg-surface p-3.5" aria-label={`Gợi ý cho ${mealPhrase(nowMeal)}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <b className="flex items-center gap-1.5 text-label font-bold text-ink">
                <Icon name="sparkle" size={16} className="text-brand-text-soft" />
                Gợi ý cho {mealPhrase(nowMeal)}
              </b>
              <span className="text-caption text-ink-muted">{hasBody ? "theo BMI & kcal còn lại" : "theo kcal còn lại"}</span>
            </div>
            <div className="grid gap-2">
              {suggestions.map(({ food, reason }) => {
                const n = nutritionFor(food, food.servingGrams);
                return (
                  <div key={food.id} className="flex items-center gap-2 rounded-md bg-canvas p-2.5">
                    <button type="button" onClick={() => onOpenFood(food)} className="min-w-0 flex-1 text-left cursor-pointer">
                      <b className="block text-body font-bold leading-snug break-words text-ink">{food.name}</b>
                      <span className="block text-caption leading-snug text-ink-muted">
                        {reason} · {n.kcal} kcal · ≈ {formatPrice(n.price)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickAddSuggestion(food)}
                      className="size-11 shrink-0 rounded-md bg-brand-100 text-brand-text hover:bg-brand-800 hover:text-white flex items-center justify-center cursor-pointer"
                      aria-label={`Ghi ${food.name} vào ${mealPhrase(nowMeal)}`}
                    >
                      <Icon name="plus" size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
            {!hasBody && (
              <button type="button" onClick={() => onNavigate("profile")} className="mt-2 min-h-[36px] text-caption font-bold text-brand-text-soft underline underline-offset-4 cursor-pointer">
                Thêm chiều cao, cân nặng để gợi ý sát hơn
              </button>
            )}
          </section>
        )}

        <div className="section-heading">
          <div>
            <h2>Bữa ăn hôm nay</h2>
            <span>{todayMeals.length} món đã ghi</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {MEALS.map((name) => (
            <MealSection
              key={name}
              meal={name}
              entries={todayMeals.filter((m) => m.meal === name)}
              onAddClick={(meal) => onAddFoodToMeal(meal)}
              onMealClick={() => onNavigate("diary")}
            />
          ))}
        </div>

        <WaterCard water={water} waterGoal={goals.waterMl} onAddWater={onAddWater} onRemoveWater={onRemoveWater} onSetWater={onSetWater} />

        <button type="button" className="planner-link mt-2" onClick={() => onNavigate("planner")}>
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

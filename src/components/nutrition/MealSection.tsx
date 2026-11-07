import React from "react";
import Icon, { IconName } from "../ui/Icon";
import { LogEntry, MealLabel } from "../../data/foods";

export interface MealSectionProps {
  meal: MealLabel;
  entries: LogEntry[];
  onAddClick: (meal: MealLabel) => void;
  onMealClick?: (meal: MealLabel) => void;
}

const mealIcons: Record<MealLabel, IconName> = {
  Sáng: "sun",
  Trưa: "utensils",
  Tối: "moon",
  "Bữa phụ": "apple",
};

export default function MealSection({
  meal,
  entries,
  onAddClick,
  onMealClick,
}: MealSectionProps) {
  const totalKcal = entries.reduce((sum, item) => sum + item.kcal, 0);
  const dishSummary = entries.length
    ? entries.map((e) => e.name).join(", ")
    : "Chưa ghi món";

  return (
    <section
      id={`meal-${meal.toLowerCase()}`}
      className="rounded-lg bg-surface border border-line p-3.5 flex items-center gap-3 transition-colors hover:border-brand-700/30"
    >
      {/* Clickable meal body to open diary */}
      <div
        onClick={() => onMealClick?.(meal)}
        className="flex-1 flex items-center gap-3 min-w-0 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onMealClick?.(meal);
          }
        }}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-text-soft">
          <Icon name={mealIcons[meal] || "leaf"} size={22} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <b className="text-body font-bold text-ink">{meal}</b>
            <span className="text-label font-bold text-ink tabular-nums">
              {totalKcal > 0 ? `${totalKcal.toLocaleString("vi-VN")} kcal` : ""}
            </span>
          </div>
          <p className="text-caption text-ink-muted leading-snug m-0">
            {dishSummary}
          </p>
        </div>
      </div>

      {/* Contextual + button */}
      <button
        type="button"
        onClick={() => onAddClick(meal)}
        className="size-11 shrink-0 rounded-md bg-brand-50 text-brand-text-soft hover:bg-brand-900 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label={`Thêm món vào bữa ${meal}`}
      >
        <Icon name="plus" size={20} />
      </button>
    </section>
  );
}

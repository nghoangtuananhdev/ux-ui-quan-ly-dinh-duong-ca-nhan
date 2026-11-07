import React from "react";
import Sheet from "../ui/Sheet";
import Icon from "../ui/Icon";
import { Food, MealLabel, nutritionFor, portionLabel, mealPhrase } from "../../data/foods";

export interface QuickLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: () => void;
  onAddWater: (ml: number) => void;
  onGoPlanner: () => void;
  recentFoods: Food[];
  onQuickLogFood: (food: Food) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  meal: MealLabel;
}

export default function QuickLogSheet({
  isOpen,
  onClose,
  onAddFood,
  onAddWater,
  onGoPlanner,
  recentFoods,
  onQuickLogFood,
  triggerRef,
  meal,
}: QuickLogSheetProps) {
  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Ghi nhận nhanh"
      triggerRef={triggerRef}
    >
      <div className="grid gap-2.5 mb-5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onAddFood();
          }}
          className="w-full min-h-[56px] rounded-lg border border-line bg-surface p-3.5 flex items-center justify-between text-left hover:bg-brand-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-brand-100 text-brand-text">
              <Icon name="plus" size={20} />
            </span>
            <div>
              <b className="block text-body font-bold text-ink">Thêm món ăn</b>
              <span className="text-caption text-ink-muted">Tìm món, chọn khẩu phần Nhỏ/Vừa/Lớn</span>
            </div>
          </div>
          <Icon name="chevron" size={18} className="text-ink-muted" />
        </button>

        <button
          type="button"
          onClick={() => {
            onAddWater(250);
            onClose();
          }}
          className="w-full min-h-[56px] rounded-lg border border-line bg-water-tint/50 p-3.5 flex items-center justify-between text-left hover:bg-water-tint transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-water text-white">
              <Icon name="water" size={20} />
            </span>
            <div>
              <b className="block text-body font-bold text-water">Thêm nước uống</b>
              <span className="text-caption text-ink-muted">Ghi nhận 1 cốc nước vừa uống</span>
            </div>
          </div>
          <span className="text-label font-bold text-water">+250 ml</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onGoPlanner();
          }}
          className="w-full min-h-[56px] rounded-lg border border-line bg-surface p-3.5 flex items-center justify-between text-left hover:bg-brand-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-brand-50 text-brand-text-soft">
              <Icon name="calendar" size={20} />
            </span>
            <div>
              <b className="block text-body font-bold text-ink">Thực đơn hôm nay</b>
              <span className="text-caption text-ink-muted">Xem hoặc ghi món theo kế hoạch</span>
            </div>
          </div>
          <Icon name="chevron" size={18} className="text-ink-muted" />
        </button>
      </div>

      {recentFoods.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <b className="text-label font-bold text-ink">Món gần đây → {mealPhrase(meal)}</b>
            <span className="text-caption text-ink-muted">1 chạm để ghi</span>
          </div>
          <div className="divide-y divide-line rounded-lg border border-line bg-surface overflow-hidden">
            {recentFoods.slice(0, 3).map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-3 min-h-[54px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-text-soft">
                    <Icon name="leaf" size={16} />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-body font-bold text-ink leading-snug break-words">
                      {food.name}
                    </b>
                    <span className="text-caption text-ink-muted">
                      {portionLabel(food, food.servingGrams)} · {nutritionFor(food, food.servingGrams).kcal} kcal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onQuickLogFood(food);
                    onClose();
                  }}
                  className="size-11 shrink-0 flex items-center justify-center rounded-md bg-brand-100 text-brand-text hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
                  aria-label={`Ghi ngay ${food.name} vào ${mealPhrase(meal)}`}
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}

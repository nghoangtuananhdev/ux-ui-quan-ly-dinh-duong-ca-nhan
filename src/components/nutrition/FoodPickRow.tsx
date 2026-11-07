import React from "react";
import Icon from "../ui/Icon";
import { Food, nutritionFor, portionLabel } from "../../data/foods";
import { formatPrice } from "../../lib/date";

export interface FoodPickRowProps {
  food: Food;
  index?: number;
  favorite?: boolean;
  badge?: string;
  meal: string;
  onOpen: () => void;
  onQuickAdd: () => void;
}

/** Một dòng món: chạm thân dòng để xem chi tiết, chạm + để ghi ngay khẩu phần vừa. */
export default function FoodPickRow({ food, index = 0, favorite, badge, meal, onOpen, onQuickAdd }: FoodPickRowProps) {
  const n = nutritionFor(food, food.servingGrams);
  return (
    <div className="flex items-center justify-between gap-2 p-3 border-b border-line last:border-b-0 hover:bg-brand-50/50 transition-colors">
      <button type="button" onClick={onOpen} className="flex-1 flex items-start gap-3 text-left min-w-0 cursor-pointer">
        <span className={`food-thumb t${index % 4}`}>
          <Icon name="leaf" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <b className="block text-body font-bold text-ink leading-snug break-words">
            {food.name}
            {favorite && <Icon name="star" size={14} filled className="ml-1 inline-block align-[-2px] text-accent-700" />}
          </b>
          <small className="block text-caption text-ink-muted leading-snug">
            {portionLabel(food, food.servingGrams)} · {n.kcal} kcal · ≈ {formatPrice(n.price)}
          </small>
          {badge && (
            <em className="mt-1 inline-block not-italic rounded-full bg-accent-100 px-2 py-0.5 text-caption font-bold text-accent-700">
              {badge}
            </em>
          )}
        </span>
      </button>
      <button
        type="button"
        onClick={onQuickAdd}
        className="size-11 shrink-0 rounded-md bg-brand-100 text-brand-text hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label={`Ghi ngay ${food.name} (khẩu phần vừa) vào ${meal}`}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}

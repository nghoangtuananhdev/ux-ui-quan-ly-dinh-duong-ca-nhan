import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import ChipRow from "../components/ui/ChipRow";
import { Food, PlanDish, nutritionFor, mealPhrase } from "../data/foods";
import { PlanSettings, allowedFoods } from "../lib/plan";
import { formatPrice, longLabel } from "../lib/date";

export interface SwapScreenProps {
  currentDish: PlanDish;
  foods: Food[];
  settings: PlanSettings;
  onBack: () => void;
  onConfirmSwap: (food: Food) => void;
}

type Sort = "cheaper" | "closest" | "protein";

function Delta({ value, unit }: { value: number; unit: string }) {
  const text = value === 0 ? `±0 ${unit}` : `${value > 0 ? "+" : "−"}${Math.abs(value)}${unit === "k" ? "k" : ` ${unit}`}`;
  return (
    <span className="rounded-full bg-canvas border border-line px-2 py-0.5 text-caption font-bold tabular-nums text-ink">{text}</span>
  );
}

export default function SwapScreen({ currentDish, foods, settings, onBack, onConfirmSwap }: SwapScreenProps) {
  const [sort, setSort] = useState<Sort>("cheaper");

  const options = useMemo(() => {
    const list = allowedFoods(foods, settings, currentDish.meal)
      .filter((f) => f.id !== currentDish.foodId)
      .map((f) => ({ food: f, n: nutritionFor(f, f.servingGrams) }));
    if (sort === "cheaper") {
      const cheaper = list.filter((o) => o.n.price < currentDish.price);
      const pool = cheaper.length ? cheaper : list;
      // Rẻ hơn nhưng vẫn đủ no: ưu tiên món có năng lượng gần món cũ.
      return pool.sort((a, b) => Math.abs(a.n.kcal - currentDish.kcal) - Math.abs(b.n.kcal - currentDish.kcal));
    }
    if (sort === "closest") return list.sort((a, b) => Math.abs(a.n.kcal - currentDish.kcal) - Math.abs(b.n.kcal - currentDish.kcal));
    return list.sort((a, b) => b.n.protein - a.n.protein);
  }, [foods, settings, currentDish, sort]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = options.find((o) => o.food.id === selectedId) ?? null;

  return (
    <>
      <Header title={`Đổi món ${mealPhrase(currentDish.meal)}`} back={onBack} />
      <main className="screen pad swap-screen">
        <div className="current-plan">
          <span>MÓN HIỆN TẠI · {longLabel(currentDish.date).toUpperCase()}</span>
          <div>
            <span className="food-thumb t1">
              <Icon name="leaf" size={20} />
            </span>
            <div>
              <b>{currentDish.name}</b>
              <small>
                {currentDish.kcal} kcal · ≈ {formatPrice(currentDish.price)}
              </small>
            </div>
          </div>
        </div>

        <ChipRow
          items={[
            ["cheaper", "Rẻ hơn"],
            ["closest", "Gần kcal nhất"],
            ["protein", "Nhiều đạm hơn"],
          ] as const}
          value={sort}
          onChange={setSort}
          label="Sắp xếp món thay thế"
          className="mb-2"
        />

        <div className="swap-list" role="radiogroup" aria-label="Chọn món thay thế">
          {options.map(({ food, n }, i) => {
            const isSelected = selectedId === food.id;
            return (
              <button
                key={food.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={isSelected ? "selected" : ""}
                onClick={() => setSelectedId(food.id)}
              >
                <span className={`food-thumb t${(i % 3) + 1}`}>
                  <Icon name="leaf" size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <b>{food.name}</b>
                  <small>
                    {n.kcal} kcal · ≈ {formatPrice(n.price)}
                  </small>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    <Delta value={n.kcal - currentDish.kcal} unit="kcal" />
                    <Delta value={n.price - currentDish.price} unit="k" />
                  </span>
                </div>
                <i>{isSelected && <Icon name="check" size={16} />}</i>
              </button>
            );
          })}
        </div>

        <div className="sticky-actions space-y-2">
          <Button disabled={!selected} onClick={() => selected && onConfirmSwap(selected.food)}>
            {selected ? `Đổi sang ${selected.food.name}` : "Chọn một món để đổi"}
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Giữ món cũ
          </Button>
        </div>
      </main>
    </>
  );
}

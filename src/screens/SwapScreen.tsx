import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { PlanDish } from "../data/foods";

export interface SwapScreenProps {
  currentDish: PlanDish;
  onBack: () => void;
  onConfirmSwap: (newDishName: string, kcal: number, portion: string) => void;
}

export default function SwapScreen({
  currentDish,
  onBack,
  onConfirmSwap,
}: SwapScreenProps) {
  const options = [
    { name: "Bún thịt nướng", portion: "1 tô · 520 kcal", kcal: 520 },
    { name: "Cơm cá kho", portion: "1 phần · 540 kcal", kcal: 540 },
    { name: "Phở bò", portion: "1 tô · 350 kcal", kcal: 350 },
  ];

  const [selectedDishName, setSelectedDishName] = useState(options[0].name);

  const selectedOption = options.find((o) => o.name === selectedDishName) || options[0];

  return (
    <>
      <Header title="Đổi món bữa trưa" back={onBack} />
      <main className="screen pad swap-screen">
        <div className="current-plan">
          <span>MÓN HIỆN TẠI</span>
          <div>
            <span className="food-thumb t1">
              <Icon name="leaf" size={20} />
            </span>
            <div>
              <b>{currentDish.name}</b>
              <small>{currentDish.portion}</small>
            </div>
          </div>
        </div>

        <div className="search-title">
          <b>Chọn món thay thế</b>
        </div>

        <div
          className="swap-list"
          role="radiogroup"
          aria-label="Chọn món thay thế"
        >
          {options.map((opt, i) => {
            const isSelected = selectedDishName === opt.name;
            const diffKcal = opt.kcal - currentDish.kcal;
            const diffText =
              diffKcal > 0
                ? `+${diffKcal} kcal`
                : diffKcal < 0
                ? `${diffKcal} kcal`
                : "bằng kcal";

            return (
              <button
                key={opt.name}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={isSelected ? "selected" : ""}
                onClick={() => setSelectedDishName(opt.name)}
              >
                <span className={`food-thumb t${i + 1}`}>
                  <Icon name="leaf" size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <b>{opt.name}</b>
                    <span className="text-caption font-bold text-accent-700">
                      {diffText}
                    </span>
                  </div>
                  <small>{opt.portion}</small>
                </div>
                <i>{isSelected && <Icon name="check" size={16} />}</i>
              </button>
            );
          })}
        </div>

        <div className="sticky-actions space-y-2">
          <Button
            onClick={() =>
              onConfirmSwap(
                selectedOption.name,
                selectedOption.kcal,
                selectedOption.portion
              )
            }
          >
            Xác nhận đổi món
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </main>
    </>
  );
}

import React, { useState } from "react";
import { Food, PortionSize, PORTION_LABELS, gramsForPortion, nutritionFor, portionForGrams } from "../../data/foods";

export interface PortionPickerProps {
  food: Food;
  grams: number;
  onChange: (grams: number) => void;
}

const SIZES: PortionSize[] = ["small", "medium", "large"];
const PLATE: Record<PortionSize, number> = { small: 18, medium: 24, large: 30 };

/**
 * Khẩu phần theo cách sinh viên nói: Nhỏ / Vừa / Lớn (FR-03, PP2).
 * Gram chỉ là tùy chọn nâng cao (progressive disclosure).
 */
export default function PortionPicker({ food, grams, onChange }: PortionPickerProps) {
  const preset = portionForGrams(food, grams);
  const [showGrams, setShowGrams] = useState(preset === null);

  return (
    <div className="grid gap-2.5">
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Chọn khẩu phần">
        {SIZES.map((size) => {
          const g = gramsForPortion(food, size);
          const selected = preset === size;
          const kcal = nutritionFor(food, g).kcal;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(g)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[88px] rounded-lg border px-1 py-2 transition-colors cursor-pointer select-none ${
                selected
                  ? "border-brand-700 bg-brand-50 text-brand-text shadow-xs"
                  : "border-line bg-surface text-ink hover:bg-brand-50"
              }`}
            >
              <span
                aria-hidden="true"
                className={`rounded-full border-2 ${selected ? "border-brand-700 bg-brand-100" : "border-line-strong bg-canvas"}`}
                style={{ width: PLATE[size], height: PLATE[size] * 0.62 }}
              />
              <b className="text-body font-bold">{PORTION_LABELS[size]}</b>
              <span className="text-caption text-ink-muted tabular-nums">
                ≈ {g} g · {kcal} kcal
              </span>
            </button>
          );
        })}
      </div>

      {!showGrams ? (
        <button
          type="button"
          onClick={() => setShowGrams(true)}
          className="self-start min-h-[44px] text-label font-bold text-brand-text-soft underline underline-offset-4 cursor-pointer"
        >
          Chỉnh theo gram
        </button>
      ) : (
        <div className="stepper">
          <button type="button" onClick={() => onChange(Math.max(10, grams - 10))} aria-label="Giảm 10 gram">
            −
          </button>
          <div>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={2000}
              value={grams || ""}
              onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value))))}
              aria-label="Số gram"
            />
            <span>gram</span>
          </div>
          <button type="button" onClick={() => onChange(Math.min(2000, grams + 10))} aria-label="Tăng 10 gram">
            +
          </button>
        </div>
      )}
    </div>
  );
}

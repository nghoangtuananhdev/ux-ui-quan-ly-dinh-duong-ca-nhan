import React from "react";
import Icon from "../ui/Icon";

export interface WaterCardProps {
  water: number;
  waterGoal: number;
  onAddWater: (ml: number) => void;
  onRemoveWater: (ml: number) => void;
}

export default function WaterCard({
  water,
  waterGoal,
  onAddWater,
  onRemoveWater,
}: WaterCardProps) {
  const safeGoal = Math.max(waterGoal, 1);
  const pct = Math.min((water / safeGoal) * 100, 100);
  const isGoalReached = water >= safeGoal;

  // Render 8 cups (each 250ml up to goal)
  const totalCups = Math.max(Math.ceil(safeGoal / 250), 8);
  const filledCups = Math.floor(water / 250);

  return (
    <section
      role="progressbar"
      aria-valuenow={water}
      aria-valuemax={safeGoal}
      aria-label={`Lượng nước uống: ${water.toLocaleString("vi-VN")} trên ${safeGoal.toLocaleString("vi-VN")} ml`}
      className="rounded-lg bg-water-tint/70 border border-water/15 p-4 space-y-3.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-water text-white shadow-xs">
            <Icon name="water" size={22} />
          </span>
          <div>
            <span className="block text-caption font-semibold text-water uppercase tracking-wider">
              Nước uống hôm nay
            </span>
            <b className="text-metric font-bold text-ink">
              {water.toLocaleString("vi-VN")}{" "}
              <small className="text-body font-medium text-ink-muted">
                / {safeGoal.toLocaleString("vi-VN")} ml
              </small>
            </b>
          </div>
        </div>

        {isGoalReached && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-caption font-bold text-success">
            <Icon name="check" size={14} />
            Đạt mục tiêu
          </span>
        )}
      </div>

      {/* Cups visualization */}
      <div className="grid grid-cols-8 gap-1.5 py-1">
        {Array.from({ length: totalCups }).map((_, i) => {
          const isFilled = i < filledCups;
          return (
            <div
              key={i}
              className={`h-9 rounded flex items-center justify-center transition-colors ${
                isFilled
                  ? "bg-water text-white"
                  : "border-2 border-water/25 bg-surface/50 text-water/40"
              }`}
              title={`${(i + 1) * 250} ml`}
            >
              <Icon name="water" size={16} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => onRemoveWater(250)}
          disabled={water <= 0}
          aria-label="Giảm 250 ml nước"
          className="min-h-[44px] px-4 rounded-md border border-line bg-surface font-bold text-ink hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          − 250 ml
        </button>

        <button
          type="button"
          onClick={() => onAddWater(250)}
          aria-label="Thêm 250 ml nước"
          className="min-h-[44px] flex-1 rounded-md bg-water text-white font-bold hover:bg-water/90 shadow-sm active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <Icon name="plus" size={18} />
          +250 ml
        </button>
      </div>
    </section>
  );
}

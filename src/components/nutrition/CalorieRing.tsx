import React from "react";

export interface CalorieRingProps {
  value: number;
  total: number;
  size?: number;
}

export default function CalorieRing({
  value,
  total,
  size = 168,
}: CalorieRingProps) {
  const safeTotal = Math.max(total, 1);
  const remaining = safeTotal - value;
  const isOver = remaining < 0;
  const overAmount = Math.abs(remaining);

  const primaryPct = Math.min(value / safeTotal, 1);
  const overPct = isOver ? Math.min(overAmount / safeTotal, 1) : 0;

  // Circle metrics
  const radius = 78;
  const circumference = 2 * Math.PI * radius; // ~490.09
  const primaryOffset = circumference * (1 - primaryPct);
  const overOffset = circumference * (1 - overPct);

  const ariaLabel = isOver
    ? `Đã ăn ${value.toLocaleString("vi-VN")} trên ${safeTotal.toLocaleString("vi-VN")} kcal, vượt mục tiêu ${overAmount.toLocaleString("vi-VN")} kcal`
    : `Đã ăn ${value.toLocaleString("vi-VN")} trên ${safeTotal.toLocaleString("vi-VN")} kcal, còn ${remaining.toLocaleString("vi-VN")} kcal`;

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 168 168"
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx="84"
          cy="84"
          r={radius}
          strokeWidth="12"
          className="stroke-white/15 fill-none"
        />

        {/* Primary progress arc */}
        <circle
          cx="84"
          cy="84"
          r={radius}
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-accent-500 fill-none transition-[stroke-dashoffset] duration-400 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={primaryOffset}
        />

        {/* Over-goal secondary arc */}
        {isOver && (
          <circle
            cx="84"
            cy="84"
            r={radius}
            strokeWidth="12"
            strokeLinecap="round"
            className="stroke-accent-700 fill-none transition-[stroke-dashoffset] duration-400 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={overOffset}
          />
        )}
      </svg>

      <figcaption className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none px-2">
        <span className="text-metric-xl font-extrabold text-white tabular-nums tracking-tight">
          {isOver ? `+${overAmount.toLocaleString("vi-VN")}` : remaining.toLocaleString("vi-VN")}
        </span>
        <span className="text-caption font-medium text-white/75 mt-0.5">
          {isOver ? "kcal vượt mục tiêu" : "kcal còn lại"}
        </span>
      </figcaption>
    </figure>
  );
}

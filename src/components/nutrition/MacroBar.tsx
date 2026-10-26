import React from "react";

export type MacroType = "protein" | "carbs" | "fat";

export interface MacroBarProps {
  type: MacroType;
  label: string;
  value: number;
  total: number;
  onDark?: boolean;
  compact?: boolean;
}

export default function MacroBar({
  type,
  label,
  value,
  total,
  onDark = false,
  compact = false,
}: MacroBarProps) {
  const pct = Math.min(Math.max((value / (total || 1)) * 100, 0), 100);
  const isOver = value > total && total > 0;

  const colorStyles: Record<
    MacroType,
    { fill: string; trackLight: string; text: string; dot: string }
  > = {
    protein: {
      fill: "bg-protein",
      trackLight: "bg-protein-tint",
      text: "text-protein-text",
      dot: "bg-protein",
    },
    carbs: {
      fill: "bg-carbs",
      trackLight: "bg-carbs-tint",
      text: "text-carbs-text",
      dot: "bg-carbs",
    },
    fat: {
      fill: "bg-fat",
      trackLight: "bg-fat-tint",
      text: "text-fat-text",
      dot: "bg-fat",
    },
  };

  const style = colorStyles[type];

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemax={Math.round(total)}
      aria-label={`${label}: ${value}g trên mục tiêu ${total}g`}
      className="w-full space-y-1.5"
    >
      <div className="flex items-center justify-between text-label">
        <span
          className={`flex items-center gap-1.5 font-medium ${
            onDark ? "text-white/80" : "text-ink"
          }`}
        >
          <span className={`size-2 rounded-full ${style.dot}`} aria-hidden="true" />
          {label}
        </span>
        <span className={`tabular-nums font-bold ${onDark ? "text-white" : "text-ink"}`}>
          {Math.round(value)}
          <span className={`font-normal ${onDark ? "text-white/60" : "text-ink-muted"}`}>
            {" "}
            / {total} g
          </span>
          {isOver && (
            <span className="ml-1 text-caption text-accent-500 font-bold">
              (+{Math.round(value - total)})
            </span>
          )}
        </span>
      </div>

      <div
        className={`w-full overflow-hidden rounded-full ${
          compact ? "h-1.5" : "h-2"
        } ${onDark ? "bg-white/15" : style.trackLight}`}
      >
        <div
          style={{ width: `${pct}%` }}
          className={`h-full rounded-full transition-all duration-400 ease-out ${style.fill}`}
        />
      </div>
    </div>
  );
}

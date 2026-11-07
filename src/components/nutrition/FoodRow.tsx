import React from "react";
import Icon from "../ui/Icon";
import { LogEntry } from "../../data/foods";

export interface FoodRowProps {
  entry: LogEntry;
  onClick: () => void;
  onDelete?: () => void;
}

export default function FoodRow({ entry, onClick, onDelete }: FoodRowProps) {
  const metaText = `${entry.portion}${
    entry.protein !== undefined ? ` · Đ ${entry.protein}g` : ""
  }${entry.carbs !== undefined ? ` · TB ${entry.carbs}g` : ""}${
    entry.fat !== undefined ? ` · B ${entry.fat}g` : ""
  }`;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="group w-full min-h-[58px] p-3 rounded-lg border border-line bg-surface hover:border-brand-700/40 flex items-center justify-between gap-3 transition-colors cursor-pointer select-none"
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-text-soft">
          <Icon name="leaf" size={18} />
        </span>
        <div className="min-w-0">
          <b className="block text-body font-bold text-ink leading-snug break-words">{entry.name}</b>
          <span className="block text-caption text-ink-muted leading-snug">{metaText}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <strong className="text-body font-bold text-ink tabular-nums">
          {entry.kcal.toLocaleString("vi-VN")} kcal
        </strong>
        <Icon name="chevron" size={18} className="text-ink-muted group-hover:text-ink" />
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import Chip from "./Chip";

export interface ChipRowProps<K extends string> {
  items: readonly (readonly [K, string])[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  className?: string;
}

/**
 * Hàng chip lọc cuộn ngang: có khoảng đệm để viền focus không bị cắt,
 * mờ dần ở mép còn nội dung, và tự cuộn chip đang chọn vào giữa tầm nhìn.
 */
export default function ChipRow<K extends string>({ items, value, onChange, label, className = "" }: ChipRowProps<K>) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  useEffect(() => {
    const el = ref.current;
    const active = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!el || !active) return;
    const target = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [value]);

  const mask = `linear-gradient(90deg, ${edges.left ? "transparent 0, #000 28px" : "#000 0"}, ${edges.right ? "#000 calc(100% - 28px), transparent 100%" : "#000 100%"})`;

  return (
    <div
      ref={ref}
      onScroll={measure}
      role="group"
      aria-label={label}
      className={`chip-row -mx-4 flex gap-2 overflow-x-auto px-4 py-1.5 ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {items.map(([key, text]) => (
        <Chip key={key} selected={value === key} onClick={() => onChange(key)} className="shrink-0 whitespace-nowrap">
          {text}
        </Chip>
      ))}
    </div>
  );
}

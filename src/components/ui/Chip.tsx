import React from "react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Chip({
  selected = false,
  children,
  onClick,
  className = "",
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-label font-semibold transition-all duration-150 border cursor-pointer select-none active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-brand-700/40 focus-visible:outline-offset-2 ${
        selected
          ? "bg-brand-900 text-white border-brand-900 shadow-sm"
          : "bg-surface text-ink border-line hover:bg-brand-50 hover:border-brand-100"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

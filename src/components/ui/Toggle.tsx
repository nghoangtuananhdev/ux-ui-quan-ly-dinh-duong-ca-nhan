import React, { useId } from "react";

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ label, description, checked, onChange, disabled = false }: ToggleProps) {
  const id = useId();
  return (
    <div className={`flex items-center justify-between gap-4 min-h-[56px] py-2 ${disabled ? "opacity-50" : ""}`}>
      <label htmlFor={id} className="min-w-0 cursor-pointer select-none">
        <b className="block text-body font-bold text-ink">{label}</b>
        {description && <span className="block text-caption text-ink-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`hit-area relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-700/40 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${
          checked ? "bg-brand-700" : "bg-line-strong"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-[3px] left-[3px] size-[25px] rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
        <span className="sr-only">{checked ? "Đang bật" : "Đang tắt"}</span>
      </button>
    </div>
  );
}

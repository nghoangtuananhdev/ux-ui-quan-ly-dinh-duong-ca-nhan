import React, { useId } from "react";

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  error?: string;
  hint?: string;
}

export default function Field({
  label,
  unit,
  error,
  hint,
  value,
  onChange,
  className = "",
  id: providedId,
  ...rest
}: FieldProps) {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`grid gap-1.5 mb-3 ${className}`}>
      <label htmlFor={inputId} className="text-label font-bold text-ink flex items-center justify-between">
        <span>{label}</span>
      </label>

      <div
        className={`h-12 bg-surface rounded-md border flex items-center px-3.5 transition-colors focus-within:ring-2 focus-within:ring-brand-700/20 ${
          error ? "border-danger focus-within:border-danger" : "border-line focus-within:border-brand-700"
        }`}
      >
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className="w-full bg-transparent font-bold text-body text-ink outline-none"
          {...rest}
        />
        {unit && <span className="shrink-0 whitespace-nowrap text-label text-ink-muted ml-2 select-none">{unit}</span>}
      </div>

      {error && (
        <p id={errorId} className="text-caption text-danger m-0" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="text-caption text-ink-muted m-0">
          {hint}
        </p>
      )}
    </div>
  );
}

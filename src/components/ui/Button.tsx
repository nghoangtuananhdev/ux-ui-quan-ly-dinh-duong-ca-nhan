import React from "react";
import Icon, { IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "tonal";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold transition-all duration-150 select-none cursor-pointer focus-visible:outline-3 focus-visible:outline-brand-700/40 focus-visible:outline-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-md";

  const sizeClasses = size === "sm" ? "min-h-[40px] px-3 text-label gap-1.5" : "min-h-[48px] px-4 text-body gap-2";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-brand-900 text-white shadow-sm hover:bg-brand-800",
    secondary: "bg-surface text-brand-text border border-line hover:bg-brand-50",
    ghost: "bg-transparent text-brand-text-soft hover:bg-brand-100/50",
    danger: "bg-danger text-white hover:bg-danger/90",
    tonal: "bg-brand-100 text-brand-text hover:bg-brand-100/80",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}

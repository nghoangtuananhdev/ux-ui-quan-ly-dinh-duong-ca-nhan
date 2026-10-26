import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "hero" | "tinted" | "outline";
  className?: string;
}

export default function Card({
  children,
  variant = "default",
  className = "",
  ...rest
}: CardProps) {
  const variantStyles = {
    default: "bg-surface rounded-lg border border-line p-4 shadow-sm text-ink",
    hero: "bg-brand-900 text-white rounded-xl p-5 shadow-lg",
    tinted: "bg-brand-50 rounded-lg border border-brand-100 p-4 text-ink",
    outline: "bg-transparent rounded-lg border border-line p-4 text-ink",
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...rest}>
      {children}
    </div>
  );
}

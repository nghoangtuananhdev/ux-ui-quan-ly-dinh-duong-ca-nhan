import React from "react";
import Icon from "../ui/Icon";
import ThemeToggle from "./ThemeToggle";
import { initials, useSession } from "../../lib/auth";

export interface HeaderProps {
  title: string;
  back?: () => void;
  action?: React.ReactNode;
  onAvatarClick?: () => void;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span>
        <Icon name="leaf" size={20} />
      </span>
      <b>NutriDaily</b>
    </div>
  );
}

export default function Header({ title, back, action, onAvatarClick }: HeaderProps) {
  const session = useSession();
  return (
    <header className="app-header">
      {back ? (
        <button
          type="button"
          className="icon-btn text-ink"
          onClick={back}
          aria-label="Quay lại"
        >
          <Icon name="arrow" size={20} />
        </button>
      ) : (
        <Logo />
      )}

      <strong className={back ? "text-h2 font-bold text-ink" : "sr-only"}>
        {title}
      </strong>

      <div className="flex items-center justify-end gap-1">
        <ThemeToggle />
        {action}
        {!action && onAvatarClick && (
          <button
            type="button"
            className="avatar"
            onClick={onAvatarClick}
            aria-label={`Trang cá nhân của ${session?.name ?? "bạn"}`}
          >
            {initials(session?.name ?? "")}
          </button>
        )}
      </div>
    </header>
  );
}

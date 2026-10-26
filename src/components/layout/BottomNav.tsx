import React from "react";
import Icon, { IconName } from "../ui/Icon";

export type NavScreen = "today" | "diary" | "planner" | "progress";

export interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
  onOpenQuickLog: () => void;
  fabRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function BottomNav({
  currentScreen,
  onNavigate,
  onOpenQuickLog,
  fabRef,
}: BottomNavProps) {
  const leftTabs: { key: NavScreen; label: string; icon: IconName }[] = [
    { key: "today", label: "Hôm nay", icon: "home" },
    { key: "diary", label: "Nhật ký", icon: "book" },
  ];

  const rightTabs: { key: NavScreen; label: string; icon: IconName }[] = [
    { key: "planner", label: "Thực đơn", icon: "calendar" },
    { key: "progress", label: "Tiến độ", icon: "chart" },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30 h-16 bg-surface/95 backdrop-blur-md border-t border-line grid grid-cols-5 items-center px-1 pb-[env(safe-area-inset-bottom)]"
      aria-label="Thanh điều hướng chính"
    >
      {leftTabs.map((item) => {
        const isActive = currentScreen === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors select-none cursor-pointer ${
              isActive ? "text-brand-text-soft font-bold" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-brand-100" : ""
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
            </span>
            <span className="text-caption font-semibold leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Center FAB */}
      <div className="flex items-center justify-center relative">
        <button
          ref={fabRef}
          type="button"
          onClick={onOpenQuickLog}
          aria-label="Ghi nhận nhanh"
          aria-haspopup="dialog"
          className="size-14 -translate-y-3 rounded-full bg-brand-900 text-white shadow-lg hover:bg-brand-800 active:scale-95 transition-all flex items-center justify-center border-4 border-canvas focus-visible:outline-3 focus-visible:outline-brand-700/50 cursor-pointer"
        >
          <Icon name="plus" size={24} strokeWidth={2.4} />
        </button>
      </div>

      {rightTabs.map((item) => {
        const isActive = currentScreen === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center min-h-[44px] h-full gap-1 transition-colors select-none cursor-pointer ${
              isActive ? "text-brand-text-soft font-bold" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-brand-100" : ""
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
            </span>
            <span className="text-caption font-semibold leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

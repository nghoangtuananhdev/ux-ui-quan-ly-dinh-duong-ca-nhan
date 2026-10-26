import React from "react";
import Icon, { IconName } from "../ui/Icon";
import { Logo } from "./Header";
import Button from "../ui/Button";

export interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
  onOpenQuickLog: () => void;
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  onOpenQuickLog,
}: SidebarProps) {
  const navItems: { key: string; label: string; icon: IconName }[] = [
    { key: "today", label: "Hôm nay", icon: "home" },
    { key: "diary", label: "Nhật ký", icon: "book" },
    { key: "planner", label: "Thực đơn", icon: "calendar" },
    { key: "progress", label: "Tiến độ", icon: "chart" },
    { key: "profile", label: "Cá nhân", icon: "user" },
  ];

  return (
    <aside className="sticky top-0 h-screen w-60 border-r border-line bg-surface p-4 flex flex-col gap-6 select-none">
      <div className="pt-2 px-1">
        <Logo />
      </div>

      <Button
        variant="primary"
        icon="plus"
        onClick={onOpenQuickLog}
        className="w-full"
      >
        Ghi nhận
      </Button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={`w-full h-11 px-3 rounded-md flex items-center gap-3 text-body font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-brand-50 text-brand-text font-bold"
                  : "text-ink-muted hover:bg-canvas hover:text-ink"
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? "text-brand-text-soft" : "text-ink-muted"}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-line pt-4 px-1">
        <div className="flex items-center gap-3">
          <span className="avatar">AN</span>
          <div className="min-w-0">
            <b className="block text-body font-bold text-ink truncate">An Nguyễn</b>
            <span className="text-caption text-ink-muted">Tài khoản dùng thử</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

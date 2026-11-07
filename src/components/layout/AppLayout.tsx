import React, { useState, useRef } from "react";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { Logo } from "./Header";
import Icon from "../ui/Icon";
import QuickLogSheet from "../nutrition/QuickLogSheet";
import { Food, MealLabel } from "../../data/foods";
import { isPrototype } from "../../config/mode";
import { useClock } from "../../lib/clock";

export interface AppLayoutProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  children: React.ReactNode;
  onAddFood: () => void;
  onAddWater: (ml: number) => void;
  onGoPlanner: () => void;
  recentFoods: Food[];
  onQuickLogFood: (food: Food) => void;
  quickLogMeal: MealLabel;
}


export default function AppLayout({
  currentScreen,
  onNavigate,
  children,
  onAddFood,
  onAddWater,
  onGoPlanner,
  recentFoods,
  onQuickLogFood,
  quickLogMeal,
}: AppLayoutProps) {
  const { now } = useClock();
  // Toggle full desktop view vs phone stage
  const [isFullAppView, setIsFullAppView] = useState(!isPrototype);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const showNav = ["today", "diary", "planner", "progress"].includes(currentScreen);

  // If in full desktop mode (or widescreen on app mode)
  if (isFullAppView) {
    return (
      <div className="min-h-screen bg-canvas flex">
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(s) => {
            onNavigate(s);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenQuickLog={() => setIsQuickLogOpen(true)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top header for desktop view with stage switcher */}
          {isPrototype && (
            <div className="bg-brand-950 text-white px-6 py-2.5 flex items-center justify-between text-caption">
              <span className="font-medium opacity-90">
                Chế độ xem ứng dụng đầy đủ (Desktop)
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFullAppView(false)}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
                >
                  Quay lại khung điện thoại (390×844)
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 max-w-[1080px] w-full mx-auto p-6 md:p-8">
            {children}
          </div>
        </div>

        <QuickLogSheet
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onAddFood={onAddFood}
          onAddWater={onAddWater}
          onGoPlanner={onGoPlanner}
          recentFoods={recentFoods}
          onQuickLogFood={onQuickLogFood}
          meal={quickLogMeal}
        />
      </div>
    );
  }

  // Prototype Stage mode (Phone Shell)
  return (
    <div className="prototype-stage">
      <div className="phone-shell">
        <div className="status-bar">
          <span>{now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="status-icons">● ◒</span>
        </div>

        <div className="phone-content" ref={contentRef}>
          {children}
        </div>

        {showNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(s) => {
              onNavigate(s);
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            fabRef={fabRef}
          />
        )}

        <QuickLogSheet
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onAddFood={onAddFood}
          onAddWater={onAddWater}
          onGoPlanner={onGoPlanner}
          recentFoods={recentFoods}
          onQuickLogFood={onQuickLogFood}
          triggerRef={fabRef}
          meal={quickLogMeal}
        />
      </div>
    </div>
  );
}

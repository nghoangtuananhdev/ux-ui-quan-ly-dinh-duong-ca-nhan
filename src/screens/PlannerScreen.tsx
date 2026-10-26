import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import { PlanDish } from "../data/foods";

export interface PlannerScreenProps {
  planDishes: PlanDish[];
  onNavigate: (screen: string) => void;
  onSwapClick: (dish: PlanDish) => void;
  onLogDishToDiary?: (dish: PlanDish) => void;
}

export default function PlannerScreen({
  planDishes,
  onNavigate,
  onSwapClick,
  onLogDishToDiary,
}: PlannerScreenProps) {
  // Day index 4 is Friday 20th (tomorrow in prototype)
  const [selectedDayIndex, setSelectedDayIndex] = useState(4);

  const days = [
    { name: "T2", date: "16" },
    { name: "T3", date: "17" },
    { name: "T4", date: "18" },
    { name: "T5", date: "19", isToday: true },
    { name: "T6", date: "20" },
    { name: "T7", date: "21" },
    { name: "CN", date: "22" },
  ];

  const lunchDish = planDishes.find((p) => p.meal === "Trưa") || planDishes[1];

  const totalPlanKcal = planDishes.reduce((sum, d) => sum + d.kcal, 0);

  return (
    <>
      <Header
        title="Thực đơn"
        action={
          <button
            type="button"
            className="icon-btn"
            aria-label="Xem lịch thực đơn"
          >
            <Icon name="calendar" size={20} />
          </button>
        }
        onAvatarClick={() => onNavigate("profile")}
      />

      <main className="screen pad with-nav">
        {/* Week strip */}
        <div
          className="week-strip mb-4"
          role="tablist"
          aria-label="Chọn ngày trong tuần"
        >
          {days.map((d, i) => {
            const isSelected = selectedDayIndex === i;
            return (
              <button
                key={d.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "active" : ""}
                onClick={() => setSelectedDayIndex(i)}
              >
                <span>{d.name}</span>
                <b>{d.date}</b>
                {d.isToday && <i title="Hôm nay" />}
              </button>
            );
          })}
        </div>

        {/* Intro */}
        <div className="plan-intro">
          <div>
            <span>THỨ SÁU, 20/06</span>
            <h1>Kế hoạch ngày mai</h1>
          </div>
          <div className="plan-kcal">
            <span>Dự kiến</span>
            <b>{totalPlanKcal.toLocaleString("vi-VN")} kcal</b>
          </div>
        </div>

        <div className="status-explain">
          <span className="shrink-0 pt-0.5">
            <Icon name="calendar" size={18} />
          </span>
          <p>
            <b>Đã lên kế hoạch</b> không đồng nghĩa với đã ăn. Món chỉ vào nhật
            ký khi bạn chủ động ghi.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3">
          {planDishes.map((dish, i) => {
            const isLunch = dish.meal === "Trưa" || i === 1;
            return (
              <section className="plan-card" key={dish.id || dish.meal}>
                <div className="plan-card-top">
                  <span>Bữa {dish.meal.toLowerCase()}</span>
                  <em>Đã lên kế hoạch</em>
                </div>

                <div className="plan-dish">
                  <span className={`food-thumb t${i % 4}`}>
                    <Icon name="leaf" size={20} />
                  </span>
                  <div>
                    <b className="text-body font-bold text-ink">{dish.name}</b>
                    <small className="text-caption text-ink-muted">
                      {dish.portion}
                    </small>
                  </div>
                </div>

                {isLunch && (
                  <button
                    type="button"
                    onClick={() => onSwapClick(dish)}
                    className="hover:bg-brand-50 transition-colors"
                  >
                    <Icon name="refresh" size={16} />
                    <span>Đổi món</span>
                  </button>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}

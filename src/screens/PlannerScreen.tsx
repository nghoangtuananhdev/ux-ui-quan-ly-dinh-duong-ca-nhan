import React from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { MEALS, PlanDish, TODAY, mealTitle } from "../data/foods";
import { PlanSettings, dayCost, dayKcal } from "../lib/plan";
import { addDays, dayNumber, formatPrice, longLabel, weekdayLong, weekdayShort } from "../lib/date";

export interface PlannerScreenProps {
  planDishes: PlanDish[];
  settings: PlanSettings;
  kcalGoal: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onNavigate: (screen: string) => void;
  onSwapClick: (dish: PlanDish) => void;
  onLogDish: (dish: PlanDish) => void;
  onUnlogDish: (dish: PlanDish) => void;
  onBuildPlan: () => void;
}

export default function PlannerScreen({
  planDishes,
  settings,
  kcalGoal,
  selectedDate,
  onSelectDate,
  onNavigate,
  onSwapClick,
  onLogDish,
  onUnlogDish,
  onBuildPlan,
}: PlannerScreenProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(TODAY, i));
  const dishes = MEALS.map((m) => planDishes.find((p) => p.date === selectedDate && p.meal === m)).filter(
    (d): d is PlanDish => Boolean(d),
  );
  const cost = dayCost(dishes);
  const kcal = dayKcal(dishes);
  const budget = settings.budgetPerDay;
  const overBudget = cost > budget;
  const isToday = selectedDate === TODAY;
  const title = isToday ? "Thực đơn hôm nay" : selectedDate === addDays(TODAY, 1) ? "Kế hoạch ngày mai" : `Kế hoạch ${weekdayLong(selectedDate)}`;

  return (
    <>
      <Header
        title="Thực đơn"
        action={
          <button type="button" className="icon-btn" onClick={onBuildPlan} aria-label="Tạo thực đơn tuần theo ngân sách">
            <Icon name="sliders" size={20} />
          </button>
        }
        onAvatarClick={() => onNavigate("profile")}
      />

      <main className="screen pad with-nav">
        <div className="week-strip mb-4" role="tablist" aria-label="Chọn ngày trong 7 ngày tới">
          {days.map((d) => {
            const isSelected = selectedDate === d;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${longLabel(d)}${d === TODAY ? ", hôm nay" : ""}`}
                className={isSelected ? "active" : ""}
                onClick={() => onSelectDate(d)}
              >
                <span>{weekdayShort(d)}</span>
                <b>{dayNumber(d)}</b>
                {d === TODAY && <i title="Hôm nay" />}
              </button>
            );
          })}
        </div>

        <div className="plan-intro">
          <div>
            <span>{longLabel(selectedDate).toUpperCase()}</span>
            <h1>{title}</h1>
          </div>
          <div className="plan-kcal">
            <span>Dự kiến</span>
            <b>{kcal.toLocaleString("vi-VN")} kcal</b>
          </div>
        </div>

        {dishes.length === 0 ? (
          <div className="empty-state !py-10">
            <span>
              <Icon name="calendar" size={28} />
            </span>
            <h2>Chưa có thực đơn cho ngày này</h2>
            <p>Chọn ngân sách và món không ăn, NutriDaily sẽ gợi ý thực đơn 7 ngày. Bạn đổi được bất kỳ món nào.</p>
            <Button icon="sparkle" onClick={onBuildPlan}>
              Tạo thực đơn tuần
            </Button>
          </div>
        ) : (
          <>
            {/* Thanh ngân sách ngày (FR-06) */}
            <section className="mb-3 rounded-lg border border-line bg-surface p-3.5" aria-label="Ngân sách ngày">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-label font-bold text-ink">
                  <Icon name="wallet" size={18} className="text-brand-text-soft" />
                  Chi phí dự kiến
                </span>
                <span className="text-label font-bold tabular-nums text-ink">
                  {formatPrice(cost)} <span className="font-normal text-ink-muted">/ {formatPrice(budget)}</span>
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-brand-50"
                role="progressbar"
                aria-valuenow={cost}
                aria-valuemax={budget}
                aria-label={`Chi phí ${cost} nghìn trên ngân sách ${budget} nghìn`}
              >
                <div className="h-full rounded-full bg-brand-700 transition-all" style={{ width: `${Math.min(100, (cost / Math.max(budget, 1)) * 100)}%` }} />
              </div>
              <p className={`m-0 mt-1.5 text-caption ${overBudget ? "text-accent-700 font-bold" : "text-ink-muted"}`}>
                {overBudget
                  ? `Vượt ${formatPrice(cost - budget)} so với ngân sách — đổi một món để tiết kiệm hơn nếu bạn muốn.`
                  : `Còn ${formatPrice(budget - cost)} trong ngân sách · năng lượng ${Math.round((kcal / kcalGoal) * 100)}% mục tiêu`}
              </p>
            </section>

            <div className="status-explain">
              <span className="shrink-0 pt-0.5">
                <Icon name="calendar" size={18} />
              </span>
              <p>
                <b>Đã lên kế hoạch</b> không đồng nghĩa với đã ăn. {isToday ? "Chạm “Đã ăn” để ghi vào nhật ký." : "Món chỉ vào nhật ký khi bạn chủ động ghi."}
              </p>
            </div>

            <div className="space-y-3">
              {dishes.map((dish, i) => {
                const logged = dish.status === "logged";
                return (
                  <section className="rounded-lg border border-line bg-surface p-3.5" key={dish.id}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-label font-bold text-ink">{mealTitle(dish.meal)}</span>
                      <em
                        className={`not-italic rounded-full px-2 py-0.5 text-caption font-bold ${
                          logged ? "bg-brand-100 text-brand-text" : "bg-canvas text-ink-muted"
                        }`}
                      >
                        {logged ? "✓ Đã ghi vào nhật ký" : "Đã lên kế hoạch"}
                      </em>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`food-thumb t${i % 4}`}>
                        <Icon name="leaf" size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <b className="block text-body font-bold text-ink">{dish.name}</b>
                        <small className="block text-caption text-ink-muted">
                          {dish.portion} · {dish.kcal} kcal · ≈ {formatPrice(dish.price)}
                        </small>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {isToday ? (
                        logged ? (
                          <Button size="sm" variant="secondary" icon="undo" onClick={() => onUnlogDish(dish)}>
                            Bỏ ghi
                          </Button>
                        ) : (
                          <Button size="sm" variant="tonal" icon="check" onClick={() => onLogDish(dish)}>
                            Đã ăn
                          </Button>
                        )
                      ) : (
                        <span className="flex items-center text-caption text-ink-muted px-1">Ghi được vào ngày đó</span>
                      )}
                      <Button size="sm" variant="secondary" icon="refresh" disabled={logged} onClick={() => onSwapClick(dish)}>
                        Đổi món
                      </Button>
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="mt-4 text-caption text-ink-muted text-center">
              Gợi ý theo: {settings.goal} · {formatPrice(settings.budgetPerDay)}/ngày
              {settings.exclusions.length > 0 && ` · bỏ ${settings.exclusions.length} nhóm món`}
            </p>
          </>
        )}
      </main>
    </>
  );
}

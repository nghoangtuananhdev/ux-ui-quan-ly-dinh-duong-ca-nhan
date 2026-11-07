import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import MacroBar from "../components/nutrition/MacroBar";
import { TODAY } from "../data/foods";
import { Goals } from "../state/useNutritionStore";
import { addDays, shortDate, weekdayShort } from "../lib/date";

export interface ProgressScreenProps {
  dayTotals: (date: string) => { kcal: number; count: number };
  waterFor: (date: string) => number;
  goals: Goals;
  onNavigate: (screen: string) => void;
}

export const WEEK_START = "2025-06-16"; // Thứ Hai của tuần chứa TODAY

export function weekSummary(dayTotals: ProgressScreenProps["dayTotals"], waterFor: ProgressScreenProps["waterFor"]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(WEEK_START, i);
    const t = dayTotals(date);
    return {
      iso: date,
      label: weekdayShort(date),
      date: shortDate(date),
      kcal: t.kcal,
      water: waterFor(date),
      count: t.count,
      isToday: date === TODAY,
      isFuture: date > TODAY,
    };
  });
  const loggedDays = days.filter((d) => d.count > 0);
  const avgKcal = loggedDays.length ? Math.round(loggedDays.reduce((s, d) => s + d.kcal, 0) / loggedDays.length) : 0;
  const waterDays = days.filter((d) => d.water > 0);
  const avgWater = waterDays.length ? Math.round(waterDays.reduce((s, d) => s + d.water, 0) / waterDays.length / 50) * 50 : 0;
  return { days, loggedDays, avgKcal, avgWater, waterDays };
}

export default function ProgressScreen({ dayTotals, waterFor, goals, onNavigate }: ProgressScreenProps) {
  const { days, loggedDays, avgKcal, avgWater, waterDays } = weekSummary(dayTotals, waterFor);
  const pastDays = days.filter((d) => !d.isFuture).length;
  const [selectedDayIndex, setSelectedDayIndex] = useState(days.findIndex((d) => d.isToday));
  const diffPct = avgKcal ? Math.round(((avgKcal - goals.kcal) / goals.kcal) * 100) : 0;
  const summary =
    loggedDays.length === 0
      ? "Tuần này bạn chưa ghi ngày nào. Bắt đầu từ bữa tiếp theo là được."
      : `Tuần này bạn đã ghi ${loggedDays.length}/${pastDays} ngày. Trung bình ${avgKcal.toLocaleString("vi-VN")} kcal/ngày — ${
          Math.abs(diffPct) <= 10 ? "gần mục tiêu" : diffPct < 0 ? "thấp hơn mục tiêu một chút" : "cao hơn mục tiêu một chút"
        }.`;

  const selectedDay = days[selectedDayIndex];

  // SVG Chart Metrics
  const chartWidth = 320;
  const chartHeight = 160;
  const maxScaleKcal = Math.max(goals.kcal, 2400);

  // Goal line Y coord
  const goalY = chartHeight - (goals.kcal / maxScaleKcal) * (chartHeight - 30);

  return (
    <>
      <Header
        title="Tiến độ"
        onAvatarClick={() => onNavigate("profile")}
      />

      <main className="screen pad with-nav">
        <div className="eyebrow">TUẦN NÀY · 16 – 22 THÁNG 6</div>
        <h1>Tiến độ của bạn</h1>
        <div className="mt-2 mb-4 flex gap-3 rounded-lg bg-brand-50 p-3.5" role="status">
          <Icon name="sparkle" size={20} className="shrink-0 text-brand-text-soft" />
          <p className="m-0 text-label text-brand-text">{summary}</p>
        </div>

        {/* Chart Card */}
        <section className="chart-card mb-4">
          <div className="chart-head mb-3">
            <div>
              <span>Năng lượng đã ghi</span>
              <b>Trung bình {avgKcal.toLocaleString("vi-VN")} kcal</b>
            </div>
            <span className="text-caption font-bold text-ink-muted">kcal</span>
          </div>

          {/* SVG Weekly Bar Chart */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[160px] overflow-visible"
              role="img"
              aria-label={`Biểu đồ năng lượng tuần, trung bình ${avgKcal} kcal`}
            >
              {/* Y Axis reference line (Goal) */}
              <line
                x1="0"
                y1={goalY}
                x2={chartWidth}
                y2={goalY}
                stroke="currentColor"
                className="text-accent-700"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <text
                x={chartWidth - 4}
                y={goalY - 4}
                textAnchor="end"
                className="text-[11px] fill-accent-700 font-bold"
              >
                Mục tiêu {goals.kcal}
              </text>

              {/* 7 Bars */}
              {days.map((d, i) => {
                const colWidth = 24;
                const spacing = (chartWidth - 7 * colWidth) / 8;
                const x = spacing + i * (colWidth + spacing);
                const hasData = d.count > 0;
                const barHeight = hasData
                  ? (d.kcal / maxScaleKcal) * (chartHeight - 30)
                  : 4;
                const y = chartHeight - 24 - barHeight;
                const isSelected = selectedDayIndex === i;

                return (
                  <g
                    key={d.label}
                    onClick={() => setSelectedDayIndex(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedDayIndex(i);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${d.label} ${d.date}: ${d.isFuture ? "chưa đến" : d.count ? `${d.kcal} kcal` : "chưa ghi"}`}
                    className="cursor-pointer outline-none focus-visible:[&>rect:nth-child(2)]:stroke-brand-700 focus-visible:[&>rect:nth-child(2)]:stroke-2"
                  >
                    {/* Background hit area */}
                    <rect
                      x={x - 4}
                      y="0"
                      width={colWidth + 8}
                      height={chartHeight}
                      fill="transparent"
                    />

                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={colWidth}
                      height={barHeight}
                      rx="4"
                      className={`transition-all duration-300 ${
                        !hasData
                          ? "fill-line-strong"
                          : isSelected
                          ? "fill-brand-800"
                          : "fill-brand-700/80 hover:fill-brand-700"
                      }`}
                    />

                    {/* Day label */}
                    <text
                      x={x + colWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className={`text-[11px] font-bold select-none ${
                        isSelected ? "fill-brand-text" : "fill-ink-muted"
                      }`}
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="chart-caption">
            Đã ghi <b>{loggedDays.length} ngày</b>. Ngày chưa ghi chỉ hiện cột xám — không sao cả.
          </p>
        </section>

        {/* Weekly Water Card */}
        <section className="weekly-card mb-4">
          <div>
            <span className="water-icon">
              <Icon name="water" size={20} />
            </span>
            <div>
              <span>Nước uống trung bình</span>
              <b>{avgWater.toLocaleString("vi-VN")} ml / ngày</b>
            </div>
          </div>
          <small>{waterDays.length ? `Dựa trên ${waterDays.length} ngày có ghi nước` : "Tuần này chưa ghi nước"} · mục tiêu {goals.waterMl.toLocaleString("vi-VN")} ml</small>
        </section>

        {/* Selected Day Detail */}
        <h2 className="section-h2">
          Chi tiết ngày {selectedDay.label} ({selectedDay.date})
        </h2>
        {selectedDay.isFuture ? (
          <p className="muted mb-4">Ngày này chưa đến.</p>
        ) : (
        <div className="stat-list mb-4">
          <div>
            <span>Năng lượng</span>
            <b>{selectedDay.kcal.toLocaleString("vi-VN")} kcal</b>
          </div>
          <div>
            <span>Nước uống</span>
            <b>{selectedDay.water.toLocaleString("vi-VN")} ml</b>
          </div>
          <div>
            <span>Món đã ghi</span>
            <b>{selectedDay.count} món</b>
          </div>
        </div>
        )}
      </main>
    </>
  );
}

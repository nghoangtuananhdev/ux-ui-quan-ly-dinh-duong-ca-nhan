import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import MacroBar from "../components/nutrition/MacroBar";
import { LogEntry, TODAY } from "../data/foods";
import { Goals } from "../state/useNutritionStore";

export interface ProgressScreenProps {
  meals: LogEntry[];
  water: number;
  goals: Goals;
  onNavigate: (screen: string) => void;
}

export default function ProgressScreen({
  meals,
  water,
  goals,
  onNavigate,
}: ProgressScreenProps) {
  // Weekly data (T2 to CN: 16 to 22 June)
  const todayMeals = meals.filter((m) => m.date === TODAY);
  const todayKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0);

  // Index 3 is Thursday 19th
  const [selectedDayIndex, setSelectedDayIndex] = useState(3);

  const days = [
    { label: "T2", date: "16/06", kcal: 1450, water: 1500, count: 3 },
    { label: "T3", date: "17/06", kcal: 1820, water: 1750, count: 4 },
    { label: "T4", date: "18/06", kcal: 0, water: 0, count: 0 },
    { label: "T5", date: "19/06", kcal: todayKcal, water: water, count: todayMeals.length, isToday: true },
    { label: "T6", date: "20/06", kcal: 1590, water: 1400, count: 3 },
    { label: "T7", date: "21/06", kcal: 0, water: 0, count: 0 },
    { label: "CN", date: "22/06", kcal: 0, water: 0, count: 0 },
  ];

  const loggedDays = days.filter((d) => d.kcal > 0);
  const avgKcal = loggedDays.length
    ? Math.round(loggedDays.reduce((sum, d) => sum + d.kcal, 0) / loggedDays.length)
    : 0;

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
        {/* Period control */}
        <div className="period-control mb-4">
          <button type="button" aria-label="Tuần trước">
            <Icon name="arrow" size={18} />
          </button>
          <div>
            <b>Tuần này</b>
            <span>16 – 22 tháng 6</span>
          </div>
          <button type="button" aria-label="Tuần sau">
            <Icon name="chevron" size={18} />
          </button>
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
                stroke="#b4621f"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <text
                x={chartWidth - 4}
                y={goalY - 4}
                textAnchor="end"
                className="text-[10px] fill-accent-700 font-bold"
              >
                Mục tiêu {goals.kcal}
              </text>

              {/* 7 Bars */}
              {days.map((d, i) => {
                const colWidth = 24;
                const spacing = (chartWidth - 7 * colWidth) / 8;
                const x = spacing + i * (colWidth + spacing);
                const hasData = d.kcal > 0;
                const barHeight = hasData
                  ? (d.kcal / maxScaleKcal) * (chartHeight - 30)
                  : 4;
                const y = chartHeight - 24 - barHeight;
                const isSelected = selectedDayIndex === i;

                return (
                  <g
                    key={d.label}
                    onClick={() => setSelectedDayIndex(i)}
                    className="cursor-pointer"
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
                        isSelected ? "fill-brand-900" : "fill-ink-muted"
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
            Bạn đã ghi nhật ký <b>{loggedDays.length}/7 ngày</b>. Những ngày còn
            lại chưa có dữ liệu.
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
              <b>1.550 ml / ngày ghi</b>
            </div>
          </div>
          <small>Dựa trên {loggedDays.length} ngày có dữ liệu</small>
        </section>

        {/* Selected Day Detail */}
        <h2 className="section-h2">
          Chi tiết ngày {selectedDay.label} ({selectedDay.date})
        </h2>
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
      </main>
    </>
  );
}

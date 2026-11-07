import React from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Toggle from "../components/ui/Toggle";
import { Reminders, ReminderMeal } from "../state/useNutritionStore";
import { mealPhrase, mealTitle } from "../data/foods";

export interface RemindersScreenProps {
  reminders: Reminders;
  onChange: (next: Reminders) => void;
  onBack: () => void;
}

const MEAL_ORDER: ReminderMeal[] = ["Sáng", "Trưa", "Tối"];

/** Màn 13 — Nhắc nhở do người dùng kiểm soát (FR-08, PP5). Mặc định tắt. */
export default function RemindersScreen({ reminders, onChange, onBack }: RemindersScreenProps) {
  const r = reminders;

  return (
    <>
      <Header title="Nhắc nhở" back={onBack} />
      <main className="screen pad">
        <div className="mb-4 flex gap-3 rounded-lg bg-brand-50 p-3.5">
          <Icon name="bell" size={20} className="shrink-0 text-brand-text-soft" />
          <p className="m-0 text-label text-brand-text">
            Bạn quyết định khi nào được nhắc. Mặc định mọi nhắc nhở đều <b>tắt</b>, và lời nhắc không bao giờ trách bạn đã quên.
          </p>
        </div>

        <section className="profile-card !p-4" aria-label="Nhắc ghi bữa ăn">
          <Toggle
            label="Nhắc ghi bữa ăn"
            description="Một lời nhắc nhẹ vào giờ ăn"
            checked={r.meal.enabled}
            onChange={(v) => onChange({ ...r, meal: { ...r.meal, enabled: v } })}
          />
          {r.meal.enabled && (
            <div className="mt-1 grid gap-2 border-t border-line pt-3">
              {MEAL_ORDER.map((m) => (
                <label key={m} className="flex items-center justify-between gap-3 min-h-[48px]">
                  <span className="text-body text-ink">{mealTitle(m)}</span>
                  <input
                    type="time"
                    value={r.meal.times[m]}
                    onChange={(e) => onChange({ ...r, meal: { ...r.meal, times: { ...r.meal.times, [m]: e.target.value } } })}
                    className="h-12 rounded-md border border-line bg-surface px-3 text-body font-bold text-ink tabular-nums"
                    aria-label={`Giờ nhắc ${mealPhrase(m)}`}
                  />
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="profile-card !p-4" aria-label="Nhắc uống nước">
          <Toggle
            label="Nhắc uống nước"
            description="Trong khung 8:00 – 21:00"
            checked={r.water.enabled}
            onChange={(v) => onChange({ ...r, water: { ...r.water, enabled: v } })}
          />
          {r.water.enabled && (
            <div className="mt-1 border-t border-line pt-3">
              <span className="block text-label font-bold text-ink mb-2">Tần suất</span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tần suất nhắc uống nước">
                {([2, 3, 4] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    role="radio"
                    aria-checked={r.water.everyHours === h}
                    onClick={() => onChange({ ...r, water: { ...r.water, everyHours: h } })}
                    className={`min-h-[44px] rounded-md border text-label font-bold cursor-pointer ${
                      r.water.everyHours === h ? "bg-brand-900 text-white border-brand-900" : "bg-surface text-ink border-line hover:bg-brand-50"
                    }`}
                  >
                    Mỗi {h} giờ
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="profile-card !p-4">
          <Toggle
            label="Không nhắc vào cuối tuần"
            description="Thứ Bảy và Chủ Nhật được yên tĩnh"
            checked={r.quietWeekend}
            onChange={(v) => onChange({ ...r, quietWeekend: v })}
          />
        </section>

        <p className="mt-3 text-caption text-ink-muted text-center">Thay đổi được lưu tự động.</p>
      </main>
    </>
  );
}

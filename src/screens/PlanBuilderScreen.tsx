import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon, { IconName } from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import Toggle from "../components/ui/Toggle";
import { EXCLUSION_LABELS, Exclusion } from "../data/foods";
import { PlanGoal, PlanSettings } from "../lib/plan";
import { formatPrice } from "../lib/date";

export interface PlanBuilderScreenProps {
  initial: PlanSettings;
  onBack: () => void;
  onGenerate: (settings: PlanSettings) => void;
}

const GOALS: { title: PlanGoal; desc: string; icon: IconName }[] = [
  { title: "Ăn uống cân bằng", desc: "Đủ năng lượng, đa dạng món", icon: "leaf" },
  { title: "Tiết kiệm tối đa", desc: "Ưu tiên món rẻ trong ngân sách", icon: "wallet" },
  { title: "Nhiều đạm hơn", desc: "Ưu tiên món giàu chất đạm", icon: "target" },
];

/** Màn 14 — Tạo thực đơn tuần theo ngân sách (FR-06, Kịch bản 2). */
export default function PlanBuilderScreen({ initial, onBack, onGenerate }: PlanBuilderScreenProps) {
  const [settings, setSettings] = useState<PlanSettings>(initial);
  const [loading, setLoading] = useState(false);
  const set = (patch: Partial<PlanSettings>) => setSettings((s) => ({ ...s, ...patch }));
  const toggleExclusion = (x: Exclusion) =>
    set({ exclusions: settings.exclusions.includes(x) ? settings.exclusions.filter((e) => e !== x) : [...settings.exclusions, x] });

  return (
    <>
      <Header title="Tạo thực đơn tuần" back={onBack} />
      <main className="screen pad setup-screen">
        <p className="muted">3 lựa chọn, 1 chạm. Bạn có thể đổi bất kỳ món nào sau đó.</p>

        <h2 className="mt-5 mb-2">Bạn muốn ưu tiên điều gì?</h2>
        <div className="choice-list" role="radiogroup" aria-label="Mục tiêu thực đơn">
          {GOALS.map((g) => {
            const isSelected = settings.goal === g.title;
            return (
              <button
                key={g.title}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => set({ goal: g.title })}
                className={`choice ${isSelected ? "selected" : ""}`}
              >
                <span className="choice-icon">
                  <Icon name={g.icon} size={22} />
                </span>
                <span>
                  <b>{g.title}</b>
                  <small>{g.desc}</small>
                </span>
                <i>{isSelected && <Icon name="check" size={16} />}</i>
              </button>
            );
          })}
        </div>

        <div className="mt-6 mb-2 flex items-end justify-between">
          <h2>Ngân sách mỗi ngày</h2>
          <b className="text-metric font-bold text-brand-text tabular-nums">{formatPrice(settings.budgetPerDay)}</b>
        </div>
        <input
          type="range"
          min={30}
          max={150}
          step={5}
          value={settings.budgetPerDay}
          onChange={(e) => set({ budgetPerDay: Number(e.target.value) })}
          className="w-full h-11 accent-[var(--color-brand-700)] cursor-pointer"
          aria-label="Ngân sách mỗi ngày, nghìn đồng"
          aria-valuetext={`${settings.budgetPerDay} nghìn đồng mỗi ngày`}
        />
        <div className="flex justify-between text-caption text-ink-muted">
          <span>30k</span>
          <span>~{formatPrice(Math.round(settings.budgetPerDay / 3))}/bữa chính</span>
          <span>150k</span>
        </div>

        <h2 className="mt-6 mb-1">Món bạn không ăn</h2>
        <p className="muted !text-[13px] mb-2">Không bắt buộc — chạm để bỏ khỏi gợi ý.</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(EXCLUSION_LABELS) as Exclusion[]).map((x) => (
            <Chip key={x} selected={settings.exclusions.includes(x)} onClick={() => toggleExclusion(x)}>
              {settings.exclusions.includes(x) && <Icon name="close" size={14} className="mr-1" />}
              {EXCLUSION_LABELS[x]}
            </Chip>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-line bg-surface px-3.5">
          <Toggle
            label="Có tự nấu"
            description="Gợi ý thêm món đơn giản nấu ở phòng trọ/ký túc xá"
            checked={settings.homeCook}
            onChange={(v) => set({ homeCook: v })}
          />
        </div>

        <div className="space-y-2 mt-6">
          <Button
            icon="sparkle"
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => onGenerate(settings), 700);
            }}
          >
            {loading ? "Đang gợi ý thực đơn…" : "Tạo thực đơn 7 ngày"}
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </main>
    </>
  );
}

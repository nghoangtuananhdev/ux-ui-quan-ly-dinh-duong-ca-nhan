import React, { useState } from "react";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import Field from "../components/ui/Field";
import Chip from "../components/ui/Chip";
import Toggle from "../components/ui/Toggle";
import { EXCLUSION_LABELS, Exclusion } from "../data/foods";
import { validateGoals } from "../lib/goals";
import { formatPrice } from "../lib/date";
import BodyForm, { BodyDraft, bodyFromDraft, draftFromBody } from "../components/nutrition/BodyForm";
import { Body, suggestedKcal } from "../lib/body";
import { givenName } from "../lib/auth";

export type HabitsInput = { budgetPerDay: number; exclusions: Exclusion[]; remindMeals: boolean };

export interface SetupScreenProps {
  onBack: () => void;
  onSave: (goal: number, waterGoal: number, selectedGoal: string, habits: HabitsInput | null, body: Body | null) => void;
  onSkip: () => void;
  initialGoal?: number;
  initialWaterGoal?: number;
  initialSelectedGoal?: string;
  initialBudget?: number;
  initialBody?: Body | null;
  userName?: string;
}

const GOALS = [
  { title: "Ăn uống cân bằng", desc: "Xây dựng thói quen bền vững", icon: "leaf" as const },
  { title: "Duy trì cân nặng", desc: "Theo sát mức năng lượng mỗi ngày", icon: "target" as const },
  { title: "Theo dõi dinh dưỡng", desc: "Hiểu rõ hơn về bữa ăn", icon: "chart" as const },
];

/** Màn 02 — Thiết lập 3 bước, cả hai bước đều bỏ qua được (UX-03). */
export default function SetupScreen({
  onBack,
  onSave,
  onSkip,
  initialGoal = 2000,
  initialWaterGoal = 2000,
  initialSelectedGoal = "Ăn uống cân bằng",
  initialBudget = 80,
  initialBody = null,
  userName,
}: SetupScreenProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [bodyDraft, setBodyDraft] = useState<BodyDraft>(draftFromBody(initialBody));
  const [bodySubmitted, setBodySubmitted] = useState(false);
  const body = bodyFromDraft(bodyDraft);
  const [selectedGoal, setSelectedGoal] = useState(initialSelectedGoal);
  const [draftGoal, setDraftGoal] = useState(String(initialGoal));
  const [draftWaterGoal, setDraftWaterGoal] = useState(String(initialWaterGoal));
  const [submitted, setSubmitted] = useState(false);
  const [budget, setBudget] = useState(initialBudget);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [remindMeals, setRemindMeals] = useState(false);
  const v = validateGoals(draftGoal, draftWaterGoal);

  if (step === 0) {
    return (
      <>
        <Header title="Về bạn" back={onBack} />
        <main className="screen pad setup-screen">
          <div className="step-label">BƯỚC 1 / 3</div>
          <h1>{userName ? `Chào ${givenName(userName)}, cho mình biết một chút về bạn` : "Cho mình biết một chút về bạn"}</h1>
          <p className="muted">Chiều cao, cân nặng giúp tính BMI và gợi ý món phù hợp hơn. Chỉ mình bạn xem được.</p>
          <div className="mt-4">
            <BodyForm draft={bodyDraft} onChange={setBodyDraft} showErrors={bodySubmitted} />
          </div>
          <div className="space-y-2 mt-4">
            <Button
              onClick={() => {
                setBodySubmitted(true);
                if (!body) return;
                setDraftGoal(String(suggestedKcal(body)));
                setStep(1);
              }}
            >
              Tiếp tục
            </Button>
            <button type="button" className="skip w-full text-center" onClick={() => setStep(1)}>
              Để sau
            </button>
          </div>
        </main>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <Header title="Thói quen ăn uống" back={() => setStep(1)} />
        <main className="screen pad setup-screen">
          <div className="step-label">BƯỚC 3 / 3 · KHÔNG BẮT BUỘC</div>
          <h1>Ăn uống của bạn thế nào?</h1>
          <p className="muted">Giúp gợi ý thực đơn vừa túi tiền. Bạn có thể bỏ qua.</p>

          <div className="mt-5 mb-2 flex items-end justify-between">
            <b className="text-body font-bold text-ink">Ngân sách ăn mỗi ngày</b>
            <b className="text-metric font-bold text-brand-text tabular-nums">{formatPrice(budget)}</b>
          </div>
          <input
            type="range"
            min={30}
            max={150}
            step={5}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-11 accent-[var(--color-brand-700)] cursor-pointer"
            aria-label="Ngân sách mỗi ngày, nghìn đồng"
          />

          <b className="mt-4 mb-2 block text-body font-bold text-ink">Món bạn không ăn</b>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EXCLUSION_LABELS) as Exclusion[]).map((x) => (
              <Chip
                key={x}
                selected={exclusions.includes(x)}
                onClick={() => setExclusions((e) => (e.includes(x) ? e.filter((y) => y !== x) : [...e, x]))}
              >
                {EXCLUSION_LABELS[x]}
              </Chip>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-line bg-surface px-3.5">
            <Toggle
              label="Nhắc mình ghi bữa ăn"
              description="Sáng 7:30 · Trưa 12:15 · Tối 19:00 — đổi được trong Cá nhân"
              checked={remindMeals}
              onChange={setRemindMeals}
            />
          </div>

          <div className="space-y-2 mt-6">
            <Button onClick={() => onSave(v.kcal, v.water, selectedGoal, { budgetPerDay: budget, exclusions, remindMeals }, body)}>
              Hoàn tất
            </Button>
            <button type="button" className="skip w-full text-center" onClick={() => onSave(v.kcal, v.water, selectedGoal, null, body)}>
              Bỏ qua bước này
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Thiết lập mục tiêu" back={() => setStep(0)} />
      <main className="screen pad setup-screen">
        <div className="step-label">BƯỚC 2 / 3</div>
        <h1>Mục tiêu của bạn là gì?</h1>
        <p className="muted">Chọn điều bạn muốn tập trung. Bạn có thể thay đổi bất cứ lúc nào.</p>

        <div className="choice-list my-4" role="radiogroup" aria-label="Chọn mục tiêu chính">
          {GOALS.map((g) => {
            const isSelected = selectedGoal === g.title;
            return (
              <button
                key={g.title}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedGoal(g.title)}
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

        <div className="section-title">
          <b className="text-body font-bold text-ink">Mục tiêu mỗi ngày (tham khảo)</b>
        </div>

        <Field
          label="Năng lượng"
          unit="kcal"
          value={draftGoal}
          onChange={(e) => setDraftGoal(e.target.value)}
          inputMode="numeric"
          type="number"
          error={submitted ? v.errors.kcal : undefined}
          hint={v.hint ?? (body ? `Gợi ý từ chiều cao, cân nặng của bạn: ${suggestedKcal(body).toLocaleString("vi-VN")} kcal.` : "Chưa chắc? Giữ 2.000 kcal, bạn chỉnh sau được.")}
        />
        <Field
          label="Nước uống"
          unit="ml"
          value={draftWaterGoal}
          onChange={(e) => setDraftWaterGoal(e.target.value)}
          inputMode="numeric"
          type="number"
          error={submitted ? v.errors.water : undefined}
        />

        <div className="space-y-2 mt-4">
          <Button
            onClick={() => {
              setSubmitted(true);
              if (v.ok) setStep(2);
            }}
          >
            Tiếp tục
          </Button>
          <button type="button" className="skip w-full text-center" onClick={() => (body ? onSave(v.kcal, v.water, selectedGoal, null, body) : onSkip())}>
            Bỏ qua, dùng mục tiêu mặc định
          </button>
        </div>
      </main>
    </>
  );
}

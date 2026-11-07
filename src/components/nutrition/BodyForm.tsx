import React from "react";
import Field from "../ui/Field";
import Icon from "../ui/Icon";
import { ACTIVITY_LABEL, Activity, BMI_HINT, BMI_LABEL, Body, Sex, bmiBand, bmiOf, suggestedKcal, validateBody } from "../../lib/body";

export type BodyDraft = { height: string; weight: string; age: string; sex: Sex; activity: Activity };

export const draftFromBody = (b: Body | null): BodyDraft => ({
  height: b ? String(b.heightCm) : "",
  weight: b ? String(b.weightKg) : "",
  age: b ? String(b.age) : "",
  sex: b?.sex ?? "unspecified",
  activity: b?.activity ?? "low",
});

/** Trả về Body hợp lệ hoặc null. */
export function bodyFromDraft(d: BodyDraft): Body | null {
  const v = validateBody(d);
  return v.ok ? { heightCm: v.h, weightKg: v.w, age: v.a, sex: d.sex, activity: d.activity } : null;
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="mb-3">
      <span className="block text-label font-bold text-ink mb-1.5">{label}</span>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }} role="radiogroup" aria-label={label}>
        {options.map(([k, text]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={value === k}
            onClick={() => onChange(k)}
            className={`min-h-[44px] rounded-md border px-1 text-label font-bold cursor-pointer ${
              value === k ? "bg-brand-900 text-white border-brand-900" : "bg-surface text-ink border-line hover:bg-brand-50"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BmiCard({ body, compact = false }: { body: Body; compact?: boolean }) {
  const bmi = bmiOf(body);
  const band = bmiBand(bmi);
  // Vị trí trên thang 15–32
  const pos = Math.min(100, Math.max(0, ((bmi - 15) / 17) * 100));
  return (
    <section className="rounded-lg border border-line bg-surface p-4" aria-label="Chỉ số BMI">
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="block text-caption font-bold uppercase tracking-wider text-ink-muted">BMI</span>
          <b className="text-metric-xl font-extrabold text-ink tabular-nums">{bmi.toLocaleString("vi-VN")}</b>
        </div>
        <span className="text-right text-label font-bold text-brand-text">{BMI_LABEL[band]}</span>
      </div>
      <div className="relative mt-3 h-2 rounded-full" style={{ background: "linear-gradient(90deg, var(--color-carbs) 0 20%, var(--color-brand-700) 20% 47%, var(--color-accent-500) 47% 59%, var(--color-protein) 59% 100%)" }} aria-hidden="true">
        <span className="absolute -top-1 size-4 -translate-x-1/2 rounded-full border-2 border-surface bg-ink shadow-sm" style={{ left: `${pos}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-caption text-ink-muted tabular-nums" aria-hidden="true">
        <span>18,5</span>
        <span>23</span>
        <span>25</span>
      </div>
      {!compact && (
        <>
          <p className="m-0 mt-3 flex gap-2 text-label text-ink">
            <Icon name="sparkle" size={16} className="shrink-0 mt-0.5 text-brand-text-soft" />
            {BMI_HINT[band]}
          </p>
          <p className="m-0 mt-2 text-caption text-ink-muted">
            Năng lượng tham khảo: <b className="text-ink">{suggestedKcal(body).toLocaleString("vi-VN")} kcal/ngày</b>. BMI theo ngưỡng cho người châu Á, chỉ để tham khảo — không phải chẩn đoán.
          </p>
        </>
      )}
    </section>
  );
}

export default function BodyForm({ draft, onChange, showErrors }: { draft: BodyDraft; onChange: (d: BodyDraft) => void; showErrors: boolean }) {
  const v = validateBody(draft);
  const set = (patch: Partial<BodyDraft>) => onChange({ ...draft, ...patch });
  const preview = bodyFromDraft(draft);
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Chiều cao" unit="cm" type="number" inputMode="numeric" value={draft.height} onChange={(e) => set({ height: e.target.value })} error={showErrors ? v.errors.height : undefined} placeholder="165" />
        <Field label="Cân nặng" unit="kg" type="number" inputMode="decimal" value={draft.weight} onChange={(e) => set({ weight: e.target.value })} error={showErrors ? v.errors.weight : undefined} placeholder="55" />
      </div>
      <Field label="Tuổi" unit="tuổi" type="number" inputMode="numeric" value={draft.age} onChange={(e) => set({ age: e.target.value })} error={showErrors ? v.errors.age : undefined} placeholder="20" />
      <Segmented<Sex> label="Giới tính" value={draft.sex} onChange={(sex) => set({ sex })} options={[["female", "Nữ"], ["male", "Nam"], ["unspecified", "Không nêu"]]} />
      <Segmented<Activity> label="Mức vận động" value={draft.activity} onChange={(activity) => set({ activity })} options={(Object.keys(ACTIVITY_LABEL) as Activity[]).map((k) => [k, ACTIVITY_LABEL[k]])} />
      {preview && <BmiCard body={preview} />}
    </div>
  );
}

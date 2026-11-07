import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon, { IconName } from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { Goals } from "../state/useNutritionStore";
import { validateGoals } from "../lib/goals";
import { Session, initials } from "../lib/auth";
import { Body, suggestedKcal } from "../lib/body";
import BodyForm, { BmiCard, bodyFromDraft, draftFromBody } from "../components/nutrition/BodyForm";
import Modal from "../components/ui/Modal";

export interface ProfileScreenProps {
  goals: Goals;
  session: Session;
  body: Body | null;
  onSaveBody: (body: Body) => void;
  onSignOut: () => void;
  remindersOn: boolean;
  onSaveGoals: (kcal: number, waterMl: number) => void;
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export default function ProfileScreen({ goals, session, body, onSaveBody, onSignOut, remindersOn, onSaveGoals, onNavigate, onBack }: ProfileScreenProps) {
  const [editingBody, setEditingBody] = useState(!body);
  const [bodyDraft, setBodyDraft] = useState(draftFromBody(body));
  const [bodySubmitted, setBodySubmitted] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [draftGoal, setDraftGoal] = useState(String(goals.kcal));
  const [draftWaterGoal, setDraftWaterGoal] = useState(String(goals.waterMl));
  const [submitted, setSubmitted] = useState(false);
  const v = validateGoals(draftGoal, draftWaterGoal);

  const handleSave = () => {
    setSubmitted(true);
    if (v.ok) onSaveGoals(v.kcal, v.water);
  };

  const rows: { key: string; label: string; desc: string; icon: IconName }[] = [
    { key: "reminders", label: "Nhắc nhở", desc: remindersOn ? "Đang bật" : "Đang tắt", icon: "bell" },
    { key: "planBuilder", label: "Thực đơn & ngân sách", desc: "Tạo lại thực đơn tuần", icon: "wallet" },
    { key: "privacy", label: "Quyền riêng tư & dữ liệu", desc: "Xem dữ liệu đã lưu, xóa tài khoản", icon: "shield" },
  ];

  return (
    <>
      <Header title="Cá nhân" back={onBack} />
      <main className="screen pad with-nav">
        <div className="profile-head">
          <span>{initials(session.name)}</span>
          <div className="min-w-0">
            <h1 className="break-words">{session.name}</h1>
            <p className="break-all">{session.email}</p>
          </div>
        </div>

        <section className="profile-card" aria-label="Chỉ số cơ thể">
          <div className="section-heading">
            <div>
              <h2>Chỉ số cơ thể</h2>
              <span>Dùng để tính BMI và gợi ý món</span>
            </div>
            {body && !editingBody && (
              <Button size="sm" variant="tonal" fullWidth={false} icon="edit" onClick={() => setEditingBody(true)}>
                Sửa
              </Button>
            )}
          </div>
          {body && !editingBody ? (
            <>
              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Chiều cao", `${body.heightCm} cm`],
                  ["Cân nặng", `${body.weightKg.toLocaleString("vi-VN")} kg`],
                  ["Tuổi", `${body.age}`],
                ].map(([k, val]) => (
                  <div key={k} className="rounded-md bg-canvas py-2">
                    <span className="block text-caption text-ink-muted">{k}</span>
                    <b className="text-body font-bold text-ink tabular-nums">{val}</b>
                  </div>
                ))}
              </div>
              <BmiCard body={body} />
              {Math.abs(suggestedKcal(body) - goals.kcal) >= 100 && (
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => onSaveGoals(suggestedKcal(body), goals.waterMl)}
                >
                  Dùng mức gợi ý {suggestedKcal(body).toLocaleString("vi-VN")} kcal/ngày
                </Button>
              )}
            </>
          ) : (
            <>
              <BodyForm draft={bodyDraft} onChange={setBodyDraft} showErrors={bodySubmitted} />
              <div className="mt-3 grid gap-2">
                <Button
                  onClick={() => {
                    setBodySubmitted(true);
                    const b = bodyFromDraft(bodyDraft);
                    if (!b) return;
                    onSaveBody(b);
                    setEditingBody(false);
                  }}
                >
                  Lưu chỉ số
                </Button>
                {body && (
                  <Button variant="ghost" onClick={() => { setBodyDraft(draftFromBody(body)); setEditingBody(false); }}>
                    Hủy
                  </Button>
                )}
              </div>
            </>
          )}
        </section>

        <section className="profile-card">
          <div className="section-heading">
            <div>
              <h2>Mục tiêu mỗi ngày</h2>
              <span>Con số tham khảo, đổi bất cứ lúc nào</span>
            </div>
            <Icon name="target" size={22} className="text-brand-text-soft" />
          </div>

          <Field
            label="Năng lượng"
            unit="kcal"
            value={draftGoal}
            onChange={(e) => setDraftGoal(e.target.value)}
            inputMode="numeric"
            type="number"
            error={submitted ? v.errors.kcal : undefined}
            hint={v.hint}
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

          <Button onClick={handleSave} className="mt-3">
            Lưu thay đổi
          </Button>

          <div className="mt-4 pt-3 border-t border-line text-caption text-ink-muted flex items-center justify-between gap-2">
            <span>Mục tiêu dinh dưỡng ước tính</span>
            <span className="font-bold text-ink text-right">
              Đạm {goals.proteinG} g · Tinh bột {goals.carbsG} g · Béo {goals.fatG} g
            </span>
          </div>
        </section>

        <div className="grid gap-2 mb-2">
          {rows.map((r) => (
            <button key={r.key} type="button" className="settings-row" onClick={() => onNavigate(r.key)}>
              <span>
                <Icon name={r.icon} size={20} className="text-brand-text-soft" />
                <span className="text-left">
                  <b className="block">{r.label}</b>
                  <small className="block text-caption text-ink-muted">{r.desc}</small>
                </span>
              </span>
              <Icon name="chevron" size={18} className="text-ink-muted" />
            </button>
          ))}
        </div>

        <Button variant="secondary" icon="arrow" className="mt-4" onClick={() => setConfirmSignOut(true)}>
          Đăng xuất
        </Button>
      </main>
      <Modal isOpen={confirmSignOut} onClose={() => setConfirmSignOut(false)} title="Đăng xuất?">
        <div className="space-y-3">
          <p className="text-body text-ink-muted">Nhật ký của bạn vẫn còn đó. Hẹn gặp lại bạn bữa sau!</p>
          <Button onClick={onSignOut}>Đăng xuất</Button>
          <Button variant="secondary" onClick={() => setConfirmSignOut(false)}>Ở lại</Button>
        </div>
      </Modal>
    </>
  );
}

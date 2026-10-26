import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { Goals } from "../state/useNutritionStore";

export interface ProfileScreenProps {
  goals: Goals;
  onSaveGoals: (kcal: number, waterMl: number) => void;
  onResetData: () => void;
  onBack?: () => void;
}

export default function ProfileScreen({
  goals,
  onSaveGoals,
  onResetData,
  onBack,
}: ProfileScreenProps) {
  const [draftGoal, setDraftGoal] = useState(String(goals.kcal));
  const [draftWaterGoal, setDraftWaterGoal] = useState(String(goals.waterMl));
  const [error, setError] = useState("");

  const handleSave = () => {
    const a = Number(draftGoal);
    const b = Number(draftWaterGoal);
    if (!a || !b || a < 500 || b < 500) {
      setError("Vui lòng nhập giá trị hợp lệ (từ 500 trở lên).");
      return;
    }
    setError("");
    onSaveGoals(a, b);
  };

  return (
    <>
      <Header title="Cá nhân" back={onBack} />
      <main className="screen pad with-nav">
        {/* Profile Head */}
        <div className="profile-head">
          <span>AN</span>
          <div>
            <h1>An Nguyễn</h1>
            <p>Tài khoản dùng thử</p>
          </div>
        </div>

        {/* Goals form */}
        <section className="profile-card">
          <div className="section-heading">
            <div>
              <h2>Mục tiêu mỗi ngày</h2>
              <span>Có thể điều chỉnh</span>
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
          />

          <Field
            label="Nước uống"
            unit="ml"
            value={draftWaterGoal}
            onChange={(e) => setDraftWaterGoal(e.target.value)}
            inputMode="numeric"
            type="number"
          />

          {error && <p className="error" role="alert">{error}</p>}

          <Button onClick={handleSave} className="mt-3">
            Lưu thay đổi
          </Button>

          {/* Derived macro goals */}
          <div className="mt-4 pt-3 border-t border-line text-caption text-ink-muted flex items-center justify-between">
            <span>Mục tiêu macro ước tính:</span>
            <span className="font-bold text-ink">
              Đ {goals.proteinG}g · TB {goals.carbsG}g · B {goals.fatG}g
            </span>
          </div>
        </section>

        {/* Reset sample data */}
        <button
          type="button"
          className="settings-row"
          onClick={() => {
            onResetData();
            setDraftGoal("2000");
            setDraftWaterGoal("2000");
            setError("");
          }}
        >
          <span>
            <Icon name="refresh" size={20} className="text-brand-text-soft" />
            <b>Đặt lại dữ liệu mẫu</b>
          </span>
          <Icon name="chevron" size={18} className="text-ink-muted" />
        </button>
      </main>
    </>
  );
}

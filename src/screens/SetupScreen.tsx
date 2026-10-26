import React, { useState } from "react";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import Field from "../components/ui/Field";

export interface SetupScreenProps {
  onBack: () => void;
  onSave: (goal: number, waterGoal: number, selectedGoal: string) => void;
  onSkip: () => void;
  initialGoal?: number;
  initialWaterGoal?: number;
  initialSelectedGoal?: string;
}

export default function SetupScreen({
  onBack,
  onSave,
  onSkip,
  initialGoal = 2000,
  initialWaterGoal = 2000,
  initialSelectedGoal = "Ăn uống cân bằng",
}: SetupScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState(initialSelectedGoal);
  const [draftGoal, setDraftGoal] = useState(String(initialGoal));
  const [draftWaterGoal, setDraftWaterGoal] = useState(String(initialWaterGoal));
  const [error, setError] = useState("");

  const handleSave = () => {
    const a = Number(draftGoal);
    const b = Number(draftWaterGoal);
    if (!a || !b || a < 500 || b < 500) {
      setError("Vui lòng nhập số hợp lệ, từ 500 trở lên.");
      return;
    }
    setError("");
    onSave(a, b, selectedGoal);
  };

  const goals = [
    {
      title: "Ăn uống cân bằng",
      desc: "Xây dựng thói quen bền vững",
      icon: "leaf" as const,
    },
    {
      title: "Duy trì cân nặng",
      desc: "Theo sát mức năng lượng mỗi ngày",
      icon: "target" as const,
    },
    {
      title: "Theo dõi dinh dưỡng",
      desc: "Hiểu rõ hơn về bữa ăn",
      icon: "chart" as const,
    },
  ];

  return (
    <>
      <Header title="Thiết lập mục tiêu" back={onBack} />
      <main className="screen pad setup-screen">
        <div className="step-label">BƯỚC 1 / 1</div>
        <h1>Mục tiêu của bạn là gì?</h1>
        <p className="muted">
          Chọn điều bạn muốn tập trung. Bạn có thể thay đổi bất cứ lúc nào.
        </p>

        <div className="choice-list my-4" role="radiogroup" aria-label="Chọn mục tiêu chính">
          {goals.map((g) => {
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
          <b className="text-body font-bold text-ink">Mục tiêu mỗi ngày</b>
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

        <div className="space-y-2 mt-4">
          <Button onClick={handleSave}>Lưu và tiếp tục</Button>
          <button
            type="button"
            className="skip w-full text-center"
            onClick={onSkip}
          >
            Bỏ qua, dùng mục tiêu mẫu
          </button>
        </div>
      </main>
    </>
  );
}

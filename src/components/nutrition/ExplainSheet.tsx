import React from "react";
import Sheet from "../ui/Sheet";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { DATA_SOURCE_NOTE } from "../../data/foods";

export type ExplainTopic = "protein" | "carbs" | "fat" | "kcal" | "estimate";

const CONTENT: Record<
  Exclude<ExplainTopic, "estimate">,
  { title: string; what: string; why: string; foods: string; dot: string }
> = {
  kcal: {
    title: "Năng lượng (kcal) là gì?",
    what: "Lượng năng lượng cơ thể nhận được từ bữa ăn. Mục tiêu mỗi ngày chỉ là con số tham khảo bạn tự đặt.",
    why: "Vượt hoặc thiếu một ngày là bình thường. Điều quan trọng là xu hướng cả tuần.",
    foods: "Mọi món đều có năng lượng; món chiên, nhiều dầu, đồ uống ngọt thường cao hơn bạn nghĩ.",
    dot: "bg-accent-500",
  },
  protein: {
    title: "Chất đạm (protein) là gì?",
    what: "Nhóm chất giúp xây dựng và giữ cơ, giúp no lâu hơn sau bữa ăn.",
    why: "Sinh viên ăn ngoài thường thiếu đạm ở bữa sáng và bữa phụ.",
    foods: "Trứng, ức gà, cá, đậu hũ, sữa đậu nành, thịt nạc.",
    dot: "bg-protein",
  },
  carbs: {
    title: "Tinh bột (carbs) là gì?",
    what: "Nguồn năng lượng chính cho não và cơ thể trong ngày học.",
    why: "Không cần kiêng tinh bột; chỉ cần cân bằng lượng cơm, bún, bánh mì với rau và đạm.",
    foods: "Cơm, bún, phở, bánh mì, yến mạch, khoai, trái cây.",
    dot: "bg-carbs",
  },
  fat: {
    title: "Chất béo (fat) là gì?",
    what: "Cần cho hấp thu vitamin và cảm giác no. Mỗi gram chất béo có nhiều năng lượng hơn đạm và tinh bột.",
    why: "Món chiên, nhiều nước sốt, đồ uống có kem thường chứa nhiều chất béo.",
    foods: "Dầu ăn, thịt có mỡ, đậu phộng, bơ, trứng.",
    dot: "bg-fat",
  },
};

export interface ExplainSheetProps {
  topic: ExplainTopic | null;
  onClose: () => void;
}

export default function ExplainSheet({ topic, onClose }: ExplainSheetProps) {
  if (!topic) return null;

  if (topic === "estimate") {
    return (
      <Sheet isOpen onClose={onClose} title="Vì sao là số ước tính?">
        <div className="grid gap-3 text-body text-ink">
          <p className="m-0">
            Món ăn ngoài không có nhãn dinh dưỡng và mỗi quán nấu một kiểu, nên NutriDaily dùng{" "}
            <b>giá trị trung bình cho khẩu phần phổ biến</b>.
          </p>
          <p className="m-0 text-ink-muted text-label">{DATA_SOURCE_NOTE}</p>
          <p className="m-0">Hãy xem đây là la bàn, không phải cân điện tử.</p>
          <Button variant="tonal" onClick={onClose}>
            Đã hiểu
          </Button>
        </div>
      </Sheet>
    );
  }

  const c = CONTENT[topic];
  return (
    <Sheet isOpen onClose={onClose} title={c.title}>
      <div className="grid gap-3">
        {[
          ["Là gì", c.what],
          ["Cần biết", c.why],
          ["Có nhiều trong", c.foods],
        ].map(([label, text]) => (
          <div key={label} className="flex gap-3 rounded-lg bg-canvas p-3">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
            <div>
              <b className="block text-label font-bold text-ink">{label}</b>
              <p className="m-0 text-body text-ink">{text}</p>
            </div>
          </div>
        ))}
        <p className="m-0 flex items-start gap-2 text-caption text-ink-muted">
          <Icon name="info" size={16} className="shrink-0 mt-0.5" />
          Thông tin phổ thông, không thay thế tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng.
        </p>
        <Button variant="tonal" onClick={onClose}>
          Đã hiểu
        </Button>
      </div>
    </Sheet>
  );
}

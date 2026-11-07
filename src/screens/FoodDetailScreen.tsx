import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import PortionPicker from "../components/nutrition/PortionPicker";
import { ExplainTopic } from "../components/nutrition/ExplainSheet";
import { Food, MEALS, MealLabel, nutritionFor, portionLabel, mealPhrase } from "../data/foods";
import { formatPrice } from "../lib/date";

export interface FoodDetailScreenProps {
  food: Food;
  initialGrams?: number;
  initialMeal?: MealLabel;
  isEditing?: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onSave: (grams: number, meal: MealLabel) => void;
  onDelete?: () => void;
  onEditCustom?: () => void;
  onExplain: (topic: ExplainTopic) => void;
}

export default function FoodDetailScreen({
  food,
  initialGrams,
  initialMeal = "Trưa",
  isEditing = false,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSave,
  onDelete,
  onEditCustom,
  onExplain,
}: FoodDetailScreenProps) {
  const [grams, setGrams] = useState(initialGrams ?? food.servingGrams);
  const [selectedMeal, setSelectedMeal] = useState<MealLabel>(initialMeal);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const n = nutritionFor(food, grams);
  const isValid = grams > 0 && grams <= 2000;

  return (
    <>
      <Header
        title={isEditing ? "Chỉnh sửa món" : "Chi tiết món"}
        back={onBack}
        action={
          <>
            <button
              type="button"
              className={`icon-btn ${isFavorite ? "text-accent-700" : "text-ink-muted"}`}
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Bỏ khỏi món yêu thích" : "Lưu vào món yêu thích"}
            >
              <Icon name="star" size={20} filled={isFavorite} />
            </button>
            {food.kind === "custom" && onEditCustom && (
              <button type="button" className="icon-btn text-ink-muted" onClick={onEditCustom} aria-label="Sửa món tự đặt này">
                <Icon name="edit" size={20} />
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                className="icon-btn danger-icon text-danger"
                onClick={() => setShowDeleteModal(true)}
                aria-label="Xóa món ăn này"
              >
                <Icon name="trash" size={20} />
              </button>
            )}
          </>
        }
      />

      <main className="screen pad food-detail">
        <div className="food-hero">
          <span>
            <Icon name="leaf" size={32} />
          </span>
        </div>

        <div className="food-title">
          <div>
            <h1>{food.name}</h1>
            <p>
              {portionLabel(food, grams)} · ≈ {formatPrice(n.price)}
            </p>
          </div>
          <strong>
            {n.kcal}
            <small> kcal</small>
          </strong>
        </div>

        <button
          type="button"
          onClick={() => onExplain("estimate")}
          className="mb-3 inline-flex min-h-[32px] items-center gap-1.5 rounded-full bg-accent-100 px-3 text-caption font-bold text-accent-700 cursor-pointer"
        >
          <Icon name="info" size={14} />
          Số liệu ước tính · vì sao?
        </button>

        <div className="macro-grid">
          {(
            [
              ["protein", "Đạm", n.protein, "text-protein-text"],
              ["carbs", "Tinh bột", n.carbs, "text-carbs-text"],
              ["fat", "Chất béo", n.fat, "text-fat-text"],
            ] as const
          ).map(([topic, label, value, color]) => (
            <button key={topic} type="button" onClick={() => onExplain(topic)} className="cursor-pointer text-left" aria-label={`${label} ${value} gam, xem giải thích`}>
              <span className={`${color} font-semibold`}>{label}</span>
              <b>{value} g</b>
            </button>
          ))}
        </div>

        <div className="detail-section">
          <label className="text-label font-bold text-ink">Khẩu phần</label>
          <PortionPicker food={food} grams={grams} onChange={setGrams} />
          {!isValid && (
            <p className="m-0 text-caption text-danger" role="alert">
              Khẩu phần cần từ 1 đến 2.000 g.
            </p>
          )}
        </div>

        <div className="detail-section">
          <label className="text-label font-bold text-ink">Ghi vào bữa</label>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Chọn bữa ăn">
            {MEALS.map((m) => {
              const isSelected = selectedMeal === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedMeal(m)}
                  className={`min-h-[44px] rounded-md font-bold text-label border transition-colors cursor-pointer select-none ${
                    isSelected ? "bg-brand-900 text-white border-brand-900 shadow-xs" : "bg-surface text-ink border-line hover:bg-brand-50"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Button disabled={!isValid} onClick={() => onSave(grams, selectedMeal)}>
            {isEditing ? "Lưu thay đổi" : `Thêm vào ${mealPhrase(selectedMeal)}`} · {n.kcal} kcal
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </main>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xóa món đã ghi?">
        <div className="space-y-4">
          <span className="danger-round">
            <Icon name="trash" size={24} />
          </span>
          <p className="text-body text-ink-muted">
            {food.name} sẽ bị xóa khỏi nhật ký và tổng năng lượng của ngày. Bạn vẫn có thể hoàn tác ngay sau đó.
          </p>
          <div className="space-y-2">
            <Button
              variant="danger"
              onClick={() => {
                setShowDeleteModal(false);
                onDelete?.();
              }}
            >
              Xóa món
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Giữ lại
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

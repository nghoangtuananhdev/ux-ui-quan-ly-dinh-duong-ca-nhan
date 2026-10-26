import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Food, MealLabel } from "../data/foods";

export interface FoodDetailScreenProps {
  food: Food;
  initialGrams?: number;
  initialMeal?: MealLabel;
  isEditing?: boolean;
  onBack: () => void;
  onSave: (grams: number, meal: MealLabel) => void;
  onDelete?: () => void;
}

export default function FoodDetailScreen({
  food,
  initialGrams = 150,
  initialMeal = "Trưa",
  isEditing = false,
  onBack,
  onSave,
  onDelete,
}: FoodDetailScreenProps) {
  const [grams, setGrams] = useState(initialGrams);
  const [selectedMeal, setSelectedMeal] = useState<MealLabel>(initialMeal);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const calculatedKcal = Math.round((food.kcal * grams) / 100);
  const calculatedProtein = ((food.protein * grams) / 100).toFixed(1);
  const calculatedCarbs = ((food.carbs * grams) / 100).toFixed(1);
  const calculatedFat = ((food.fat * grams) / 100).toFixed(1);

  const isValid = grams > 0 && grams <= 2000;

  const mealOptions: MealLabel[] = ["Sáng", "Trưa", "Tối", "Bữa phụ"];

  return (
    <>
      <Header
        title={isEditing ? "Chỉnh sửa món" : "Chi tiết món"}
        back={onBack}
        action={
          isEditing ? (
            <button
              type="button"
              className="icon-btn danger-icon text-danger"
              onClick={() => setShowDeleteModal(true)}
              aria-label="Xóa món ăn này"
            >
              <Icon name="trash" size={20} />
            </button>
          ) : undefined
        }
      />

      <main className="screen pad food-detail">
        {/* Food Hero */}
        <div className="food-hero">
          <span>
            <Icon name="leaf" size={32} />
          </span>
        </div>

        <div className="food-title">
          <div>
            <h1>{food.name}</h1>
            <p>Khẩu phần chuẩn: {food.portion}</p>
          </div>
          <strong>
            {calculatedKcal}
            <small> kcal</small>
          </strong>
        </div>

        {/* Macro Grid */}
        <div className="macro-grid">
          <div>
            <span className="text-protein font-semibold">Đạm</span>
            <b>{calculatedProtein} g</b>
          </div>
          <div>
            <span className="text-carbs font-semibold">Tinh bột</span>
            <b>{calculatedCarbs} g</b>
          </div>
          <div>
            <span className="text-fat font-semibold">Chất béo</span>
            <b>{calculatedFat} g</b>
          </div>
        </div>

        {/* Portion Stepper */}
        <div className="detail-section">
          <label className="text-label font-bold text-ink">Khẩu phần</label>
          <div className="stepper">
            <button
              type="button"
              onClick={() => setGrams((g) => Math.max(10, g - 10))}
              aria-label="Giảm 10 gram"
            >
              −
            </button>
            <div>
              <input
                type="number"
                inputMode="numeric"
                value={grams || ""}
                onChange={(e) => setGrams(Math.max(0, Number(e.target.value)))}
                aria-label="Số gram"
              />
              <span>gram</span>
            </div>
            <button
              type="button"
              onClick={() => setGrams((g) => g + 10)}
              aria-label="Tăng 10 gram"
            >
              +
            </button>
          </div>

          <div className="quick-portions">
            {[100, 150, 200].map((n) => (
              <button
                key={n}
                type="button"
                className={grams === n ? "active" : ""}
                onClick={() => setGrams(n)}
              >
                {n} g
              </button>
            ))}
          </div>
        </div>

        {/* Meal selection */}
        <div className="detail-section">
          <label className="text-label font-bold text-ink">Ghi vào bữa</label>
          <div
            className="grid grid-cols-4 gap-2"
            role="radiogroup"
            aria-label="Chọn bữa ăn"
          >
            {mealOptions.map((m) => {
              const isSelected = selectedMeal === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedMeal(m)}
                  className={`min-h-[44px] rounded-md font-bold text-body border transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-brand-900 text-white border-brand-900 shadow-xs"
                      : "bg-surface text-ink border-line hover:bg-brand-50"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="calc-note">
          <Icon name="refresh" size={16} />
          <span>Số liệu được tính theo khẩu phần {grams} g.</span>
        </div>

        {/* Sticky Actions */}
        <div className="space-y-2 mt-4">
          <Button
            disabled={!isValid}
            onClick={() => onSave(grams, selectedMeal)}
          >
            {isEditing ? "Lưu thay đổi" : `Thêm vào bữa ${selectedMeal}`} · {calculatedKcal} kcal
          </Button>

          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa món đã ghi?"
      >
        <div className="space-y-4">
          <span className="danger-round">
            <Icon name="trash" size={24} />
          </span>
          <p className="text-body text-ink-muted">
            {food.name} sẽ bị xóa khỏi nhật ký và tổng năng lượng hôm nay.
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
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Giữ lại
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Modal from "../components/ui/Modal";
import { Food, MEALS, MealLabel, mealPhrase, nutritionFor } from "../data/foods";
import { normalizeStr } from "./FoodSearchScreen";

export interface CustomFoodScreenProps {
  initialName: string;
  foods: Food[];
  meal: MealLabel;
  /** Có giá trị khi đang sửa một món tự đặt. */
  editing?: Food;
  onBack: () => void;
  onSave: (food: Food, grams: number, meal: MealLabel) => void;
  onDelete?: () => void;
}

const num = (s: string) => Number(s.replace(",", "."));

/** Tự tạo món: người dùng tự nhập tên, năng lượng, dinh dưỡng và giá cho một phần ăn. */
export default function CustomFoodScreen({ initialName, foods, meal, editing, onBack, onSave, onDelete }: CustomFoodScreenProps) {
  const serving = editing?.servingGrams ?? 250;
  const per = (v: number | undefined) => (editing && v !== undefined ? String(Math.round(((v * serving) / 100) * 10) / 10) : "");

  const [name, setName] = useState(editing?.name ?? initialName);
  const [kcal, setKcal] = useState(per(editing?.kcal));
  const [price, setPrice] = useState(editing ? String(editing.price) : "");
  const [grams, setGrams] = useState(String(serving));
  const [protein, setProtein] = useState(per(editing?.protein));
  const [carbs, setCarbs] = useState(per(editing?.carbs));
  const [fat, setFat] = useState(per(editing?.fat));
  const [selectedMeal, setSelectedMeal] = useState<MealLabel>(meal);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [quick, setQuick] = useState("");

  const baseFoods = foods.filter((f) => f.kind !== "custom");
  const quickOptions = useMemo(() => {
    const q = normalizeStr(quick.trim());
    if (!q) return [];
    return baseFoods.filter((f) => normalizeStr(f.name).includes(q)).slice(0, 4);
  }, [quick, baseFoods]);

  const fillFrom = (f: Food) => {
    const n = nutritionFor(f, f.servingGrams);
    setKcal(String(n.kcal));
    setProtein(String(n.protein));
    setCarbs(String(n.carbs));
    setFat(String(n.fat));
    setGrams(String(f.servingGrams));
    if (!price) setPrice(String(f.price));
    setQuick("");
  };

  const errors = {
    name: !name.trim() ? "Hãy đặt tên cho món ăn." : undefined,
    kcal: !(num(kcal) > 0 && num(kcal) <= 3000) ? "Nhập năng lượng một phần, từ 1 đến 3.000 kcal." : undefined,
    price: price.trim() === "" || !(num(price) >= 0 && num(price) <= 2000) ? "Nhập giá một phần (nghìn đồng), ví dụ 35." : undefined,
    grams: !(num(grams) >= 20 && num(grams) <= 2000) ? "Khối lượng một phần từ 20 đến 2.000 g." : undefined,
    macro: [protein, carbs, fat].some((v) => v.trim() !== "" && !(num(v) >= 0 && num(v) <= 500)) ? "Đạm, tinh bột, béo cần là số từ 0 đến 500 g." : undefined,
  };
  const ok = !errors.name && !errors.kcal && !errors.price && !errors.grams && !errors.macro;

  const handleSave = () => {
    setSubmitted(true);
    if (!ok) return;
    const g = Math.round(num(grams));
    const k = num(kcal);
    // Không nhập đạm/tinh bột/béo → chia theo tỉ lệ cân bằng thông thường (20/50/30).
    const none = [protein, carbs, fat].every((v) => v.trim() === "");
    const p = none ? (k * 0.2) / 4 : num(protein || "0");
    const c = none ? (k * 0.5) / 4 : num(carbs || "0");
    const f = none ? (k * 0.3) / 9 : num(fat || "0");
    const to100 = (v: number) => Math.round(((v * 100) / g) * 10) / 10;
    const food: Food = {
      id: editing?.id ?? `custom_${Date.now()}`,
      name: name.trim(),
      portion: `1 phần (${g} g)`,
      servingLabel: "1 phần",
      servingGrams: g,
      kcal: to100(k),
      protein: to100(p),
      carbs: to100(c),
      fat: to100(f),
      price: Math.round(num(price) * 10) / 10,
      slots: [...MEALS],
      kind: "custom",
      tag: "Tự đặt",
      popular: false,
    };
    onSave(food, g, selectedMeal);
  };

  const e = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);

  return (
    <>
      <Header title={editing ? "Sửa món của bạn" : "Tự tạo món"} back={onBack} />
      <main className="screen pad">
        <p className="muted mb-4">Nhập món của riêng bạn một lần, lần sau tìm trong “Món của tôi” là ghi ngay.</p>

        <Field label="Tên món" value={name} onChange={(ev) => setName(ev.target.value)} error={e("name")} placeholder="Ví dụ: Bánh canh cua mẹ nấu" />

        {!editing && (
          <div className="mb-4 rounded-lg border border-line bg-surface p-3">
            <b className="block text-label font-bold text-ink mb-1.5">Điền nhanh theo món gần giống</b>
            <div className="search-box !mb-2">
              <Icon name="search" size={18} />
              <input value={quick} onChange={(ev) => setQuick(ev.target.value)} placeholder="Tìm món để lấy số liệu tham khảo" aria-label="Tìm món gần giống" />
            </div>
            {quickOptions.length > 0 && (
              <div className="grid gap-1.5">
                {quickOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => fillFrom(f)}
                    className="flex min-h-[44px] items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3 text-left hover:bg-brand-50 cursor-pointer"
                  >
                    <span className="text-body font-semibold text-ink">{f.name}</span>
                    <span className="shrink-0 text-caption text-ink-muted">{nutritionFor(f, f.servingGrams).kcal} kcal</span>
                  </button>
                ))}
              </div>
            )}
            <p className="m-0 mt-1 text-caption text-ink-muted">Không bắt buộc. Bạn vẫn sửa được mọi số bên dưới.</p>
          </div>
        )}

        <h2 className="mb-2 text-h2">Một phần ăn</h2>
        <div className="grid grid-cols-2 gap-x-3">
          <Field label="Khối lượng" unit="g" type="number" inputMode="numeric" value={grams} onChange={(ev) => setGrams(ev.target.value)} error={e("grams")} />
          <Field label="Năng lượng" unit="kcal" type="number" inputMode="numeric" value={kcal} onChange={(ev) => setKcal(ev.target.value)} error={e("kcal")} placeholder="450" />
        </div>
        <Field label="Giá" unit="k" type="number" inputMode="decimal" value={price} onChange={(ev) => setPrice(ev.target.value)} error={e("price")} placeholder="35" hint="Giá bạn thường trả cho một phần, ví dụ 35 là 35.000đ." />

        <h2 className="mb-2 text-h2">Dinh dưỡng <span className="text-body font-medium text-ink-muted">(không bắt buộc)</span></h2>
        <div className="grid grid-cols-3 gap-x-2">
          <Field label="Đạm" unit="g" type="number" inputMode="decimal" value={protein} onChange={(ev) => setProtein(ev.target.value)} />
          <Field label="Tinh bột" unit="g" type="number" inputMode="decimal" value={carbs} onChange={(ev) => setCarbs(ev.target.value)} />
          <Field label="Béo" unit="g" type="number" inputMode="decimal" value={fat} onChange={(ev) => setFat(ev.target.value)} />
        </div>
        {e("macro") && <p className="-mt-1 mb-3 text-caption text-danger" role="alert">{errors.macro}</p>}
        <p className="m-0 mb-4 text-caption text-ink-muted">Để trống thì NutriDaily tự chia theo tỉ lệ cân bằng thông thường.</p>

        {!editing && (
          <div className="detail-section">
            <label className="text-label font-bold text-ink">Ghi vào bữa</label>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Chọn bữa ăn">
              {MEALS.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={selectedMeal === m}
                  onClick={() => setSelectedMeal(m)}
                  className={`min-h-[44px] rounded-md font-bold text-label border cursor-pointer ${
                    selectedMeal === m ? "bg-brand-900 text-white border-brand-900" : "bg-surface text-ink border-line hover:bg-brand-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <Button onClick={handleSave}>{editing ? "Lưu thay đổi" : `Lưu & thêm vào ${mealPhrase(selectedMeal)}`}</Button>
          {editing && onDelete && (
            <Button variant="danger" icon="trash" onClick={() => setConfirmDelete(true)}>
              Xóa món này
            </Button>
          )}
          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </main>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Xóa món này?">
        <div className="space-y-3">
          <p className="text-body text-ink-muted">Món sẽ biến mất khỏi “Món của tôi” và Yêu thích. Các bữa bạn đã ghi trước đó vẫn giữ nguyên.</p>
          <Button variant="danger" onClick={onDelete}>
            Xóa món
          </Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Giữ lại
          </Button>
        </div>
      </Modal>
    </>
  );
}

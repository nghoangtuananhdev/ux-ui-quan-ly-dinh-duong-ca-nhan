import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import ChipRow from "../components/ui/ChipRow";
import FoodPickRow from "../components/nutrition/FoodPickRow";
import { Food, MealLabel, nutritionFor, mealPhrase } from "../data/foods";
import { BmiBand, rankForMeal } from "../lib/body";

export interface FoodSearchScreenProps {
  foods: Food[];
  recentFoods: Food[];
  favoriteIds: string[];
  meal: MealLabel;
  onBack: () => void;
  onSelectFood: (food: Food) => void;
  onQuickAdd: (food: Food, meal: MealLabel) => void;
  onCreateCustom: (name: string) => void;
  suggestCtx: { remainingKcal: number; band: BmiBand | null; kcalGoal: number };
}

type Filter = "forYou" | "recent" | "favorite" | "mine" | "popular" | "cheap" | "all";

export const normalizeStr = (str: string) =>
  str
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

export default function FoodSearchScreen({
  foods,
  recentFoods,
  favoriteIds,
  meal,
  onBack,
  onSelectFood,
  onQuickAdd,
  onCreateCustom,
  suggestCtx,
}: FoodSearchScreenProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(recentFoods.length ? "recent" : "forYou");

  const chips: { key: Filter; label: string }[] = [
    { key: "recent", label: "Gần đây" },
    { key: "forYou", label: "Gợi ý cho bạn" },
    { key: "favorite", label: "Yêu thích" },
    { key: "mine", label: "Món của tôi" },
    { key: "popular", label: `Hợp ${mealPhrase(meal)}` },
    { key: "cheap", label: "≤ 30k" },
    { key: "all", label: "Tất cả" },
  ];

  const suggestions = useMemo(() => rankForMeal(foods, meal, suggestCtx).slice(0, 8), [foods, meal, suggestCtx]);
  const reasonOf = (id: string) => suggestions.find((x) => x.food.id === id)?.reason;

  const list = useMemo(() => {
    const q = normalizeStr(query.trim());
    if (q) return foods.filter((f) => normalizeStr(f.name).includes(q));
    if (filter === "forYou") return suggestions.map((x) => x.food);
    switch (filter) {
      case "recent": {
        // Món quen trước: yêu thích + hợp bữa hiện tại lên đầu (Recognition over recall).
        const rank = (f: Food) => (favoriteIds.includes(f.id) ? 0 : 2) + (f.slots.includes(meal) ? 0 : 1);
        return [...recentFoods].sort((a, b) => rank(a) - rank(b));
      }
      case "favorite":
        return foods.filter((f) => favoriteIds.includes(f.id));
      case "mine":
        return foods.filter((f) => f.kind === "custom");
      case "popular":
        return foods.filter((f) => f.slots.includes(meal));
      case "cheap":
        return foods
          .filter((f) => nutritionFor(f, f.servingGrams).price <= 30)
          .sort((a, b) => a.price - b.price);
      default:
        return foods;
    }
  }, [foods, recentFoods, favoriteIds, filter, query, meal, suggestions]);

  const similar = foods.filter((f) => f.slots.includes(meal) && f.kind !== "custom" && !f.side).slice(0, 3);

  return (
    <>
      <Header title={`Thêm vào ${mealPhrase(meal)}`} back={onBack} />
      <main className="screen pad search-screen">
        <div className="search-box">
          <Icon name="search" size={20} />
          <input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món, ví dụ: cơm tấm, phở"
            aria-label="Tìm món ăn"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Xóa tìm kiếm">
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {!query && (
          <ChipRow items={chips.map((c) => [c.key, c.label] as const)} value={filter} onChange={setFilter} label="Lọc món" className="mt-2 mb-2" />
        )}

        {filter === "forYou" && !query && (
          <p className="m-0 mb-2 text-caption text-ink-muted">
            Dựa trên năng lượng còn lại hôm nay ({Math.max(0, suggestCtx.remainingKcal).toLocaleString("vi-VN")} kcal)
            {suggestCtx.band ? " và chỉ số BMI của bạn" : " — thêm chiều cao, cân nặng trong Cá nhân để gợi ý sát hơn"}.
          </p>
        )}
        <div className="search-title">
          <b>{query ? "Kết quả tìm kiếm" : chips.find((c) => c.key === filter)?.label}</b>
          {list.length > 0 && <span>{list.length} món · chạm + để ghi khẩu phần vừa</span>}
        </div>
        {!query && (
          <button
            type="button"
            onClick={() => onCreateCustom("")}
            className="mb-3 flex min-h-[48px] w-full items-center gap-3 rounded-lg border border-dashed border-brand-700/40 bg-brand-50/60 px-3 text-left font-bold text-brand-text hover:bg-brand-50 cursor-pointer"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-brand-100">
              <Icon name="plus" size={18} />
            </span>
            Tự tạo món của riêng bạn
          </button>
        )}

        {list.length > 0 ? (
          <div className="food-results">
            {list.map((food, i) => (
              <FoodPickRow
                key={food.id}
                food={food}
                index={i}
                meal={mealPhrase(meal)}
                favorite={favoriteIds.includes(food.id)}
                badge={food.kind === "custom" ? "Tự đặt" : filter === "forYou" && !query ? reasonOf(food.id) : undefined}
                onOpen={() => onSelectFood(food)}
                onQuickAdd={() => onQuickAdd(food, meal)}
              />
            ))}
          </div>
        ) : filter === "mine" && !query ? (
          <div className="empty-state !py-8">
            <span>
              <Icon name="utensils" size={28} />
            </span>
            <h2>Chưa có món nào của bạn</h2>
            <p>Tự đặt tên món, nhập năng lượng và giá để ghi lại món quen thuộc.</p>
          </div>
        ) : query ? (
          <div className="empty-state !py-8">
            <span>
              <Icon name="search" size={28} />
            </span>
            <h2>Chưa có “{query.trim()}”</h2>
            <p>Bạn vẫn ghi được ngay: tự đặt tên, năng lượng và giá cho món này.</p>
            <Button icon="plus" onClick={() => onCreateCustom(query.trim())}>
              Thêm món tự đặt
            </Button>
            <div className="mt-6 text-left">
              <b className="block text-label font-bold text-ink mb-2">Hoặc chọn một món gần giống</b>
              <div className="food-results">
                {similar.map((food, i) => (
                  <FoodPickRow
                    key={food.id}
                    food={food}
                    index={i}
                    meal={mealPhrase(meal)}
                    onOpen={() => onSelectFood(food)}
                    onQuickAdd={() => onQuickAdd(food, meal)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state !py-8">
            <span>
              <Icon name={filter === "favorite" ? "star" : "clock"} size={28} />
            </span>
            <h2>{filter === "favorite" ? "Chưa có món yêu thích" : "Chưa có món gần đây"}</h2>
            <p>
              {filter === "favorite"
                ? "Mở chi tiết một món và chạm ngôi sao để lưu món bạn hay ăn."
                : "Món bạn ghi sẽ xuất hiện ở đây để lần sau chỉ cần 1 chạm."}
            </p>
            <Button variant="secondary" onClick={() => setFilter("popular")}>
              Xem món hợp {mealPhrase(meal)}
            </Button>
          </div>
        )}
      </main>
    </>
  );
}

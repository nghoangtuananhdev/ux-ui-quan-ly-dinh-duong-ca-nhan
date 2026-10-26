import React, { useState, useMemo } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { Food, MealLabel } from "../data/foods";

export interface FoodSearchScreenProps {
  foods: Food[];
  meal: MealLabel;
  onBack: () => void;
  onSelectFood: (food: Food) => void;
  onQuickAdd: (food: Food, meal: MealLabel) => void;
}

export default function FoodSearchScreen({
  foods,
  meal,
  onBack,
  onSelectFood,
  onQuickAdd,
}: FoodSearchScreenProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "popular">("all");

  const normalizeStr = (str: string) =>
    str
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      // Filter by chip
      if (activeFilter === "recent" && f.tag !== "Gần đây") return false;
      if (activeFilter === "popular" && f.tag !== "Phổ biến") return false;

      // Filter by query
      if (!query.trim()) return true;
      return normalizeStr(f.name).includes(normalizeStr(query));
    });
  }, [foods, query, activeFilter]);

  return (
    <>
      <Header title={`Thêm vào bữa ${meal}`} back={onBack} />
      <main className="screen pad search-screen">
        <div className="search-box">
          <Icon name="search" size={20} />
          <input
            autoFocus
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món ăn, ví dụ: cơm trắng"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Xóa tìm kiếm"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="filter-chips">
          <button
            type="button"
            className={activeFilter === "all" ? "active" : ""}
            onClick={() => setActiveFilter("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={activeFilter === "recent" ? "active" : ""}
            onClick={() => setActiveFilter("recent")}
          >
            Gần đây
          </button>
          <button
            type="button"
            className={activeFilter === "popular" ? "active" : ""}
            onClick={() => setActiveFilter("popular")}
          >
            Phổ biến
          </button>
        </div>

        <div className="search-title">
          <b>{query ? "Kết quả tìm kiếm" : "Gợi ý cho bạn"}</b>
          <span>{filteredFoods.length} món</span>
        </div>

        {filteredFoods.length > 0 ? (
          <div className="food-results">
            {filteredFoods.map((food, index) => (
              <div
                key={food.id || food.name}
                className="group flex items-center justify-between p-3 border-b border-line last:border-b-0 hover:bg-brand-50/50 transition-colors"
              >
                {/* Main click to open detail */}
                <button
                  type="button"
                  onClick={() => onSelectFood(food)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0 cursor-pointer"
                >
                  <span className={`food-thumb t${index % 4}`}>
                    <Icon name="leaf" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block text-body font-bold text-ink truncate">
                      {food.name}
                    </b>
                    <small className="block text-caption text-ink-muted">
                      {food.portion} · {food.kcal} kcal
                    </small>
                  </div>
                  {food.tag && <em className="shrink-0">{food.tag}</em>}
                </button>

                {/* Quick Add + button */}
                <button
                  type="button"
                  onClick={() => onQuickAdd(food, meal)}
                  className="size-11 shrink-0 ml-2 rounded-md bg-brand-100 text-brand-text hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={`Thêm nhanh ${food.name} vào bữa ${meal}`}
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>
              <Icon name="search" size={28} />
            </span>
            <h2>Chưa tìm thấy món</h2>
            <p>Thử kiểm tra chính tả hoặc dùng từ khóa ngắn hơn.</p>
            <Button variant="secondary" onClick={() => setQuery("")}>
              Xóa từ khóa
            </Button>
          </div>
        )}
      </main>
    </>
  );
}

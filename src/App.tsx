import { useMemo, useRef, useState } from "react";

type Screen =
  | "welcome"
  | "setup"
  | "today"
  | "diary"
  | "search"
  | "food"
  | "planner"
  | "swap"
  | "progress"
  | "profile"
  | "testing";

type IconName =
  | "leaf"
  | "home"
  | "book"
  | "calendar"
  | "chart"
  | "user"
  | "plus"
  | "search"
  | "chevron"
  | "arrow"
  | "water"
  | "check"
  | "close"
  | "clock"
  | "edit"
  | "trash"
  | "refresh"
  | "target"
  | "help";

const paths: Record<IconName, React.ReactNode> = {
  leaf: <><path d="M19 3C12 3 6 7 6 13c0 2 1 4 3 5 6 2 10-4 10-15Z"/><path d="M5 21c2-6 6-10 11-13"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  arrow: <path d="m15 18-6-6 6-6"/>,
  water: <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
  edit: <><path d="m14 5 5 5M4 20l3.5-.7L20 6.8 17.2 4 4.7 16.5 4 20Z"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 5M18 15a7 7 0 0 1-12 2l-2-5"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m15 9 6-6"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.3c-.8.4-1 1-1 1.7M12 17h.01"/></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const foods = [
  { name: "Cơm trắng", portion: "100 g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, tag: "Gần đây" },
  { name: "Phở bò", portion: "1 tô", kcal: 350, protein: 24, carbs: 48, fat: 8, tag: "Phổ biến" },
  { name: "Bánh mì", portion: "1 ổ", kcal: 265, protein: 9, carbs: 49, fat: 3.2, tag: "Phổ biến" },
  { name: "Ức gà áp chảo", portion: "100 g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, tag: "Gần đây" },
  { name: "Trứng luộc", portion: "1 quả", kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, tag: "Phổ biến" },
  { name: "Rau luộc", portion: "100 g", kcal: 35, protein: 2, carbs: 7, fat: 0.2, tag: "Phổ biến" },
  { name: "Chuối", portion: "1 quả", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, tag: "Phổ biến" },
  { name: "Sữa chua", portion: "1 hộp", kcal: 100, protein: 3.5, carbs: 17, fat: 3, tag: "Gần đây" },
];

const initialMeals = [
  { id: 1, meal: "Sáng", name: "Bánh mì trứng", portion: "1 phần", kcal: 343 },
  { id: 2, meal: "Trưa", name: "Ức gà áp chảo", portion: "100 g", kcal: 165 },
  { id: 3, meal: "Trưa", name: "Rau luộc", portion: "100 g", kcal: 35 },
  { id: 4, meal: "Bữa phụ", name: "Sữa chua", portion: "1 hộp", kcal: 100 },
];

function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span><Icon name="leaf" size={22}/></span><b>NutriDaily</b></div>;
}

function Button({ children, onClick, variant = "primary", icon, disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName; disabled?: boolean }) {
  return <button type="button" className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={18}/>}<span>{children}</span></button>;
}

function Header({ title, back, action }: { title: string; back?: () => void; action?: React.ReactNode }) {
  return <header className="app-header">{back ? <button className="icon-btn" onClick={back} aria-label="Quay lại"><Icon name="arrow"/></button> : <Logo/>}<strong className={back ? "" : "sr-only"}>{title}</strong><div>{action}</div></header>;
}

const navItems: { key: Screen; label: string; icon: IconName }[] = [
  { key: "today", label: "Hôm nay", icon: "home" },
  { key: "diary", label: "Nhật ký", icon: "book" },
  { key: "planner", label: "Thực đơn", icon: "calendar" },
  { key: "progress", label: "Tiến độ", icon: "chart" },
  { key: "profile", label: "Cá nhân", icon: "user" },
];

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return <nav className="bottom-nav">{navItems.map(item => <button key={item.key} className={screen === item.key ? "active" : ""} onClick={() => go(item.key)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>;
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const pct = Math.min(value / total, 1) * 100;
  return <div className="ring" style={{ "--progress": `${pct * 3.6}deg` } as React.CSSProperties}><div><b>{value.toLocaleString("vi-VN")}</b><span>trên {total.toLocaleString("vi-VN")} kcal</span></div></div>;
}

function Toast({ text }: { text: string }) {
  return <div className="toast"><span><Icon name="check" size={16}/></span>{text}</div>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [goal, setGoal] = useState(2000);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [draftGoal, setDraftGoal] = useState("2000");
  const [draftWaterGoal, setDraftWaterGoal] = useState("2000");
  const [water, setWater] = useState(1250);
  const [meals, setMeals] = useState(initialMeals);
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState(foods[0]);
  const [grams, setGrams] = useState(150);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [setupError, setSetupError] = useState("");
  const [plannedDish, setPlannedDish] = useState("Cơm gà rau củ");
  const [swapDish, setSwapDish] = useState("Bún thịt nướng");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("Ăn uống cân bằng");

  const phoneContentRef = useRef<HTMLDivElement>(null);

  const total = useMemo(() => meals.reduce((sum, m) => sum + m.kcal, 0), [meals]);
  const filteredFoods = foods.filter(food => food.name.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  const showToast = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600); };
  const go = (s: Screen) => {
    setScreen(s);
    if (phoneContentRef.current) {
      phoneContentRef.current.scrollTop = 0;
    }
  };

  const addFood = () => {
    const kcal = Math.round(selectedFood.kcal * grams / 100);
    if (editingId) {
      setMeals(meals.map(m => m.id === editingId ? { ...m, portion: `${grams} g`, kcal } : m));
      showToast("Đã cập nhật khẩu phần");
    } else {
      setMeals([...meals, { id: Date.now(), meal: "Trưa", name: selectedFood.name, portion: `${grams} g`, kcal }]);
      showToast("Đã thêm vào bữa trưa");
    }
    setEditingId(null);
    go("diary");
  };

  const editMeal = (id: number) => {
    const item = meals.find(m => m.id === id);
    if (!item) return;
    setEditingId(id);
    setSelectedFood(foods.find(f => f.name === item.name) || foods[0]);
    setGrams(parseInt(item.portion) || 100);
    go("food");
  };

  const commonShell = (content: React.ReactNode, navScreen: Screen = screen) => <div className="phone-shell"><div className="status-bar"><span>9:41</span><span className="status-icons">● ◒</span></div><div className="phone-content" ref={phoneContentRef}>{content}</div>{navItems.some(n => n.key === navScreen) && <BottomNav screen={navScreen} go={go}/>} {toast && <Toast text={toast}/>}</div>;

  const welcome = <div className="welcome">
    <div className="welcome-art"><div className="sun"></div><div className="plate"><span className="leaf-one"></span><span className="leaf-two"></span><span className="grain"></span></div><div className="spark s1"></div><div className="spark s2"></div></div>
    <div className="welcome-copy"><Logo/><h1>Hiểu bữa ăn,<br/>duy trì thói quen tốt.</h1><p>Theo dõi dinh dưỡng theo cách nhẹ nhàng, đơn giản và phù hợp với nhịp sống của bạn.</p></div>
    <div className="welcome-actions"><Button onClick={() => go("setup")}>Bắt đầu</Button><Button variant="secondary" onClick={() => go("today")}>Khám phá bản mẫu</Button><button className="test-link" onClick={() => go("testing")}><Icon name="help" size={17}/> Mở bộ tài liệu kiểm thử</button></div>
  </div>;

  const setup = <><Header title="Thiết lập mục tiêu" back={() => go("welcome")}/><main className="screen pad setup-screen">
    <div className="step-label">BƯỚC 1 / 1</div><h1>Mục tiêu của bạn là gì?</h1><p className="muted">Chọn điều bạn muốn tập trung. Bạn có thể thay đổi bất cứ lúc nào.</p>
    <div className="choice-list">{["Ăn uống cân bằng", "Duy trì cân nặng", "Theo dõi dinh dưỡng"].map((x, i) => <button onClick={() => setSelectedGoal(x)} className={`choice ${selectedGoal === x ? "selected" : ""}`} key={x}><span className="choice-icon"><Icon name={i === 0 ? "leaf" : i === 1 ? "target" : "chart"}/></span><span><b>{x}</b><small>{i === 0 ? "Xây dựng thói quen bền vững" : i === 1 ? "Theo sát mức năng lượng mỗi ngày" : "Hiểu rõ hơn về bữa ăn"}</small></span><i>{selectedGoal === x && <Icon name="check" size={16}/>}</i></button>)}</div>
    <div className="section-title"><b>Mục tiêu mỗi ngày</b><span>Mục tiêu minh họa</span></div>
    <label className="field"><span>Năng lượng</span><div><input value={draftGoal} onChange={e => setDraftGoal(e.target.value)} inputMode="numeric"/><em>kcal</em></div></label>
    <label className="field"><span>Nước uống</span><div><input value={draftWaterGoal} onChange={e => setDraftWaterGoal(e.target.value)} inputMode="numeric"/><em>ml</em></div></label>
    {setupError && <p className="error">{setupError}</p>}
    <div className="info-note"><Icon name="help" size={18}/><span>Các con số có sẵn chỉ để minh họa, không phải khuyến nghị y khoa.</span></div>
    <Button onClick={() => { const a = Number(draftGoal), b = Number(draftWaterGoal); if (!a || !b || a < 500 || b < 500) setSetupError("Vui lòng nhập số hợp lệ, từ 500 trở lên."); else { setGoal(a); setWaterGoal(b); go("today"); showToast("Đã lưu mục tiêu của bạn"); } }}>Lưu và tiếp tục</Button>
    <button className="skip" onClick={() => go("today")}>Bỏ qua, dùng mục tiêu mẫu</button>
  </main></>;

  const today = <><Header title="Hôm nay" action={<button className="avatar" onClick={() => go("profile")}>AN</button>}/><main className="screen pad with-nav">
    <div className="eyebrow">THỨ NĂM, 19 THÁNG 6</div><h1>Chào buổi sáng, An</h1><p className="muted">Một chút đều đặn mỗi ngày là đủ.</p>
    <section className="energy-card"><div className="card-top"><div><span>Năng lượng đã ghi</span><strong>Còn {Math.max(goal - total, 0).toLocaleString("vi-VN")} kcal</strong></div><button onClick={() => go("diary")}>Xem chi tiết <Icon name="chevron" size={15}/></button></div><div className="energy-main"><ProgressRing value={total} total={goal}/><div className="macro-list"><div><i className="dot protein"></i><span>Chất đạm</span><b>51 g</b></div><div><i className="dot carb"></i><span>Tinh bột</span><b>86 g</b></div><div><i className="dot fat"></i><span>Chất béo</span><b>24 g</b></div></div></div></section>
    <div className="section-heading"><div><h2>Bữa ăn hôm nay</h2><span>{meals.length} món đã ghi</span></div><button className="small-add" onClick={() => { setEditingId(null); go("search"); }}><Icon name="plus" size={17}/> Thêm món</button></div>
    <div className="meal-rows">{["Sáng", "Trưa", "Tối", "Bữa phụ"].map(name => { const list = meals.filter(m => m.meal === name); return <button key={name} className="meal-row" onClick={() => go("diary")}><span className="meal-symbol">{name === "Sáng" ? "S" : name === "Trưa" ? "Tr" : name === "Tối" ? "T" : "P"}</span><span><b>{name}</b><small>{list.length ? list.map(m => m.name).join(", ") : "Chưa ghi món"}</small></span><em>{list.reduce((s,m)=>s+m.kcal,0)} kcal</em><Icon name="chevron" size={17}/></button>})}</div>
    <section className="water-card"><div className="water-icon"><Icon name="water"/></div><div><span>Nước hôm nay</span><b>{water.toLocaleString("vi-VN")} <small>/ {waterGoal.toLocaleString("vi-VN")} ml</small></b><div className="water-track"><i style={{width: `${Math.min(water/waterGoal*100, 100)}%`}}></i></div></div><button onClick={() => { setWater(water + 250); showToast("Đã thêm 250 ml nước"); }}>+250 ml</button></section>
    <button className="planner-link" onClick={() => go("planner")}><span><Icon name="calendar"/><b>Xem thực đơn hôm nay</b></span><Icon name="chevron"/></button>
  </main></>;

  const diary = <><Header title="Nhật ký ăn uống" action={<button className="icon-btn" onClick={() => { setEditingId(null); go("search"); }}><Icon name="plus"/></button>}/><main className="screen pad with-nav">
    <div className="date-picker"><button><Icon name="arrow"/></button><div><b>Hôm nay</b><span>Thứ Năm, 19/06</span></div><button><Icon name="chevron"/></button></div>
    <section className="diary-summary"><div><span>Tổng năng lượng</span><b>{total.toLocaleString("vi-VN")} kcal</b></div><div><span>Mục tiêu</span><b>{goal.toLocaleString("vi-VN")} kcal</b></div></section>
    {["Sáng", "Trưa", "Tối", "Bữa phụ"].map(name => { const list = meals.filter(m => m.meal === name); return <section className="diary-group" key={name}><div className="group-head"><h2>{name}</h2><span>{list.reduce((s,m)=>s+m.kcal,0)} kcal</span></div>{list.length ? list.map(item => <button className="food-line" key={item.id} onClick={() => editMeal(item.id)}><span className="food-glyph"><Icon name="leaf" size={17}/></span><span><b>{item.name}</b><small>{item.portion}</small></span><em>{item.kcal} kcal</em><Icon name="chevron" size={17}/></button>) : <button className="empty-meal" onClick={() => go("search")}><Icon name="plus" size={17}/> Ghi món đầu tiên</button>}</section>})}
    <Button icon="plus" onClick={() => { setEditingId(null); go("search"); }}>Thêm món</Button>
  </main></>;

  const search = <><Header title="Thêm món ăn" back={() => go("diary")}/><main className="screen pad search-screen">
    <div className="search-box"><Icon name="search"/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm món ăn, ví dụ: cơm trắng"/>{query && <button onClick={() => setQuery("")}><Icon name="close" size={17}/></button>}</div>
    <div className="filter-chips"><button className="active">Tất cả</button><button>Gần đây</button><button>Phổ biến</button></div>
    <div className="search-title"><b>{query ? "Kết quả tìm kiếm" : "Gợi ý cho bạn"}</b><span>{filteredFoods.length} món</span></div>
    {filteredFoods.length ? <div className="food-results">{filteredFoods.map((food, index) => <button key={food.name} onClick={() => { setSelectedFood(food); setGrams(food.name === "Cơm trắng" ? 150 : 100); go("food"); }}><span className={`food-thumb t${index%4}`}><Icon name="leaf"/></span><span><b>{food.name}</b><small>{food.portion} · {food.kcal} kcal</small></span><em>{food.tag}</em><Icon name="chevron" size={17}/></button>)}</div> : <div className="empty-state"><span><Icon name="search" size={28}/></span><h2>Chưa tìm thấy món</h2><p>Thử kiểm tra chính tả hoặc dùng từ khóa ngắn hơn.</p><Button variant="secondary" onClick={() => setQuery("")}>Xóa từ khóa</Button></div>}
    <p className="data-note">Dữ liệu dinh dưỡng trong prototype chỉ mang tính minh họa.</p>
  </main></>;

  const food = <><Header title={editingId ? "Chỉnh sửa món" : "Chi tiết món"} back={() => go(editingId ? "diary" : "search")} action={editingId ? <button className="icon-btn danger-icon" onClick={() => setShowDelete(true)}><Icon name="trash"/></button> : undefined}/><main className="screen pad food-detail">
    <div className="food-hero"><span><Icon name="leaf" size={36}/></span></div><div className="food-title"><div><h1>{selectedFood.name}</h1><p>Khẩu phần chuẩn: {selectedFood.portion}</p></div><strong>{Math.round(selectedFood.kcal * grams / 100)}<small> kcal</small></strong></div>
    <div className="macro-grid">{[["Đạm", selectedFood.protein],["Tinh bột", selectedFood.carbs],["Chất béo", selectedFood.fat]].map(x => <div key={String(x[0])}><span>{x[0]}</span><b>{(Number(x[1])*grams/100).toFixed(1)} g</b></div>)}</div>
    <div className="detail-section"><label>Khẩu phần</label><div className="stepper"><button onClick={() => setGrams(Math.max(50, grams - 50))}>−</button><div><input value={grams} onChange={e => setGrams(Math.max(0, Number(e.target.value)))} inputMode="numeric"/><span>gram</span></div><button onClick={() => setGrams(grams + 50)}>+</button></div><div className="quick-portions">{[100,150,200].map(n => <button className={grams === n ? "active" : ""} onClick={() => setGrams(n)} key={n}>{n} g</button>)}</div></div>
    <div className="detail-section two-fields"><label>Ghi vào</label><button><span><small>Bữa ăn</small><b>Bữa trưa</b></span><Icon name="chevron"/></button><button><span><small>Ngày</small><b>Hôm nay, 19/06</b></span><Icon name="chevron"/></button></div>
    <div className="calc-note"><Icon name="refresh" size={17}/><span>Số liệu được tính theo khẩu phần {grams} g.</span></div>
    <Button onClick={addFood}>{editingId ? "Lưu thay đổi" : "Thêm vào bữa trưa"} · {Math.round(selectedFood.kcal * grams / 100)} kcal</Button><Button variant="ghost" onClick={() => go("diary")}>Hủy</Button>
  </main>{showDelete && <div className="modal-backdrop"><div className="modal"><span className="danger-round"><Icon name="trash"/></span><h2>Xóa món đã ghi?</h2><p>{selectedFood.name} sẽ bị xóa khỏi nhật ký và tổng năng lượng hôm nay.</p><Button variant="danger" onClick={() => { setMeals(meals.filter(m => m.id !== editingId)); setShowDelete(false); setEditingId(null); go("diary"); showToast("Đã xóa món khỏi nhật ký"); }}>Xóa món</Button><Button variant="secondary" onClick={() => setShowDelete(false)}>Giữ lại</Button></div></div>}</>;

  const planner = <><Header title="Thực đơn" action={<button className="icon-btn"><Icon name="calendar"/></button>}/><main className="screen pad with-nav">
    <div className="week-strip">{[["T2","16"],["T3","17"],["T4","18"],["T5","19"],["T6","20"],["T7","21"],["CN","22"]].map((d,i)=><button className={i===4?"active":""} key={d[0]}><span>{d[0]}</span><b>{d[1]}</b>{i===3&&<i/>}</button>)}</div>
    <div className="plan-intro"><div><span>THỨ SÁU, 20/06</span><h1>Kế hoạch ngày mai</h1></div><div className="plan-kcal"><span>Dự kiến</span><b>1.820 kcal</b></div></div>
    <div className="status-explain"><span><Icon name="calendar" size={17}/></span><p><b>Đã lên kế hoạch</b> không đồng nghĩa với đã ăn. Món chỉ vào nhật ký khi bạn chủ động ghi.</p></div>
    {[["Bữa sáng","Yến mạch chuối","410 kcal"],["Bữa trưa",plannedDish,"560 kcal"],["Bữa tối","Cá hấp và rau củ","530 kcal"],["Bữa phụ","Sữa chua trái cây","320 kcal"]].map((x,i)=><section className="plan-card" key={x[0]}><div className="plan-card-top"><span>{x[0]}</span><em>Đã lên kế hoạch</em></div><div className="plan-dish"><span className={`food-thumb t${i}`}><Icon name="leaf"/></span><div><b>{x[1]}</b><small>1 phần · {x[2]}</small></div></div>{i===1&&<button onClick={() => go("swap")}><Icon name="refresh" size={17}/> Đổi món</button>}</section>)}
  </main></>;

  const swap = <><Header title="Đổi món bữa trưa" back={() => go("planner")}/><main className="screen pad swap-screen">
    <div className="current-plan"><span>MÓN HIỆN TẠI</span><div><span className="food-thumb t1"><Icon name="leaf"/></span><div><b>{plannedDish}</b><small>1 phần · 560 kcal</small></div></div></div>
    <div className="search-title"><b>Chọn món thay thế</b><span>Gợi ý minh họa</span></div>
    <div className="swap-list">{[["Bún thịt nướng","1 tô · 520 kcal"],["Cơm cá kho","1 phần · 540 kcal"],["Phở bò","1 tô · 350 kcal"]].map((x,i)=><button className={swapDish===x[0]?"selected":""} onClick={()=>setSwapDish(x[0])} key={x[0]}><span className={`food-thumb t${i+1}`}><Icon name="leaf"/></span><span><b>{x[0]}</b><small>{x[1]}</small></span><i>{swapDish===x[0]&&<Icon name="check" size={16}/>}</i></button>)}</div>
    <div className="info-note"><Icon name="help" size={18}/><span>Các lựa chọn là gợi ý minh họa, không phải tư vấn điều trị hoặc khẳng định tương đương dinh dưỡng.</span></div>
    <div className="sticky-actions"><Button onClick={() => {setPlannedDish(swapDish);go("planner");showToast("Đã cập nhật thực đơn ngày mai");}}>Xác nhận đổi món</Button><Button variant="ghost" onClick={()=>go("planner")}>Hủy</Button></div>
  </main></>;

  const progress = <><Header title="Tiến độ"/><main className="screen pad with-nav">
    <div className="period-control"><button><Icon name="arrow"/></button><div><b>Tuần này</b><span>16 – 22 tháng 6</span></div><button><Icon name="chevron"/></button></div>
    <section className="chart-card"><div className="chart-head"><div><span>Năng lượng đã ghi</span><b>Trung bình 1.625 kcal</b></div><span>kcal</span></div><div className="bar-chart">{[1450,1820,0,1643,1590,0,0].map((v,i)=><button key={i} className={i===3?"active":""}><div className="bar-wrap">{v?<i style={{height:`${v/22}px`}}/>:<span>—</span>}</div><b>{["T2","T3","T4","T5","T6","T7","CN"][i]}</b></button>)}</div><p className="chart-caption">Bạn đã ghi nhật ký <b>4/7 ngày</b>. Những ngày còn lại chưa có dữ liệu.</p></section>
    <section className="weekly-card"><div><span className="water-icon"><Icon name="water"/></span><div><span>Nước uống trung bình</span><b>1.550 ml / ngày ghi</b></div></div><small>Dựa trên 4 ngày có dữ liệu</small></section>
    <h2 className="section-h2">Chi tiết Thứ Năm</h2><div className="stat-list"><div><span>Năng lượng</span><b>{total} kcal</b></div><div><span>Nước uống</span><b>{water.toLocaleString("vi-VN")} ml</b></div><div><span>Món đã ghi</span><b>{meals.length} món</b></div></div>
    <p className="data-note">Không suy luận tình trạng sức khỏe từ dữ liệu mẫu này.</p>
  </main></>;

  const profile = <><Header title="Cá nhân"/><main className="screen pad with-nav">
    <div className="profile-head"><span>AN</span><div><h1>An Nguyễn</h1><p>Tài khoản dùng thử</p></div></div>
    <section className="profile-card"><div className="section-heading"><div><h2>Mục tiêu mỗi ngày</h2><span>Có thể điều chỉnh</span></div><Icon name="target"/></div><label className="field"><span>Năng lượng</span><div><input value={draftGoal} onChange={e=>setDraftGoal(e.target.value)} inputMode="numeric"/><em>kcal</em></div></label><label className="field"><span>Nước uống</span><div><input value={draftWaterGoal} onChange={e=>setDraftWaterGoal(e.target.value)} inputMode="numeric"/><em>ml</em></div></label><Button onClick={()=>{const a=Number(draftGoal),b=Number(draftWaterGoal); if(a&&b){setGoal(a);setWaterGoal(b);showToast("Đã lưu mục tiêu mới");}}}>Lưu thay đổi</Button></section>
    <section className="profile-card about"><h2>Về dữ liệu trong prototype</h2><p>Mọi thông tin cá nhân, món ăn và số liệu dinh dưỡng đều là dữ liệu giả định phục vụ kiểm thử. Ứng dụng không đưa ra tư vấn y khoa.</p></section>
    <button className="settings-row" onClick={()=>go("testing")}><span><Icon name="help"/><b>Bộ tài liệu kiểm thử</b></span><Icon name="chevron"/></button>
    <button className="settings-row" onClick={()=>{setMeals(initialMeals);setWater(1250);setGoal(2000);setWaterGoal(2000);setDraftGoal("2000");setDraftWaterGoal("2000");showToast("Đã đặt lại dữ liệu mẫu");}}><span><Icon name="refresh"/><b>Đặt lại dữ liệu mẫu</b></span><Icon name="chevron"/></button>
  </main></>;

  const testing = <TestingHub onBack={()=>go("welcome")}/>;

  const screens: Record<Screen, React.ReactNode> = { welcome, setup, today, diary, search, food, planner, swap, progress, profile, testing };
  if (screen === "testing") return testing;
  const navScreen = ["today","diary","planner","progress","profile"].includes(screen) ? screen : (screen === "swap" ? "planner" : screen);
  return <div className="prototype-stage"><div className="stage-note"><Logo light/><p>Prototype tương tác · NutriDaily</p><button onClick={()=>go("testing")}>Bộ kiểm thử <Icon name="chevron" size={16}/></button></div>{commonShell(screens[screen], navScreen)}</div>;
}

function TestingHub({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"plan"|"tasks"|"results"|"report">("plan");
  const tasks = [
    ["T1 – Ghi bữa trưa","Bạn vừa ăn 150 g cơm trắng trong bữa trưa hôm nay. Hãy ghi lại bữa ăn này.","Hôm nay · dữ liệu mẫu","Nhật ký có Cơm trắng, 150 g, 195 kcal"],
    ["T2 – Sửa khẩu phần","Bạn nhận ra mình chỉ ăn 100 g cơm, thay vì lượng vừa ghi. Hãy sửa lại.","Tiếp nối T1","Cơm trắng đổi thành 100 g, tổng giảm 65 kcal"],
    ["T3 – Ghi nước uống","Bạn vừa uống 250 ml nước. Hãy cập nhật thông tin này.","Hôm nay · nước 1.250 ml","Tổng nước tăng chính xác 250 ml"],
    ["T4 – Đổi món","Bạn muốn thay món trong bữa trưa ngày mai bằng một món khác trong danh sách có sẵn.","Thực đơn · ngày mai","Món mới xuất hiện đúng bữa trưa, đúng ngày"],
    ["T5 – Đọc tổng quan","Bạn muốn biết hôm nay đã ghi bao nhiêu năng lượng và bao nhiêu nước. Hãy tìm và giải thích.","Hôm nay · dữ liệu mẫu","Đọc đúng cả năng lượng và nước, kèm đơn vị"],
    ["T6 – Sửa mục tiêu","Trong tình huống giả định này, bạn muốn đổi mục tiêu nước từ 2.000 ml thành 2.200 ml.","Cá nhân · mục tiêu mẫu","Hôm nay hiển thị mục tiêu nước 2.200 ml"],
  ];
  return <div className="testing-hub">
    <aside><Logo light/><div><span className="doc-label">BỘ BÀN GIAO</span><h1>Kế hoạch kiểm thử khả năng sử dụng</h1><p>NutriDaily · Phiên bản 1.0</p></div><nav>{[["plan","Tổng quan"],["tasks","Nhiệm vụ kiểm thử"],["results","Phiếu ghi nhận"],["report","Dàn ý báo cáo"]].map(x=><button className={tab===x[0]?"active":""} onClick={()=>setTab(x[0] as typeof tab)} key={x[0]}><span>{x[1]}</span><Icon name="chevron" size={16}/></button>)}</nav><button className="back-prototype" onClick={onBack}><Icon name="arrow" size={17}/> Quay lại prototype</button></aside>
    <main><header><div><span>TÀI LIỆU ĐIỀU PHỐI</span><h2>{tab==="plan"?"Tổng quan nghiên cứu":tab==="tasks"?"Nhiệm vụ kiểm thử":tab==="results"?"Phiếu ghi nhận kết quả":"Dàn ý báo cáo"}</h2></div><div className="status-pill"><i/> Chờ kiểm thử thực tế</div></header>
    {tab==="plan"&&<div className="doc-content"><div className="notice"><Icon name="help"/><p><b>Lưu ý về tính trung thực nghiên cứu</b><br/>Đối tượng 18–35 tuổi và các nhu cầu trong prototype là <strong>giả định thiết kế cần kiểm chứng</strong>. Tài liệu không chứa kết quả, thời gian hay trích dẫn được tạo sẵn.</p></div><section className="doc-section"><span className="doc-number">01</span><div><h3>Mục tiêu kiểm thử</h3><div className="goal-grid">{["Tìm và ghi món ăn","Hiểu khẩu phần, đơn vị","Nhận ra trạng thái lưu","Sửa hoặc xóa dữ liệu","Phân biệt kế hoạch và đã ăn","Đọc đúng tổng quan"].map(x=><div key={x}><Icon name="check" size={16}/>{x}</div>)}</div></div></section><section className="doc-section"><span className="doc-number">02</span><div><h3>Thiết lập buổi thử</h3><div className="facts"><div><span>Người tham gia</span><b>Tối thiểu 3 người</b><small>Mã hóa P01, P02, P03</small></div><div><span>Thời lượng</span><b>20–30 phút</b><small>Mỗi buổi, có điều phối</small></div><div><span>Phương pháp</span><b>Think aloud</b><small>Nói ra suy nghĩ khi thao tác</small></div></div></div></section><section className="doc-section"><span className="doc-number">03</span><div><h3>Lời mở đầu</h3><blockquote>“Cảm ơn bạn đã tham gia. Chúng tôi đang kiểm tra mức độ dễ sử dụng của ứng dụng, không kiểm tra khả năng của bạn. Trong quá trình thao tác, hãy nói ra điều bạn đang nghĩ. Bạn có thể dừng bất cứ lúc nào. Các thông tin ăn uống trong bài thử là dữ liệu giả định.”</blockquote><p className="consent"><Icon name="check" size={16}/> Hỏi và ghi nhận đồng ý trước nếu có ghi âm hoặc ghi hình.</p></div></section><section className="doc-section"><span className="doc-number">04</span><div><h3>Nguyên tắc điều phối</h3><ul><li>Không chỉ cách thao tác ngay khi người dùng gặp khó khăn.</li><li>Nếu phải hỗ trợ, ghi rõ thời điểm và nội dung hỗ trợ.</li><li>Sau mỗi nhiệm vụ, hỏi mức dễ thực hiện từ 1 đến 7.</li><li>Đặt lại dữ liệu mẫu từ mục Cá nhân giữa các lượt thử.</li></ul></div></section></div>}
    {tab==="tasks"&&<div className="doc-content"><div className="tasks-grid">{tasks.map((t,i)=><article className="task-card" key={t[0]}><div className="task-title"><span>{String(i+1).padStart(2,"0")}</span><div><h3>{t[0]}</h3><p>{t[1]}</p></div></div><dl><div><dt>Trạng thái bắt đầu</dt><dd>{t[2]}</dd></div><div><dt>Điều kiện hoàn thành</dt><dd>{t[3]}</dd></div><div><dt>Tính thời gian</dt><dd>Từ khi đọc xong nhiệm vụ đến khi người dùng xác nhận đã xong.</dd></div><div><dt>Quan sát</dt><dd>Đường đi, lần chạm sai, do dự, hỗ trợ đã cung cấp.</dd></div><div><dt>Đặt lại</dt><dd>{i===1?"Hoàn tất T1 trước; sau T2 đặt lại dữ liệu mẫu.":"Cá nhân → Đặt lại dữ liệu mẫu."}</dd></div></dl></article>)}</div></div>}
    {tab==="results"&&<div className="doc-content"><div className="notice"><Icon name="help"/><p><b>Không điền trước dữ liệu.</b><br/>Chỉ bổ sung thời gian, điểm số, quan sát và phát biểu sau khi đã thử với người thật.</p></div><section className="result-sheet"><h3>Bảng ghi nhận theo nhiệm vụ</h3><div className="table-wrap"><table><thead><tr>{["Mã","Nhiệm vụ","Kết quả","Thời gian","Số lỗi","Hỗ trợ","Mức dễ 1–7","Quan sát / Phát biểu"].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{["P01","P02","P03"].flatMap(p=>["T1","T2","T3","T4","T5","T6"].map(t=><tr key={p+t}><td>{p}</td><td>{t}</td>{Array(6).fill(0).map((_,i)=><td key={i}>Chờ bổ sung</td>)}</tr>))}</tbody></table></div></section><section className="result-sheet"><h3>Câu hỏi cuối buổi</h3><ol><li>Bạn thấy phần nào dễ sử dụng nhất?</li><li>Phần nào làm bạn phải dừng lại suy nghĩ?</li><li>Có từ ngữ hoặc số liệu nào khó hiểu không?</li><li>Bạn có phân biệt được món trong kế hoạch và món đã ăn không?</li><li>Nếu chỉ được thay đổi một điều, bạn muốn thay đổi điều gì?</li></ol></section></div>}
    {tab==="report"&&<div className="doc-content"><div className="report-grid">{["Mục tiêu và phạm vi","Người tham gia và cách tuyển chọn","Thiết bị, bối cảnh và phương pháp","Nhiệm vụ kiểm thử","Kết quả thực tế","Vấn đề và mức ưu tiên","Cải tiến trước / sau","Hạn chế và kế hoạch kiểm thử lại"].map((x,i)=><section key={x}><span>{String(i+1).padStart(2,"0")}</span><h3>{x}</h3><p>{i<4?"Khung nội dung đã chuẩn bị; cập nhật chi tiết theo bối cảnh buổi thử.":"Chờ bổ sung sau kiểm thử thực tế"}</p></section>)}</div><section className="priority-guide"><h3>Khung tổng hợp vấn đề</h3><div className="table-wrap"><table><thead><tr>{["Vấn đề","Bằng chứng quan sát","Người gặp","Ảnh hưởng","Ưu tiên","Nguyên nhân giả định","Cải tiến","Kiểm thử lại"].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody><tr>{Array(8).fill(0).map((_,i)=><td key={i}>Chờ bổ sung</td>)}</tr></tbody></table></div><div className="priority-row"><span><i className="high"/>Cao: chặn tác vụ / lưu sai</span><span><i className="medium"/>Trung bình: cần hỗ trợ / nhầm lẫn</span><span><i className="low"/>Thấp: bất tiện nhỏ</span></div></section></div>}
    </main>
  </div>;
}

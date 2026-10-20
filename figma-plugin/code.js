// NutriDaily Figma Design & Prototype Generator Plugin
// Generates the 11 mobile app screens (390 x 844 px) with exact styling & interactive prototype links

(async () => {
  // 1. Color Palette Definitions
  const COLORS = {
    green950: { r: 0.071, g: 0.216, b: 0.169 }, // #12372b
    green900: { r: 0.090, g: 0.278, b: 0.216 }, // #174737
    green800: { r: 0.114, g: 0.361, b: 0.271 }, // #1d5c45
    green700: { r: 0.157, g: 0.467, b: 0.353 }, // #28775a
    green100: { r: 0.875, g: 0.941, b: 0.906 }, // #dff0e7
    green50:  { r: 0.937, g: 0.973, b: 0.953 }, // #eff8f3
    cream:    { r: 0.973, g: 0.969, b: 0.949 }, // #f8f7f2
    warm:     { r: 0.961, g: 0.933, b: 0.894 }, // #f5eee4
    orange:   { r: 0.929, g: 0.612, b: 0.322 }, // #ed9c52
    orangeSoft: { r: 0.973, g: 0.875, b: 0.780 }, // #f8dfc7
    ink:      { r: 0.090, g: 0.125, b: 0.110 }, // #17201c
    muted:    { r: 0.435, g: 0.478, b: 0.459 }, // #6f7a75
    line:     { r: 0.898, g: 0.914, b: 0.902 }, // #e5e9e6
    white:    { r: 1.000, g: 1.000, b: 1.000 }, // #ffffff
    danger:   { r: 0.741, g: 0.310, b: 0.275 }, // #bd4f46
    waterBg:  { r: 0.910, g: 0.953, b: 0.957 }, // #e8f3f4
    waterIconBg: { r: 0.784, g: 0.894, b: 0.902 }, // #c8e4e6
    waterText: { r: 0.157, g: 0.482, b: 0.510 }, // #287b82
    protein:  { r: 0.937, g: 0.694, b: 0.427 }, // #efb16d
    carb:     { r: 0.576, g: 0.761, b: 0.651 }, // #93c2a6
    fat:      { r: 0.843, g: 0.816, b: 0.553 }, // #d7d08d
  };

  // 2. Load Fonts
  const regularFont = { family: "Inter", style: "Regular" };
  const mediumFont = { family: "Inter", style: "Medium" };
  const semiBoldFont = { family: "Inter", style: "Semi Bold" };
  const boldFont = { family: "Inter", style: "Bold" };

  try {
    await Promise.all([
      figma.loadFontAsync(regularFont),
      figma.loadFontAsync(mediumFont),
      figma.loadFontAsync(semiBoldFont),
      figma.loadFontAsync(boldFont),
    ]);
  } catch (err) {
    console.error("Font loading error:", err);
  }

  // Helper Functions
  function paint(color, opacity = 1) {
    return [{ type: "SOLID", color, opacity }];
  }

  function createText(characters, size = 14, style = "Regular", color = COLORS.ink, width = null) {
    const text = figma.createText();
    text.fontName = style === "Bold" ? boldFont : style === "Semi Bold" ? semiBoldFont : style === "Medium" ? mediumFont : regularFont;
    text.fontSize = size;
    text.fills = paint(color);
    text.characters = characters;
    if (width) {
      text.textAutoResize = "HEIGHT";
      text.resize(width, text.height);
    }
    return text;
  }

  function createScreen(name, x, y) {
    const frame = figma.createFrame();
    frame.name = name;
    frame.resize(390, 844);
    frame.x = x;
    frame.y = y;
    frame.cornerRadius = 42;
    frame.clipsContent = true;
    frame.fills = paint(COLORS.cream);
    frame.strokes = paint(COLORS.green950);
    frame.strokeWeight = 7;
    frame.strokeAlign = "INSIDE";
    return frame;
  }

  function createStatusBar() {
    const bar = figma.createFrame();
    bar.name = "Status Bar";
    bar.resize(390, 31);
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bar.counterAxisAlignItems = "CENTER";
    bar.paddingLeft = 24;
    bar.paddingRight = 24;
    bar.paddingTop = 6;
    bar.fills = paint(COLORS.cream);

    const time = createText("9:41", 11, "Bold", COLORS.ink);
    const icons = createText("●  ◒  100%", 10, "Bold", COLORS.ink);

    bar.appendChild(time);
    bar.appendChild(icons);
    return bar;
  }

  function createHeader(title, showBack = false, actionText = null) {
    const header = figma.createFrame();
    header.name = "App Header";
    header.resize(390, 58);
    header.layoutMode = "HORIZONTAL";
    header.primaryAxisAlignItems = "SPACE_BETWEEN";
    header.counterAxisAlignItems = "CENTER";
    header.paddingLeft = 18;
    header.paddingRight = 18;
    header.fills = paint(COLORS.cream, 0.95);

    // Left
    const leftSlot = figma.createFrame();
    leftSlot.layoutMode = "HORIZONTAL";
    leftSlot.counterAxisAlignItems = "CENTER";
    leftSlot.itemSpacing = 8;
    leftSlot.fills = [];

    let backBtn = null;
    if (showBack) {
      backBtn = figma.createFrame();
      backBtn.name = "Back Button";
      backBtn.resize(34, 34);
      backBtn.cornerRadius = 17;
      backBtn.layoutMode = "HORIZONTAL";
      backBtn.primaryAxisAlignItems = "CENTER";
      backBtn.counterAxisAlignItems = "CENTER";
      backBtn.fills = paint(COLORS.cream);
      const arrow = createText("←", 18, "Bold", COLORS.green900);
      backBtn.appendChild(arrow);
      leftSlot.appendChild(backBtn);
    } else {
      const logoBox = figma.createFrame();
      logoBox.resize(28, 28);
      logoBox.cornerRadius = 9;
      logoBox.fills = paint(COLORS.green900);
      logoBox.layoutMode = "HORIZONTAL";
      logoBox.primaryAxisAlignItems = "CENTER";
      logoBox.counterAxisAlignItems = "CENTER";
      logoBox.appendChild(createText("🌱", 14, "Regular", COLORS.white));
      leftSlot.appendChild(logoBox);

      const brand = createText("NutriDaily", 16, "Bold", COLORS.green900);
      leftSlot.appendChild(brand);
    }
    header.appendChild(leftSlot);

    // Title Center
    const titleText = createText(title, 16, "Bold", COLORS.ink);
    header.appendChild(titleText);

    // Right Action
    const rightSlot = figma.createFrame();
    rightSlot.layoutMode = "HORIZONTAL";
    rightSlot.counterAxisAlignItems = "CENTER";
    rightSlot.primaryAxisAlignItems = "MAX";
    rightSlot.resize(40, 36);
    rightSlot.fills = [];

    let actionBtn = null;
    if (actionText === "avatar") {
      actionBtn = figma.createFrame();
      actionBtn.name = "Avatar Button";
      actionBtn.resize(34, 34);
      actionBtn.cornerRadius = 17;
      actionBtn.fills = paint(COLORS.green100);
      actionBtn.layoutMode = "HORIZONTAL";
      actionBtn.primaryAxisAlignItems = "CENTER";
      actionBtn.counterAxisAlignItems = "CENTER";
      actionBtn.appendChild(createText("AN", 11, "Bold", COLORS.green900));
      rightSlot.appendChild(actionBtn);
    } else if (actionText === "plus") {
      actionBtn = figma.createFrame();
      actionBtn.name = "Header Plus Button";
      actionBtn.resize(34, 34);
      actionBtn.cornerRadius = 17;
      actionBtn.fills = paint(COLORS.green100);
      actionBtn.layoutMode = "HORIZONTAL";
      actionBtn.primaryAxisAlignItems = "CENTER";
      actionBtn.counterAxisAlignItems = "CENTER";
      actionBtn.appendChild(createText("+", 18, "Bold", COLORS.green900));
      rightSlot.appendChild(actionBtn);
    } else if (actionText === "trash") {
      actionBtn = figma.createFrame();
      actionBtn.name = "Header Trash Button";
      actionBtn.resize(34, 34);
      actionBtn.cornerRadius = 17;
      actionBtn.fills = paint(COLORS.warm);
      actionBtn.layoutMode = "HORIZONTAL";
      actionBtn.primaryAxisAlignItems = "CENTER";
      actionBtn.counterAxisAlignItems = "CENTER";
      actionBtn.appendChild(createText("🗑", 14, "Regular", COLORS.danger));
      rightSlot.appendChild(actionBtn);
    }
    header.appendChild(rightSlot);

    return { header, backBtn, actionBtn };
  }

  function createBottomNav(activeKey) {
    const nav = figma.createFrame();
    nav.name = "Bottom Navigation";
    nav.resize(390, 77);
    nav.layoutMode = "HORIZONTAL";
    nav.primaryAxisAlignItems = "SPACE_BETWEEN";
    nav.counterAxisAlignItems = "CENTER";
    nav.paddingLeft = 12;
    nav.paddingRight = 12;
    nav.paddingBottom = 8;
    nav.fills = paint(COLORS.white, 0.98);
    nav.strokes = paint(COLORS.line);
    nav.strokeWeight = 1;
    nav.strokeAlign = "INSIDE";

    const items = [
      { key: "today", label: "Hôm nay", icon: "⌂" },
      { key: "diary", label: "Nhật ký", icon: "📖" },
      { key: "planner", label: "Thực đơn", icon: "📅" },
      { key: "progress", label: "Tiến độ", icon: "📊" },
      { key: "profile", label: "Cá nhân", icon: "👤" },
    ];

    const buttons = {};

    for (const item of items) {
      const isActive = item.key === activeKey;
      const btn = figma.createFrame();
      btn.name = `Nav - ${item.label}`;
      btn.resize(68, 56);
      btn.layoutMode = "VERTICAL";
      btn.primaryAxisAlignItems = "CENTER";
      btn.counterAxisAlignItems = "CENTER";
      btn.itemSpacing = 3;
      btn.fills = [];

      const icon = createText(item.icon, 18, "Regular", isActive ? COLORS.green800 : COLORS.muted);
      const label = createText(item.label, 10, isActive ? "Bold" : "Medium", isActive ? COLORS.green800 : COLORS.muted);

      btn.appendChild(icon);
      btn.appendChild(label);
      nav.appendChild(btn);

      buttons[item.key] = btn;
    }

    return { nav, buttons };
  }

  function createButton(label, variant = "primary", icon = null, width = 354) {
    const btn = figma.createFrame();
    btn.name = `Button - ${label}`;
    btn.resize(width, 50);
    btn.cornerRadius = 15;
    btn.layoutMode = "HORIZONTAL";
    btn.primaryAxisAlignItems = "CENTER";
    btn.counterAxisAlignItems = "CENTER";
    btn.itemSpacing = 8;

    let bg = COLORS.green900;
    let fg = COLORS.white;

    if (variant === "secondary") {
      bg = COLORS.white;
      fg = COLORS.green900;
      btn.strokes = paint(COLORS.line);
      btn.strokeWeight = 1;
    } else if (variant === "ghost") {
      bg = COLORS.cream;
      fg = COLORS.green900;
    } else if (variant === "danger") {
      bg = COLORS.danger;
      fg = COLORS.white;
    }

    btn.fills = paint(bg);

    if (icon) {
      btn.appendChild(createText(icon, 16, "Regular", fg));
    }
    btn.appendChild(createText(label, 14, "Bold", fg));
    return btn;
  }

  // Reaction Helper for Prototyping
  async function connectNodes(sourceNode, targetNode, transitionType = "SMART_ANIMATE") {
    if (!sourceNode || !targetNode) return;
    try {
      await sourceNode.setReactionsAsync([
        {
          trigger: { type: "ON_CLICK" },
          actions: [
            {
              type: "NODE",
              destinationId: targetNode.id,
              navigation: "NAVIGATE",
              transition: {
                type: transitionType,
                easing: { type: "EASE_OUT" },
                duration: 0.25,
              },
              preserveScrollPosition: true,
            },
          ],
        },
      ]);
    } catch (err) {
      console.warn("Could not connect prototype reaction:", err);
    }
  }

  // -------------------------------------------------------------
  // BUILD SCREENS
  // -------------------------------------------------------------
  const screens = {};
  const interactiveNodes = {};

  // SCREEN 1: WELCOME
  (() => {
    const frame = createScreen("01_Welcome", 0, 0);
    frame.appendChild(createStatusBar());

    // Art Hero Header
    const hero = figma.createFrame();
    hero.name = "Welcome Hero Banner";
    hero.resize(390, 315);
    hero.y = 31;
    hero.fills = paint(COLORS.green900);
    hero.cornerRadius = 0;

    const sun = figma.createEllipse();
    sun.resize(150, 150);
    sun.x = 210;
    sun.y = 40;
    sun.fills = paint({ r: 0.949, g: 0.714, b: 0.435 }, 0.9);
    hero.appendChild(sun);

    const plate = figma.createEllipse();
    plate.resize(180, 180);
    plate.x = 80;
    plate.y = 80;
    plate.fills = paint(COLORS.white);
    plate.strokes = paint({ r: 0.933, g: 0.918, b: 0.878 });
    plate.strokeWeight = 16;
    hero.appendChild(plate);

    const leaf = createText("🍃", 44, "Regular", COLORS.green700);
    leaf.x = 145;
    leaf.y = 145;
    hero.appendChild(leaf);
    frame.appendChild(hero);

    // Content container
    const content = figma.createFrame();
    content.name = "Welcome Content";
    content.resize(354, 450);
    content.x = 18;
    content.y = 365;
    content.layoutMode = "VERTICAL";
    content.itemSpacing = 16;
    content.fills = [];

    const logoRow = figma.createFrame();
    logoRow.layoutMode = "HORIZONTAL";
    logoRow.counterAxisAlignItems = "CENTER";
    logoRow.itemSpacing = 8;
    logoRow.fills = [];
    const iconB = figma.createFrame();
    iconB.resize(32, 32);
    iconB.cornerRadius = 10;
    iconB.fills = paint(COLORS.green900);
    iconB.appendChild(createText("🌱", 16, "Regular", COLORS.white));
    logoRow.appendChild(iconB);
    logoRow.appendChild(createText("NutriDaily", 18, "Bold", COLORS.green900));
    content.appendChild(logoRow);

    const title = createText("Hiểu bữa ăn,\nduy trì thói quen tốt.", 32, "Bold", COLORS.green950, 354);
    content.appendChild(title);

    const desc = createText("Theo dõi dinh dưỡng theo cách nhẹ nhàng, đơn giản và phù hợp với nhịp sống của bạn.", 15, "Regular", COLORS.muted, 354);
    content.appendChild(desc);

    const spacer = figma.createFrame();
    spacer.resize(354, 40);
    spacer.fills = [];
    content.appendChild(spacer);

    const startBtn = createButton("Bắt đầu", "primary");
    const exploreBtn = createButton("Khám phá bản mẫu", "secondary");
    content.appendChild(startBtn);
    content.appendChild(exploreBtn);

    frame.appendChild(content);

    screens.welcome = frame;
    interactiveNodes.welcomeStart = startBtn;
    interactiveNodes.welcomeExplore = exploreBtn;
  })();

  // SCREEN 2: SETUP
  (() => {
    const frame = createScreen("02_Setup", 460, 0);
    frame.appendChild(createStatusBar());
    const { header, backBtn } = createHeader("Thiết lập mục tiêu", true);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Setup Body";
    body.resize(354, 730);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    body.appendChild(createText("BƯỚC 1 / 1", 10, "Bold", COLORS.green700));
    body.appendChild(createText("Mục tiêu của bạn là gì?", 24, "Bold", COLORS.ink));
    body.appendChild(createText("Chọn điều bạn muốn tập trung. Bạn có thể thay đổi bất cứ lúc nào.", 13, "Regular", COLORS.muted, 354));

    const options = [
      { title: "Ăn uống cân bằng", desc: "Xây dựng thói quen bền vững", icon: "🍃", selected: true },
      { title: "Duy trì cân nặng", desc: "Theo sát mức năng lượng mỗi ngày", icon: "🎯", selected: false },
      { title: "Theo dõi dinh dưỡng", desc: "Hiểu rõ hơn về bữa ăn", icon: "📊", selected: false },
    ];

    for (const opt of options) {
      const card = figma.createFrame();
      card.resize(354, 60);
      card.cornerRadius = 15;
      card.layoutMode = "HORIZONTAL";
      card.counterAxisAlignItems = "CENTER";
      card.paddingLeft = 14;
      card.paddingRight = 14;
      card.itemSpacing = 12;
      card.fills = paint(opt.selected ? COLORS.green50 : COLORS.white);
      card.strokes = paint(opt.selected ? COLORS.green700 : COLORS.line);
      card.strokeWeight = 1;

      const iconBox = figma.createFrame();
      iconBox.resize(38, 38);
      iconBox.cornerRadius = 10;
      iconBox.fills = paint(COLORS.green100);
      iconBox.layoutMode = "HORIZONTAL";
      iconBox.primaryAxisAlignItems = "CENTER";
      iconBox.counterAxisAlignItems = "CENTER";
      iconBox.appendChild(createText(opt.icon, 18, "Regular", COLORS.green800));
      card.appendChild(iconBox);

      const textCol = figma.createFrame();
      textCol.layoutMode = "VERTICAL";
      textCol.resize(230, 36);
      textCol.itemSpacing = 2;
      textCol.fills = [];
      textCol.appendChild(createText(opt.title, 13, "Bold", COLORS.ink));
      textCol.appendChild(createText(opt.desc, 11, "Regular", COLORS.muted));
      card.appendChild(textCol);

      if (opt.selected) {
        const check = createText("✓", 14, "Bold", COLORS.green700);
        card.appendChild(check);
      }
      body.appendChild(card);
    }

    // Input fields
    const fieldsTitle = figma.createFrame();
    fieldsTitle.resize(354, 24);
    fieldsTitle.layoutMode = "HORIZONTAL";
    fieldsTitle.primaryAxisAlignItems = "SPACE_BETWEEN";
    fieldsTitle.fills = [];
    fieldsTitle.appendChild(createText("Mục tiêu mỗi ngày", 13, "Bold", COLORS.ink));
    fieldsTitle.appendChild(createText("Minh họa", 10, "Bold", COLORS.orange));
    body.appendChild(fieldsTitle);

    function createInputField(label, val, unit) {
      const box = figma.createFrame();
      box.resize(354, 48);
      box.cornerRadius = 13;
      box.fills = paint(COLORS.white);
      box.strokes = paint(COLORS.line);
      box.strokeWeight = 1;
      box.layoutMode = "HORIZONTAL";
      box.primaryAxisAlignItems = "SPACE_BETWEEN";
      box.counterAxisAlignItems = "CENTER";
      box.paddingLeft = 14;
      box.paddingRight = 14;
      box.appendChild(createText(label, 12, "Medium", COLORS.muted));
      const valWrap = figma.createFrame();
      valWrap.layoutMode = "HORIZONTAL";
      valWrap.itemSpacing = 4;
      valWrap.counterAxisAlignItems = "CENTER";
      valWrap.fills = [];
      valWrap.appendChild(createText(val, 14, "Bold", COLORS.ink));
      valWrap.appendChild(createText(unit, 11, "Regular", COLORS.muted));
      box.appendChild(valWrap);
      return box;
    }

    body.appendChild(createInputField("Năng lượng", "2000", "kcal"));
    body.appendChild(createInputField("Nước uống", "2000", "ml"));

    const saveBtn = createButton("Lưu và tiếp tục", "primary");
    const skipBtn = createButton("Bỏ qua, dùng mục tiêu mẫu", "ghost");
    body.appendChild(saveBtn);
    body.appendChild(skipBtn);

    frame.appendChild(body);

    screens.setup = frame;
    interactiveNodes.setupBack = backBtn;
    interactiveNodes.setupSave = saveBtn;
    interactiveNodes.setupSkip = skipBtn;
  })();

  // SCREEN 3: TODAY (DASHBOARD)
  (() => {
    const frame = createScreen("03_Today", 920, 0);
    frame.appendChild(createStatusBar());
    const { header, actionBtn } = createHeader("Hôm nay", false, "avatar");
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Today Scroll Content";
    body.resize(354, 670);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    body.appendChild(createText("THỨ NĂM, 19 THÁNG 6", 10, "Bold", COLORS.green700));
    body.appendChild(createText("Chào buổi sáng, An", 24, "Bold", COLORS.ink));

    // Energy Card
    const energyCard = figma.createFrame();
    energyCard.name = "Energy Card";
    energyCard.resize(354, 180);
    energyCard.cornerRadius = 20;
    energyCard.fills = paint(COLORS.green900);
    energyCard.paddingLeft = 18;
    energyCard.paddingRight = 18;
    energyCard.paddingTop = 16;
    energyCard.paddingBottom = 16;
    energyCard.layoutMode = "VERTICAL";
    energyCard.itemSpacing = 12;

    const cardTop = figma.createFrame();
    cardTop.resize(318, 28);
    cardTop.layoutMode = "HORIZONTAL";
    cardTop.primaryAxisAlignItems = "SPACE_BETWEEN";
    cardTop.counterAxisAlignItems = "CENTER";
    cardTop.fills = [];
    const topText = figma.createFrame();
    topText.layoutMode = "VERTICAL";
    topText.itemSpacing = 2;
    topText.fills = [];
    topText.appendChild(createText("Năng lượng đã ghi", 10, "Regular", COLORS.green100));
    topText.appendChild(createText("Còn 1.357 kcal", 13, "Bold", COLORS.white));
    cardTop.appendChild(topText);

    const detailBtn = figma.createFrame();
    detailBtn.name = "Energy Detail Link";
    detailBtn.layoutMode = "HORIZONTAL";
    detailBtn.itemSpacing = 4;
    detailBtn.counterAxisAlignItems = "CENTER";
    detailBtn.fills = [];
    detailBtn.appendChild(createText("Xem chi tiết ›", 11, "Medium", COLORS.green100));
    cardTop.appendChild(detailBtn);
    energyCard.appendChild(cardTop);

    // Energy Main Ring + Macros
    const energyMain = figma.createFrame();
    energyMain.resize(318, 100);
    energyMain.layoutMode = "HORIZONTAL";
    energyMain.primaryAxisAlignItems = "SPACE_BETWEEN";
    energyMain.counterAxisAlignItems = "CENTER";
    energyMain.fills = [];

    const ringFrame = figma.createFrame();
    ringFrame.resize(100, 100);
    ringFrame.cornerRadius = 50;
    ringFrame.fills = paint(COLORS.green800);
    ringFrame.strokes = paint(COLORS.orange);
    ringFrame.strokeWeight = 10;
    ringFrame.layoutMode = "VERTICAL";
    ringFrame.primaryAxisAlignItems = "CENTER";
    ringFrame.counterAxisAlignItems = "CENTER";
    ringFrame.itemSpacing = 2;
    ringFrame.appendChild(createText("643", 20, "Bold", COLORS.white));
    ringFrame.appendChild(createText("/ 2.000 kcal", 8, "Regular", COLORS.green100));
    energyMain.appendChild(ringFrame);

    const macroCol = figma.createFrame();
    macroCol.resize(180, 80);
    macroCol.layoutMode = "VERTICAL";
    macroCol.itemSpacing = 8;
    macroCol.fills = [];

    function createMacroLine(name, val, color) {
      const line = figma.createFrame();
      line.resize(180, 18);
      line.layoutMode = "HORIZONTAL";
      line.primaryAxisAlignItems = "SPACE_BETWEEN";
      line.counterAxisAlignItems = "CENTER";
      line.fills = [];
      const tag = figma.createFrame();
      tag.layoutMode = "HORIZONTAL";
      tag.itemSpacing = 6;
      tag.counterAxisAlignItems = "CENTER";
      tag.fills = [];
      const dot = figma.createEllipse();
      dot.resize(8, 8);
      dot.fills = paint(color);
      tag.appendChild(dot);
      tag.appendChild(createText(name, 11, "Regular", COLORS.white));
      line.appendChild(tag);
      line.appendChild(createText(val, 11, "Bold", COLORS.white));
      return line;
    }

    macroCol.appendChild(createMacroLine("Chất đạm", "51 g", COLORS.protein));
    macroCol.appendChild(createMacroLine("Tinh bột", "86 g", COLORS.carb));
    macroCol.appendChild(createMacroLine("Chất béo", "24 g", COLORS.fat));
    energyMain.appendChild(macroCol);
    energyCard.appendChild(energyMain);
    body.appendChild(energyCard);

    // Meal section header
    const mealHead = figma.createFrame();
    mealHead.resize(354, 32);
    mealHead.layoutMode = "HORIZONTAL";
    mealHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    mealHead.counterAxisAlignItems = "CENTER";
    mealHead.fills = [];
    mealHead.appendChild(createText("Bữa ăn hôm nay", 15, "Bold", COLORS.ink));

    const addMealBtn = figma.createFrame();
    addMealBtn.name = "Add Meal Small Button";
    addMealBtn.resize(96, 30);
    addMealBtn.cornerRadius = 8;
    addMealBtn.fills = paint(COLORS.green100);
    addMealBtn.layoutMode = "HORIZONTAL";
    addMealBtn.primaryAxisAlignItems = "CENTER";
    addMealBtn.counterAxisAlignItems = "CENTER";
    addMealBtn.itemSpacing = 4;
    addMealBtn.appendChild(createText("+ Thêm món", 11, "Bold", COLORS.green900));
    mealHead.appendChild(addMealBtn);
    body.appendChild(mealHead);

    // Meal rows
    const mealCard = figma.createFrame();
    mealCard.resize(354, 180);
    mealCard.cornerRadius = 16;
    mealCard.fills = paint(COLORS.white);
    mealCard.strokes = paint(COLORS.line);
    mealCard.strokeWeight = 1;
    mealCard.layoutMode = "VERTICAL";
    mealCard.paddingTop = 4;
    mealCard.paddingBottom = 4;

    const meals = [
      { name: "Sáng", food: "Bánh mì trứng", kcal: "343 kcal" },
      { name: "Trưa", food: "Ức gà áp chảo, Rau luộc", kcal: "200 kcal" },
      { name: "Tối", food: "Chưa ghi món", kcal: "0 kcal" },
      { name: "Bữa phụ", food: "Sữa chua", kcal: "100 kcal" },
    ];

    const mealRowBtns = [];
    for (const m of meals) {
      const row = figma.createFrame();
      row.name = `Meal Row - ${m.name}`;
      row.resize(354, 42);
      row.layoutMode = "HORIZONTAL";
      row.counterAxisAlignItems = "CENTER";
      row.paddingLeft = 12;
      row.paddingRight = 12;
      row.primaryAxisAlignItems = "SPACE_BETWEEN";
      row.fills = [];

      const left = figma.createFrame();
      left.layoutMode = "HORIZONTAL";
      left.counterAxisAlignItems = "CENTER";
      left.itemSpacing = 8;
      left.fills = [];
      const badge = figma.createFrame();
      badge.resize(24, 24);
      badge.cornerRadius = 6;
      badge.fills = paint(COLORS.warm);
      badge.layoutMode = "HORIZONTAL";
      badge.primaryAxisAlignItems = "CENTER";
      badge.counterAxisAlignItems = "CENTER";
      badge.appendChild(createText(m.name[0], 10, "Bold", { r: 0.545, g: 0.376, b: 0.231 }));
      left.appendChild(badge);

      const titleWrap = figma.createFrame();
      titleWrap.layoutMode = "VERTICAL";
      titleWrap.fills = [];
      titleWrap.appendChild(createText(m.name, 11, "Bold", COLORS.ink));
      titleWrap.appendChild(createText(m.food, 9, "Regular", COLORS.muted));
      left.appendChild(titleWrap);
      row.appendChild(left);

      const right = figma.createFrame();
      right.layoutMode = "HORIZONTAL";
      right.itemSpacing = 4;
      right.counterAxisAlignItems = "CENTER";
      right.fills = [];
      right.appendChild(createText(m.kcal, 10, "Regular", COLORS.muted));
      right.appendChild(createText("›", 12, "Bold", COLORS.muted));
      row.appendChild(right);

      mealCard.appendChild(row);
      mealRowBtns.push(row);
    }
    body.appendChild(mealCard);

    // Water Card
    const waterCard = figma.createFrame();
    waterCard.resize(354, 68);
    waterCard.cornerRadius = 16;
    waterCard.fills = paint(COLORS.waterBg);
    waterCard.layoutMode = "HORIZONTAL";
    waterCard.primaryAxisAlignItems = "SPACE_BETWEEN";
    waterCard.counterAxisAlignItems = "CENTER";
    waterCard.paddingLeft = 14;
    waterCard.paddingRight = 14;

    const wLeft = figma.createFrame();
    wLeft.layoutMode = "HORIZONTAL";
    wLeft.counterAxisAlignItems = "CENTER";
    wLeft.itemSpacing = 10;
    wLeft.fills = [];
    const wIcon = figma.createFrame();
    wIcon.resize(36, 36);
    wIcon.cornerRadius = 10;
    wIcon.fills = paint(COLORS.waterIconBg);
    wIcon.layoutMode = "HORIZONTAL";
    wIcon.primaryAxisAlignItems = "CENTER";
    wIcon.counterAxisAlignItems = "CENTER";
    wIcon.appendChild(createText("💧", 16, "Regular", COLORS.waterText));
    wLeft.appendChild(wIcon);

    const wText = figma.createFrame();
    wText.layoutMode = "VERTICAL";
    wText.itemSpacing = 2;
    wText.fills = [];
    wText.appendChild(createText("Nước hôm nay", 10, "Medium", COLORS.waterText));
    wText.appendChild(createText("1.250 / 2.000 ml", 12, "Bold", COLORS.ink));
    wLeft.appendChild(wText);
    waterCard.appendChild(wLeft);

    const wAdd = figma.createFrame();
    wAdd.resize(70, 32);
    wAdd.cornerRadius = 8;
    wAdd.fills = paint(COLORS.white);
    wAdd.layoutMode = "HORIZONTAL";
    wAdd.primaryAxisAlignItems = "CENTER";
    wAdd.counterAxisAlignItems = "CENTER";
    wAdd.appendChild(createText("+250 ml", 10, "Bold", COLORS.waterText));
    waterCard.appendChild(wAdd);
    body.appendChild(waterCard);

    // Planner Link
    const planLink = figma.createFrame();
    planLink.name = "Today to Planner Link";
    planLink.resize(354, 38);
    planLink.layoutMode = "HORIZONTAL";
    planLink.primaryAxisAlignItems = "SPACE_BETWEEN";
    planLink.counterAxisAlignItems = "CENTER";
    planLink.fills = [];
    const pLeft = figma.createFrame();
    pLeft.layoutMode = "HORIZONTAL";
    pLeft.itemSpacing = 8;
    pLeft.counterAxisAlignItems = "CENTER";
    pLeft.fills = [];
    pLeft.appendChild(createText("📅", 14, "Regular", COLORS.green800));
    pLeft.appendChild(createText("Xem thực đơn hôm nay", 12, "Bold", COLORS.green800));
    planLink.appendChild(pLeft);
    planLink.appendChild(createText("›", 14, "Bold", COLORS.green800));
    body.appendChild(planLink);

    frame.appendChild(body);

    const { nav, buttons: navBtns } = createBottomNav("today");
    nav.y = 844 - 77;
    frame.appendChild(nav);

    screens.today = frame;
    interactiveNodes.todayAvatar = actionBtn;
    interactiveNodes.todayEnergyDetail = detailBtn;
    interactiveNodes.todayAddMeal = addMealBtn;
    interactiveNodes.todayMealRows = mealRowBtns;
    interactiveNodes.todayPlanLink = planLink;
    interactiveNodes.todayNav = navBtns;
  })();

  // SCREEN 4: DIARY
  (() => {
    const frame = createScreen("04_Diary", 1380, 0);
    frame.appendChild(createStatusBar());
    const { header, actionBtn } = createHeader("Nhật ký ăn uống", false, "plus");
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Diary Body";
    body.resize(354, 670);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Date Picker Strip
    const datePicker = figma.createFrame();
    datePicker.resize(354, 44);
    datePicker.cornerRadius = 14;
    datePicker.fills = paint(COLORS.white);
    datePicker.strokes = paint(COLORS.line);
    datePicker.strokeWeight = 1;
    datePicker.layoutMode = "HORIZONTAL";
    datePicker.primaryAxisAlignItems = "SPACE_BETWEEN";
    datePicker.counterAxisAlignItems = "CENTER";
    datePicker.paddingLeft = 14;
    datePicker.paddingRight = 14;
    datePicker.appendChild(createText("‹", 18, "Bold", COLORS.muted));
    const dMid = figma.createFrame();
    dMid.layoutMode = "VERTICAL";
    dMid.counterAxisAlignItems = "CENTER";
    dMid.fills = [];
    dMid.appendChild(createText("Hôm nay", 12, "Bold", COLORS.ink));
    dMid.appendChild(createText("Thứ Năm, 19/06", 9, "Regular", COLORS.muted));
    datePicker.appendChild(dMid);
    datePicker.appendChild(createText("›", 18, "Bold", COLORS.muted));
    body.appendChild(datePicker);

    // Diary Summary
    const sumCard = figma.createFrame();
    sumCard.resize(354, 64);
    sumCard.cornerRadius = 16;
    sumCard.fills = paint(COLORS.green900);
    sumCard.layoutMode = "HORIZONTAL";
    sumCard.primaryAxisAlignItems = "SPACE_AROUND";
    sumCard.counterAxisAlignItems = "CENTER";

    const s1 = figma.createFrame();
    s1.layoutMode = "VERTICAL";
    s1.itemSpacing = 2;
    s1.fills = [];
    s1.appendChild(createText("Tổng năng lượng", 9, "Regular", COLORS.green100));
    s1.appendChild(createText("643 kcal", 15, "Bold", COLORS.white));
    sumCard.appendChild(s1);

    const sDivider = figma.createFrame();
    sDivider.resize(1, 36);
    sDivider.fills = paint(COLORS.white, 0.2);
    sumCard.appendChild(sDivider);

    const s2 = figma.createFrame();
    s2.layoutMode = "VERTICAL";
    s2.itemSpacing = 2;
    s2.fills = [];
    s2.appendChild(createText("Mục tiêu", 9, "Regular", COLORS.green100));
    s2.appendChild(createText("2.000 kcal", 15, "Bold", COLORS.white));
    sumCard.appendChild(s2);
    body.appendChild(sumCard);

    // Meal List Items
    const foodLines = [];
    const diaryMeals = [
      { section: "Sáng", total: "343 kcal", items: [{ name: "Bánh mì trứng", portion: "1 phần", kcal: "343 kcal" }] },
      { section: "Trưa", total: "200 kcal", items: [{ name: "Ức gà áp chảo", portion: "100 g", kcal: "165 kcal" }, { name: "Rau luộc", portion: "100 g", kcal: "35 kcal" }] },
      { section: "Bữa phụ", total: "100 kcal", items: [{ name: "Sữa chua", portion: "1 hộp", kcal: "100 kcal" }] },
    ];

    for (const group of diaryMeals) {
      const gBox = figma.createFrame();
      gBox.resize(354, group.items.length * 52 + 28);
      gBox.layoutMode = "VERTICAL";
      gBox.itemSpacing = 4;
      gBox.fills = [];

      const gHead = figma.createFrame();
      gHead.resize(354, 20);
      gHead.layoutMode = "HORIZONTAL";
      gHead.primaryAxisAlignItems = "SPACE_BETWEEN";
      gHead.fills = [];
      gHead.appendChild(createText(group.section, 14, "Bold", COLORS.ink));
      gHead.appendChild(createText(group.total, 11, "Medium", COLORS.muted));
      gBox.appendChild(gHead);

      for (const item of group.items) {
        const line = figma.createFrame();
        line.name = `Food Line - ${item.name}`;
        line.resize(354, 48);
        line.layoutMode = "HORIZONTAL";
        line.counterAxisAlignItems = "CENTER";
        line.primaryAxisAlignItems = "SPACE_BETWEEN";
        line.strokes = paint(COLORS.line);
        line.strokeWeight = 1;
        line.strokeAlign = "INSIDE";
        line.fills = [];

        const left = figma.createFrame();
        left.layoutMode = "HORIZONTAL";
        left.counterAxisAlignItems = "CENTER";
        left.itemSpacing = 8;
        left.fills = [];
        const thumb = figma.createFrame();
        thumb.resize(30, 30);
        thumb.cornerRadius = 8;
        thumb.fills = paint(COLORS.green100);
        thumb.appendChild(createText("🍃", 14, "Regular", COLORS.green800));
        left.appendChild(thumb);

        const tw = figma.createFrame();
        tw.layoutMode = "VERTICAL";
        tw.fills = [];
        tw.appendChild(createText(item.name, 12, "Bold", COLORS.ink));
        tw.appendChild(createText(item.portion, 10, "Regular", COLORS.muted));
        left.appendChild(tw);
        line.appendChild(left);

        const right = figma.createFrame();
        right.layoutMode = "HORIZONTAL";
        right.itemSpacing = 4;
        right.counterAxisAlignItems = "CENTER";
        right.fills = [];
        right.appendChild(createText(item.kcal, 11, "Bold", COLORS.muted));
        right.appendChild(createText("›", 14, "Bold", COLORS.muted));
        line.appendChild(right);

        gBox.appendChild(line);
        foodLines.push(line);
      }
      body.appendChild(gBox);
    }

    const diaryAddBtn = createButton("+ Thêm món", "primary");
    body.appendChild(diaryAddBtn);
    frame.appendChild(body);

    const { nav, buttons: navBtns } = createBottomNav("diary");
    nav.y = 844 - 77;
    frame.appendChild(nav);

    screens.diary = frame;
    interactiveNodes.diaryHeaderPlus = actionBtn;
    interactiveNodes.diaryAddBtn = diaryAddBtn;
    interactiveNodes.diaryFoodLines = foodLines;
    interactiveNodes.diaryNav = navBtns;
  })();

  // SCREEN 5: SEARCH
  (() => {
    const frame = createScreen("05_Search", 1840, 0);
    frame.appendChild(createStatusBar());
    const { header, backBtn } = createHeader("Thêm món ăn", true);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Search Body";
    body.resize(354, 730);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Search Input Bar
    const sBar = figma.createFrame();
    sBar.resize(354, 46);
    sBar.cornerRadius = 14;
    sBar.fills = paint(COLORS.white);
    sBar.strokes = paint(COLORS.line);
    sBar.strokeWeight = 1;
    sBar.layoutMode = "HORIZONTAL";
    sBar.counterAxisAlignItems = "CENTER";
    sBar.paddingLeft = 14;
    sBar.paddingRight = 14;
    sBar.itemSpacing = 10;
    sBar.appendChild(createText("🔍", 14, "Regular", COLORS.muted));
    sBar.appendChild(createText("Cơm trắng", 13, "Bold", COLORS.ink));
    body.appendChild(sBar);

    // Filter Chips
    const chips = figma.createFrame();
    chips.resize(354, 34);
    chips.layoutMode = "HORIZONTAL";
    chips.itemSpacing = 8;
    chips.fills = [];

    function makeChip(txt, active = false) {
      const chip = figma.createFrame();
      chip.cornerRadius = 16;
      chip.paddingLeft = 14;
      chip.paddingRight = 14;
      chip.paddingTop = 6;
      chip.paddingBottom = 6;
      chip.fills = paint(active ? COLORS.green900 : COLORS.white);
      if (!active) {
        chip.strokes = paint(COLORS.line);
        chip.strokeWeight = 1;
      }
      chip.appendChild(createText(txt, 11, active ? "Bold" : "Regular", active ? COLORS.white : COLORS.ink));
      return chip;
    }
    chips.appendChild(makeChip("Tất cả", true));
    chips.appendChild(makeChip("Gần đây", false));
    chips.appendChild(makeChip("Phổ biến", false));
    body.appendChild(chips);

    body.appendChild(createText("Gợi ý cho bạn (8 món)", 13, "Bold", COLORS.ink));

    // Results List
    const resBox = figma.createFrame();
    resBox.resize(354, 460);
    resBox.cornerRadius = 18;
    resBox.fills = paint(COLORS.white);
    resBox.strokes = paint(COLORS.line);
    resBox.strokeWeight = 1;
    resBox.layoutMode = "VERTICAL";

    const foods = [
      { name: "Cơm trắng", desc: "100 g · 130 kcal", tag: "Gần đây" },
      { name: "Phở bò", desc: "1 tô · 350 kcal", tag: "Phổ biến" },
      { name: "Bánh mì", desc: "1 ổ · 265 kcal", tag: "Phổ biến" },
      { name: "Ức gà áp chảo", desc: "100 g · 165 kcal", tag: "Gần đây" },
      { name: "Trứng luộc", desc: "1 quả · 78 kcal", tag: "Phổ biến" },
      { name: "Rau luộc", desc: "100 g · 35 kcal", tag: "Phổ biến" },
    ];

    const foodResults = [];
    for (const f of foods) {
      const row = figma.createFrame();
      row.name = `Food Result - ${f.name}`;
      row.resize(354, 58);
      row.layoutMode = "HORIZONTAL";
      row.counterAxisAlignItems = "CENTER";
      row.primaryAxisAlignItems = "SPACE_BETWEEN";
      row.paddingLeft = 14;
      row.paddingRight = 14;
      row.strokes = paint(COLORS.line);
      row.strokeWeight = 1;
      row.strokeAlign = "INSIDE";
      row.fills = [];

      const left = figma.createFrame();
      left.layoutMode = "HORIZONTAL";
      left.counterAxisAlignItems = "CENTER";
      left.itemSpacing = 10;
      left.fills = [];
      const th = figma.createFrame();
      th.resize(34, 34);
      th.cornerRadius = 10;
      th.fills = paint(COLORS.green100);
      th.appendChild(createText("🍚", 16, "Regular", COLORS.green900));
      left.appendChild(th);

      const tw = figma.createFrame();
      tw.layoutMode = "VERTICAL";
      tw.fills = [];
      tw.appendChild(createText(f.name, 12, "Bold", COLORS.ink));
      tw.appendChild(createText(f.desc, 10, "Regular", COLORS.muted));
      left.appendChild(tw);
      row.appendChild(left);

      const right = figma.createFrame();
      right.layoutMode = "HORIZONTAL";
      right.itemSpacing = 6;
      right.counterAxisAlignItems = "CENTER";
      right.fills = [];
      const tagBox = figma.createFrame();
      tagBox.cornerRadius = 6;
      tagBox.paddingLeft = 6;
      tagBox.paddingRight = 6;
      tagBox.paddingTop = 2;
      tagBox.paddingBottom = 2;
      tagBox.fills = paint(COLORS.green50);
      tagBox.appendChild(createText(f.tag, 9, "Regular", COLORS.green700));
      right.appendChild(tagBox);
      right.appendChild(createText("›", 14, "Bold", COLORS.muted));
      row.appendChild(right);

      resBox.appendChild(row);
      foodResults.push(row);
    }
    body.appendChild(resBox);
    frame.appendChild(body);

    screens.search = frame;
    interactiveNodes.searchBack = backBtn;
    interactiveNodes.searchItems = foodResults;
  })();

  // SCREEN 6: FOOD DETAIL
  (() => {
    const frame = createScreen("06_FoodDetail", 2300, 0);
    frame.appendChild(createStatusBar());
    const { header, backBtn, actionBtn } = createHeader("Chi tiết món", true, "trash");
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Food Detail Body";
    body.resize(354, 730);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Hero Illustration
    const heroBox = figma.createFrame();
    heroBox.resize(354, 130);
    heroBox.cornerRadius = 20;
    heroBox.fills = paint(COLORS.green100);
    heroBox.layoutMode = "HORIZONTAL";
    heroBox.primaryAxisAlignItems = "CENTER";
    heroBox.counterAxisAlignItems = "CENTER";
    const whiteCircle = figma.createEllipse();
    whiteCircle.resize(70, 70);
    whiteCircle.fills = paint(COLORS.white);
    heroBox.appendChild(whiteCircle);
    const heroIcon = createText("🍚", 36, "Regular", COLORS.green800);
    heroIcon.x = 159;
    heroIcon.y = 47;
    heroBox.appendChild(heroIcon);
    body.appendChild(heroBox);

    // Title Row
    const titleRow = figma.createFrame();
    titleRow.resize(354, 40);
    titleRow.layoutMode = "HORIZONTAL";
    titleRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    titleRow.counterAxisAlignItems = "CENTER";
    titleRow.fills = [];
    const tWrap = figma.createFrame();
    tWrap.layoutMode = "VERTICAL";
    tWrap.fills = [];
    tWrap.appendChild(createText("Cơm trắng", 20, "Bold", COLORS.ink));
    tWrap.appendChild(createText("Khẩu phần chuẩn: 100 g", 11, "Regular", COLORS.muted));
    titleRow.appendChild(tWrap);
    titleRow.appendChild(createText("195 kcal", 20, "Bold", COLORS.green800));
    body.appendChild(titleRow);

    // Macro Grid 3 Cols
    const macroGrid = figma.createFrame();
    macroGrid.resize(354, 52);
    macroGrid.cornerRadius = 14;
    macroGrid.fills = paint(COLORS.white);
    macroGrid.strokes = paint(COLORS.line);
    macroGrid.strokeWeight = 1;
    macroGrid.layoutMode = "HORIZONTAL";
    macroGrid.primaryAxisAlignItems = "SPACE_AROUND";
    macroGrid.counterAxisAlignItems = "CENTER";

    function makeMacroBox(name, val) {
      const b = figma.createFrame();
      b.layoutMode = "VERTICAL";
      b.counterAxisAlignItems = "CENTER";
      b.itemSpacing = 2;
      b.fills = [];
      b.appendChild(createText(name, 10, "Regular", COLORS.muted));
      b.appendChild(createText(val, 12, "Bold", COLORS.ink));
      return b;
    }
    macroGrid.appendChild(makeMacroBox("Đạm", "4.1 g"));
    macroGrid.appendChild(makeMacroBox("Tinh bột", "42.0 g"));
    macroGrid.appendChild(makeMacroBox("Chất béo", "0.5 g"));
    body.appendChild(macroGrid);

    // Stepper Portion
    body.appendChild(createText("Khẩu phần", 12, "Bold", COLORS.ink));
    const stepper = figma.createFrame();
    stepper.resize(354, 54);
    stepper.cornerRadius = 14;
    stepper.fills = paint(COLORS.white);
    stepper.strokes = paint(COLORS.line);
    stepper.strokeWeight = 1;
    stepper.layoutMode = "HORIZONTAL";
    stepper.primaryAxisAlignItems = "SPACE_BETWEEN";
    stepper.counterAxisAlignItems = "CENTER";
    stepper.paddingLeft = 6;
    stepper.paddingRight = 6;

    const minusBtn = figma.createFrame();
    minusBtn.resize(40, 40);
    minusBtn.cornerRadius = 10;
    minusBtn.fills = paint(COLORS.green50);
    minusBtn.layoutMode = "HORIZONTAL";
    minusBtn.primaryAxisAlignItems = "CENTER";
    minusBtn.counterAxisAlignItems = "CENTER";
    minusBtn.appendChild(createText("−", 18, "Bold", COLORS.green800));
    stepper.appendChild(minusBtn);

    const stepVal = figma.createFrame();
    stepVal.layoutMode = "HORIZONTAL";
    stepVal.itemSpacing = 4;
    stepVal.counterAxisAlignItems = "CENTER";
    stepVal.fills = [];
    stepVal.appendChild(createText("150", 18, "Bold", COLORS.ink));
    stepVal.appendChild(createText("gram", 12, "Regular", COLORS.muted));
    stepper.appendChild(stepVal);

    const plusBtn = figma.createFrame();
    plusBtn.resize(40, 40);
    plusBtn.cornerRadius = 10;
    plusBtn.fills = paint(COLORS.green50);
    plusBtn.layoutMode = "HORIZONTAL";
    plusBtn.primaryAxisAlignItems = "CENTER";
    plusBtn.counterAxisAlignItems = "CENTER";
    plusBtn.appendChild(createText("+", 18, "Bold", COLORS.green800));
    stepper.appendChild(plusBtn);
    body.appendChild(stepper);

    // Buttons
    const addLunchBtn = createButton("Thêm vào bữa trưa · 195 kcal", "primary");
    const cancelDetailBtn = createButton("Hủy", "ghost");
    body.appendChild(addLunchBtn);
    body.appendChild(cancelDetailBtn);

    frame.appendChild(body);

    screens.foodDetail = frame;
    interactiveNodes.foodDetailBack = backBtn;
    interactiveNodes.foodDetailTrash = actionBtn;
    interactiveNodes.foodDetailAdd = addLunchBtn;
    interactiveNodes.foodDetailCancel = cancelDetailBtn;
  })();

  // SCREEN 7: DELETE MODAL OVERLAY
  (() => {
    const frame = createScreen("07_DeleteModal", 0, 960);
    frame.appendChild(createStatusBar());

    // Semi-transparent overlay backdrop
    const backdrop = figma.createFrame();
    backdrop.resize(390, 844);
    backdrop.fills = paint({ r: 0.039, g: 0.094, b: 0.075 }, 0.65);
    backdrop.layoutMode = "VERTICAL";
    backdrop.primaryAxisAlignItems = "MAX";
    backdrop.paddingLeft = 16;
    backdrop.paddingRight = 16;
    backdrop.paddingBottom = 24;

    const modal = figma.createFrame();
    modal.name = "Modal Card";
    modal.resize(358, 260);
    modal.cornerRadius = 24;
    modal.fills = paint(COLORS.white);
    modal.layoutMode = "VERTICAL";
    modal.counterAxisAlignItems = "CENTER";
    modal.paddingLeft = 20;
    modal.paddingRight = 20;
    modal.paddingTop = 20;
    modal.itemSpacing = 12;

    const dCircle = figma.createEllipse();
    dCircle.resize(48, 48);
    dCircle.fills = paint({ r: 0.969, g: 0.886, b: 0.878 });
    modal.appendChild(dCircle);
    const dIcon = createText("🗑", 20, "Regular", COLORS.danger);
    dIcon.y = 34;
    modal.appendChild(dIcon);

    modal.appendChild(createText("Xóa món đã ghi?", 18, "Bold", COLORS.ink));
    modal.appendChild(createText("Cơm trắng sẽ bị xóa khỏi nhật ký và tổng năng lượng hôm nay.", 12, "Regular", COLORS.muted, 318));

    const confirmDeleteBtn = createButton("Xóa món", "danger", null, 318);
    const keepBtn = createButton("Giữ lại", "secondary", null, 318);
    modal.appendChild(confirmDeleteBtn);
    modal.appendChild(keepBtn);

    backdrop.appendChild(modal);
    frame.appendChild(backdrop);

    screens.deleteModal = frame;
    interactiveNodes.modalDelete = confirmDeleteBtn;
    interactiveNodes.modalKeep = keepBtn;
  })();

  // SCREEN 8: PLANNER
  (() => {
    const frame = createScreen("08_Planner", 460, 960);
    frame.appendChild(createStatusBar());
    const { header } = createHeader("Thực đơn", false);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Planner Body";
    body.resize(354, 670);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Week Strip
    const weekStrip = figma.createFrame();
    weekStrip.resize(354, 56);
    weekStrip.layoutMode = "HORIZONTAL";
    weekStrip.primaryAxisAlignItems = "SPACE_BETWEEN";
    weekStrip.fills = [];

    const days = [
      { d: "T2", num: "16", active: false },
      { d: "T3", num: "17", active: false },
      { d: "T4", num: "18", active: false },
      { d: "T5", num: "19", active: false },
      { d: "T6", num: "20", active: true },
      { d: "T7", num: "21", active: false },
      { d: "CN", num: "22", active: false },
    ];

    for (const d of days) {
      const box = figma.createFrame();
      box.resize(44, 54);
      box.cornerRadius = 12;
      box.fills = paint(d.active ? COLORS.green900 : COLORS.white);
      if (!d.active) {
        box.strokes = paint(COLORS.line);
        box.strokeWeight = 1;
      }
      box.layoutMode = "VERTICAL";
      box.primaryAxisAlignItems = "CENTER";
      box.counterAxisAlignItems = "CENTER";
      box.itemSpacing = 3;
      box.appendChild(createText(d.d, 9, "Regular", d.active ? COLORS.green100 : COLORS.muted));
      box.appendChild(createText(d.num, 13, "Bold", d.active ? COLORS.white : COLORS.ink));
      weekStrip.appendChild(box);
    }
    body.appendChild(weekStrip);

    // Plan Title
    const pTitle = figma.createFrame();
    pTitle.resize(354, 38);
    pTitle.layoutMode = "HORIZONTAL";
    pTitle.primaryAxisAlignItems = "SPACE_BETWEEN";
    pTitle.counterAxisAlignItems = "CENTER";
    pTitle.fills = [];
    const ptWrap = figma.createFrame();
    ptWrap.layoutMode = "VERTICAL";
    ptWrap.fills = [];
    ptWrap.appendChild(createText("THỨ SÁU, 20/06", 9, "Bold", COLORS.green700));
    ptWrap.appendChild(createText("Kế hoạch ngày mai", 20, "Bold", COLORS.ink));
    pTitle.appendChild(ptWrap);
    pTitle.appendChild(createText("Dự kiến 1.820 kcal", 11, "Bold", COLORS.ink));
    body.appendChild(pTitle);

    // Meal Plan Cards
    const planCards = [
      { meal: "Bữa sáng", dish: "Yến mạch chuối", kcal: "410 kcal", canSwap: false },
      { meal: "Bữa trưa", dish: "Cơm gà rau củ", kcal: "560 kcal", canSwap: true },
      { meal: "Bữa tối", dish: "Cá hấp và rau củ", kcal: "530 kcal", canSwap: false },
    ];

    let swapBtnNode = null;
    for (const p of planCards) {
      const card = figma.createFrame();
      card.resize(354, p.canSwap ? 104 : 64);
      card.cornerRadius = 15;
      card.fills = paint(COLORS.white);
      card.strokes = paint(COLORS.line);
      card.strokeWeight = 1;
      card.layoutMode = "VERTICAL";
      card.paddingLeft = 14;
      card.paddingRight = 14;
      card.paddingTop = 10;
      card.paddingBottom = 10;
      card.itemSpacing = 6;

      const top = figma.createFrame();
      top.resize(326, 16);
      top.layoutMode = "HORIZONTAL";
      top.primaryAxisAlignItems = "SPACE_BETWEEN";
      top.fills = [];
      top.appendChild(createText(p.meal, 11, "Bold", COLORS.ink));
      top.appendChild(createText("Đã lên kế hoạch", 9, "Regular", COLORS.green700));
      card.appendChild(top);

      const mid = figma.createFrame();
      mid.resize(326, 26);
      mid.layoutMode = "HORIZONTAL";
      mid.primaryAxisAlignItems = "SPACE_BETWEEN";
      mid.counterAxisAlignItems = "CENTER";
      mid.fills = [];
      mid.appendChild(createText(p.dish, 12, "Bold", COLORS.ink));
      mid.appendChild(createText(p.kcal, 10, "Regular", COLORS.muted));
      card.appendChild(mid);

      if (p.canSwap) {
        const swapBtn = figma.createFrame();
        swapBtn.name = "Planner Swap Button";
        swapBtn.resize(326, 30);
        swapBtn.cornerRadius = 8;
        swapBtn.fills = paint(COLORS.green50);
        swapBtn.layoutMode = "HORIZONTAL";
        swapBtn.primaryAxisAlignItems = "CENTER";
        swapBtn.counterAxisAlignItems = "CENTER";
        swapBtn.itemSpacing = 6;
        swapBtn.appendChild(createText("🔄", 12, "Regular", COLORS.green800));
        swapBtn.appendChild(createText("Đổi món bữa trưa", 11, "Bold", COLORS.green800));
        card.appendChild(swapBtn);
        swapBtnNode = swapBtn;
      }
      body.appendChild(card);
    }

    frame.appendChild(body);

    const { nav, buttons: navBtns } = createBottomNav("planner");
    nav.y = 844 - 77;
    frame.appendChild(nav);

    screens.planner = frame;
    interactiveNodes.plannerSwapBtn = swapBtnNode;
    interactiveNodes.plannerNav = navBtns;
  })();

  // SCREEN 9: SWAP
  (() => {
    const frame = createScreen("09_Swap", 920, 960);
    frame.appendChild(createStatusBar());
    const { header, backBtn } = createHeader("Đổi món bữa trưa", true);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Swap Body";
    body.resize(354, 730);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Current Dish Card
    const curCard = figma.createFrame();
    curCard.resize(354, 60);
    curCard.cornerRadius = 14;
    curCard.fills = paint(COLORS.white);
    curCard.strokes = paint(COLORS.line);
    curCard.strokeWeight = 1;
    curCard.layoutMode = "VERTICAL";
    curCard.paddingLeft = 14;
    curCard.paddingTop = 8;
    curCard.itemSpacing = 2;
    curCard.appendChild(createText("MÓN HIỆN TẠI", 8, "Bold", COLORS.muted));
    curCard.appendChild(createText("Cơm gà rau củ · 560 kcal", 12, "Bold", COLORS.ink));
    body.appendChild(curCard);

    body.appendChild(createText("Chọn món thay thế", 13, "Bold", COLORS.ink));

    const options = [
      { name: "Bún thịt nướng", desc: "1 tô · 520 kcal", selected: true },
      { name: "Cơm cá kho", desc: "1 phần · 540 kcal", selected: false },
      { name: "Phở bò", desc: "1 tô · 350 kcal", selected: false },
    ];

    for (const opt of options) {
      const row = figma.createFrame();
      row.resize(354, 52);
      row.cornerRadius = 14;
      row.fills = paint(opt.selected ? COLORS.green50 : COLORS.white);
      row.strokes = paint(opt.selected ? COLORS.green700 : COLORS.line);
      row.strokeWeight = 1;
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisAlignItems = "SPACE_BETWEEN";
      row.counterAxisAlignItems = "CENTER";
      row.paddingLeft = 14;
      row.paddingRight = 14;

      const left = figma.createFrame();
      left.layoutMode = "VERTICAL";
      left.itemSpacing = 2;
      left.fills = [];
      left.appendChild(createText(opt.name, 12, "Bold", COLORS.ink));
      left.appendChild(createText(opt.desc, 10, "Regular", COLORS.muted));
      row.appendChild(left);

      if (opt.selected) {
        const check = createText("✓", 14, "Bold", COLORS.green700);
        row.appendChild(check);
      }
      body.appendChild(row);
    }

    const confirmSwapBtn = createButton("Xác nhận đổi món", "primary");
    const cancelSwapBtn = createButton("Hủy", "ghost");
    body.appendChild(confirmSwapBtn);
    body.appendChild(cancelSwapBtn);

    frame.appendChild(body);

    screens.swap = frame;
    interactiveNodes.swapBack = backBtn;
    interactiveNodes.swapConfirm = confirmSwapBtn;
    interactiveNodes.swapCancel = cancelSwapBtn;
  })();

  // SCREEN 10: PROGRESS
  (() => {
    const frame = createScreen("10_Progress", 1380, 960);
    frame.appendChild(createStatusBar());
    const { header } = createHeader("Tiến độ", false);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Progress Body";
    body.resize(354, 670);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Chart Card
    const chartCard = figma.createFrame();
    chartCard.resize(354, 210);
    chartCard.cornerRadius = 18;
    chartCard.fills = paint(COLORS.white);
    chartCard.strokes = paint(COLORS.line);
    chartCard.strokeWeight = 1;
    chartCard.paddingLeft = 16;
    chartCard.paddingRight = 16;
    chartCard.paddingTop = 14;
    chartCard.paddingBottom = 14;
    chartCard.layoutMode = "VERTICAL";
    chartCard.itemSpacing = 10;

    const cTop = figma.createFrame();
    cTop.resize(322, 28);
    cTop.layoutMode = "HORIZONTAL";
    cTop.primaryAxisAlignItems = "SPACE_BETWEEN";
    cTop.fills = [];
    const cHead = figma.createFrame();
    cHead.layoutMode = "VERTICAL";
    cHead.fills = [];
    cHead.appendChild(createText("Năng lượng đã ghi", 10, "Regular", COLORS.muted));
    cHead.appendChild(createText("Trung bình 1.625 kcal", 13, "Bold", COLORS.ink));
    cTop.appendChild(cHead);
    cTop.appendChild(createText("kcal", 10, "Regular", COLORS.muted));
    chartCard.appendChild(cTop);

    // Bars
    const barRow = figma.createFrame();
    barRow.resize(322, 110);
    barRow.layoutMode = "HORIZONTAL";
    barRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    barRow.counterAxisAlignItems = "MAX";
    barRow.fills = [];

    const barData = [
      { day: "T2", h: 70, active: false },
      { day: "T3", h: 88, active: false },
      { day: "T4", h: 10, active: false },
      { day: "T5", h: 80, active: true },
      { day: "T6", h: 76, active: false },
      { day: "T7", h: 10, active: false },
      { day: "CN", h: 10, active: false },
    ];

    for (const b of barData) {
      const col = figma.createFrame();
      col.resize(36, 100);
      col.layoutMode = "VERTICAL";
      col.primaryAxisAlignItems = "MAX";
      col.counterAxisAlignItems = "CENTER";
      col.itemSpacing = 4;
      col.fills = [];

      const bar = figma.createFrame();
      bar.resize(16, b.h);
      bar.cornerRadius = 4;
      bar.fills = paint(b.active ? COLORS.green700 : { r: 0.651, g: 0.788, b: 0.702 });
      col.appendChild(bar);
      col.appendChild(createText(b.day, 9, "Regular", COLORS.muted));
      barRow.appendChild(col);
    }
    chartCard.appendChild(barRow);
    chartCard.appendChild(createText("Bạn đã ghi nhật ký 4/7 ngày trong tuần.", 10, "Regular", COLORS.muted));
    body.appendChild(chartCard);

    // Stats List
    const statsBox = figma.createFrame();
    statsBox.resize(354, 110);
    statsBox.cornerRadius = 16;
    statsBox.fills = paint(COLORS.white);
    statsBox.strokes = paint(COLORS.line);
    statsBox.strokeWeight = 1;
    statsBox.layoutMode = "VERTICAL";

    function makeStatRow(label, val) {
      const r = figma.createFrame();
      r.resize(354, 36);
      r.layoutMode = "HORIZONTAL";
      r.primaryAxisAlignItems = "SPACE_BETWEEN";
      r.counterAxisAlignItems = "CENTER";
      r.paddingLeft = 14;
      r.paddingRight = 14;
      r.strokes = paint(COLORS.line);
      r.strokeWeight = 1;
      r.strokeAlign = "INSIDE";
      r.fills = [];
      r.appendChild(createText(label, 11, "Regular", COLORS.muted));
      r.appendChild(createText(val, 11, "Bold", COLORS.ink));
      return r;
    }
    statsBox.appendChild(makeStatRow("Năng lượng hôm nay", "643 kcal"));
    statsBox.appendChild(makeStatRow("Nước uống hôm nay", "1.250 ml"));
    statsBox.appendChild(makeStatRow("Số món đã ghi", "4 món"));
    body.appendChild(statsBox);

    frame.appendChild(body);

    const { nav, buttons: navBtns } = createBottomNav("progress");
    nav.y = 844 - 77;
    frame.appendChild(nav);

    screens.progress = frame;
    interactiveNodes.progressNav = navBtns;
  })();

  // SCREEN 11: PROFILE
  (() => {
    const frame = createScreen("11_Profile", 1840, 960);
    frame.appendChild(createStatusBar());
    const { header } = createHeader("Cá nhân", false);
    header.y = 31;
    frame.appendChild(header);

    const body = figma.createFrame();
    body.name = "Profile Body";
    body.resize(354, 670);
    body.x = 18;
    body.y = 95;
    body.layoutMode = "VERTICAL";
    body.itemSpacing = 14;
    body.fills = [];

    // Profile Card
    const profTop = figma.createFrame();
    profTop.resize(354, 64);
    profTop.layoutMode = "HORIZONTAL";
    profTop.counterAxisAlignItems = "CENTER";
    profTop.itemSpacing = 12;
    profTop.fills = [];

    const av = figma.createEllipse();
    av.resize(54, 54);
    av.fills = paint(COLORS.green100);
    profTop.appendChild(av);
    const avTxt = createText("AN", 16, "Bold", COLORS.green900);
    avTxt.x = 18;
    avTxt.y = 18;
    profTop.appendChild(avTxt);

    const nameCol = figma.createFrame();
    nameCol.layoutMode = "VERTICAL";
    nameCol.itemSpacing = 2;
    nameCol.fills = [];
    nameCol.appendChild(createText("An Nguyễn", 18, "Bold", COLORS.ink));
    nameCol.appendChild(createText("Tài khoản dùng thử", 11, "Regular", COLORS.muted));
    profTop.appendChild(nameCol);
    body.appendChild(profTop);

    // Goal Settings Card
    const goalCard = figma.createFrame();
    goalCard.resize(354, 180);
    goalCard.cornerRadius = 18;
    goalCard.fills = paint(COLORS.white);
    goalCard.strokes = paint(COLORS.line);
    goalCard.strokeWeight = 1;
    goalCard.paddingLeft = 14;
    goalCard.paddingRight = 14;
    goalCard.paddingTop = 12;
    goalCard.paddingBottom = 12;
    goalCard.layoutMode = "VERTICAL";
    goalCard.itemSpacing = 10;
    goalCard.appendChild(createText("Mục tiêu mỗi ngày", 13, "Bold", COLORS.ink));

    function makeGoalRow(label, val) {
      const f = figma.createFrame();
      f.resize(326, 40);
      f.cornerRadius = 10;
      f.fills = paint(COLORS.cream);
      f.layoutMode = "HORIZONTAL";
      f.primaryAxisAlignItems = "SPACE_BETWEEN";
      f.counterAxisAlignItems = "CENTER";
      f.paddingLeft = 12;
      f.paddingRight = 12;
      f.appendChild(createText(label, 11, "Regular", COLORS.muted));
      f.appendChild(createText(val, 12, "Bold", COLORS.ink));
      return f;
    }
    goalCard.appendChild(makeGoalRow("Năng lượng", "2.000 kcal"));
    goalCard.appendChild(makeGoalRow("Nước uống", "2.000 ml"));
    goalCard.appendChild(createButton("Lưu thay đổi", "primary", null, 326));
    body.appendChild(goalCard);

    // Settings rows
    const setList = figma.createFrame();
    setList.resize(354, 88);
    setList.cornerRadius = 14;
    setList.fills = paint(COLORS.white);
    setList.strokes = paint(COLORS.line);
    setList.strokeWeight = 1;
    setList.layoutMode = "VERTICAL";

    function makeSetRow(txt) {
      const r = figma.createFrame();
      r.resize(354, 44);
      r.layoutMode = "HORIZONTAL";
      r.primaryAxisAlignItems = "SPACE_BETWEEN";
      r.counterAxisAlignItems = "CENTER";
      r.paddingLeft = 14;
      r.paddingRight = 14;
      r.strokes = paint(COLORS.line);
      r.strokeWeight = 1;
      r.strokeAlign = "INSIDE";
      r.fills = [];
      r.appendChild(createText(txt, 11, "Bold", COLORS.ink));
      r.appendChild(createText("›", 14, "Bold", COLORS.muted));
      return r;
    }
    setList.appendChild(makeSetRow("Thông tin ứng dụng"));
    setList.appendChild(makeSetRow("Đặt lại dữ liệu mẫu"));
    body.appendChild(setList);

    frame.appendChild(body);

    const { nav, buttons: navBtns } = createBottomNav("profile");
    nav.y = 844 - 77;
    frame.appendChild(nav);

    screens.profile = frame;
    interactiveNodes.profileNav = navBtns;
  })();

  // -------------------------------------------------------------
  // 3. WIRE PROTOTYPE CONNECTIONS (REACTIONS)
  // -------------------------------------------------------------
  console.log("Setting up prototype connections...");

  // Welcome -> Setup
  await connectNodes(interactiveNodes.welcomeStart, screens.setup);
  // Welcome -> Today (Explore)
  await connectNodes(interactiveNodes.welcomeExplore, screens.today);

  // Setup Back -> Welcome
  await connectNodes(interactiveNodes.setupBack, screens.welcome);
  // Setup Save -> Today
  await connectNodes(interactiveNodes.setupSave, screens.today);
  // Setup Skip -> Today
  await connectNodes(interactiveNodes.setupSkip, screens.today);

  // Today Header Avatar -> Profile
  await connectNodes(interactiveNodes.todayAvatar, screens.profile);
  // Today Energy Detail -> Diary
  await connectNodes(interactiveNodes.todayEnergyDetail, screens.diary);
  // Today Add Meal -> Search
  await connectNodes(interactiveNodes.todayAddMeal, screens.search);
  // Today Meal Rows -> Diary
  if (interactiveNodes.todayMealRows) {
    for (const row of interactiveNodes.todayMealRows) {
      await connectNodes(row, screens.diary);
    }
  }
  // Today Plan Link -> Planner
  await connectNodes(interactiveNodes.todayPlanLink, screens.planner);

  // Diary Back / Plus -> Search
  await connectNodes(interactiveNodes.diaryHeaderPlus, screens.search);
  await connectNodes(interactiveNodes.diaryAddBtn, screens.search);
  // Diary Food Lines -> FoodDetail
  if (interactiveNodes.diaryFoodLines) {
    for (const fl of interactiveNodes.diaryFoodLines) {
      await connectNodes(fl, screens.foodDetail);
    }
  }

  // Search Back -> Diary
  await connectNodes(interactiveNodes.searchBack, screens.diary);
  // Search Items -> FoodDetail
  if (interactiveNodes.searchItems) {
    for (const item of interactiveNodes.searchItems) {
      await connectNodes(item, screens.foodDetail);
    }
  }

  // FoodDetail Back -> Diary
  await connectNodes(interactiveNodes.foodDetailBack, screens.diary);
  // FoodDetail Trash -> Delete Modal
  await connectNodes(interactiveNodes.foodDetailTrash, screens.deleteModal);
  // FoodDetail Add / Cancel -> Diary
  await connectNodes(interactiveNodes.foodDetailAdd, screens.diary);
  await connectNodes(interactiveNodes.foodDetailCancel, screens.diary);

  // Modal Keep -> FoodDetail
  await connectNodes(interactiveNodes.modalKeep, screens.foodDetail);
  // Modal Delete -> Diary
  await connectNodes(interactiveNodes.modalDelete, screens.diary);

  // Planner Swap Button -> Swap
  await connectNodes(interactiveNodes.plannerSwapBtn, screens.swap);

  // Swap Back -> Planner
  await connectNodes(interactiveNodes.swapBack, screens.planner);
  await connectNodes(interactiveNodes.swapConfirm, screens.planner);
  await connectNodes(interactiveNodes.swapCancel, screens.planner);

  // Bottom Navigation Wire across All 5 Main Screens
  const navScreens = ["today", "diary", "planner", "progress", "profile"];
  for (const fromScreenKey of navScreens) {
    const navGroup = interactiveNodes[`${fromScreenKey}Nav`];
    if (navGroup) {
      for (const targetKey of navScreens) {
        if (fromScreenKey !== targetKey && navGroup[targetKey] && screens[targetKey]) {
          await connectNodes(navGroup[targetKey], screens[targetKey]);
        }
      }
    }
  }

  // 4. Set Starting Flow Point for Figma Prototype Mode
  figma.currentPage.flowStartingPoints = [
    { nodeId: screens.welcome.id, name: "NutriDaily Mobile App Flow" },
  ];

  // 5. Zoom & Pan to Fit All Screens
  figma.viewport.scrollAndZoomIntoView(Object.values(screens));

  figma.notify("🎉 Đã tạo thành công 11 màn hình NutriDaily và kết nối đầy đủ luồng prototype tương tác!");
  figma.closePlugin();
})();

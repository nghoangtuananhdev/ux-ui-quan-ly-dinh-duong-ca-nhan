import React from "react";
import Icon from "../ui/Icon";
import { useTheme } from "../../lib/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="icon-btn text-ink-muted hover:text-ink"
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
    >
      <Icon name={isDark ? "sun" : "moon"} size={20} />
    </button>
  );
}

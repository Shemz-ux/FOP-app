import React from "react";
import { LayoutGrid, CalendarDays } from "lucide-react";

const OPTIONS = [
  { key: "grid", icon: LayoutGrid, label: "Grid view" },
  { key: "calendar", icon: CalendarDays, label: "Calendar view" },
];

const BUTTON_SIZE = 36; // px — width & height of each button
const PADDING = 4;     // px — container padding (p-1 = 4px)

export default function ViewToggle({ view, onViewChange }) {
  const activeIndex = OPTIONS.findIndex((o) => o.key === view);

  return (
    <div
      className="relative flex items-center bg-secondary/30 border rounded-xl"
      style={{ padding: PADDING }}
    >
      {/* Sliding pill — exact pixel placement, no % calc */}
      <span
        className="absolute rounded-lg bg-primary shadow-sm transition-all duration-200 ease-in-out"
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          top: PADDING,
          left: PADDING + activeIndex * BUTTON_SIZE,
        }}
      />

      {OPTIONS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onViewChange(key)}
          aria-label={label}
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          className={`relative z-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
            view === key
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}

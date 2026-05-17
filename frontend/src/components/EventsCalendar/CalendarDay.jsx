import React from "react";
import { useNavigate } from "react-router-dom";

export default function CalendarDay({ day, events = [], isCurrentMonth, isToday }) {
  const navigate = useNavigate();

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    navigate(`/events/${event.event_id}`);
  };

  return (
    <div
      className={`min-h-[110px] rounded-xl border p-2 flex flex-col gap-1 transition-colors ${
        isToday
          ? "border-primary bg-primary/5"
          : isCurrentMonth
          ? "border-border bg-card hover:border-border/60"
          : "border-border/30 bg-card/30"
      }`}
    >
      {/* Day number */}
      <span
        className={`text-xs font-medium mb-0.5 self-start ${
          isToday
            ? "text-primary font-bold"
            : isCurrentMonth
            ? "text-foreground"
            : "text-muted-foreground/40"
        }`}
      >
        {day}
      </span>

      {/* Events */}
      <div className="flex flex-col gap-1 overflow-hidden">
        {events.slice(0, 2).map((event) => (
          <button
            key={event.event_id}
            onClick={(e) => handleEventClick(e, event)}
            title={event.title}
            className="w-full text-left text-xs px-2 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors truncate font-medium"
          >
            {event.title}
          </button>
        ))}

        {events.length > 2 && (
          <span className="text-xs text-muted-foreground pl-1">
            +{events.length - 2} more
          </span>
        )}
      </div>
    </div>
  );
}

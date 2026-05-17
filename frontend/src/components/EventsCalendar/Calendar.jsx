import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDay from "./CalendarDay";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildCalendarGrid(year, month) {
  // month is 0-indexed (Date standard)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // ISO week: Monday = 0 ... Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days = [];

  // Leading days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
  }

  // Days of current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
  }

  // Trailing days to fill last row
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) });
    }
  }

  return days;
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function Calendar({ events = [] }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const grid = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Map events to their dates for quick lookup (parse as UTC to avoid day-shift)
  const eventsMap = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (!event.event_date) return;
      const raw = event.event_date.slice(0, 10); // "YYYY-MM-DD"
      const [y, m, d] = raw.split("-").map(Number);
      const key = `${y}-${m - 1}-${d}`;
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const getEventsForDate = (date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsMap[key] || [];
  };

  const hasEventDays = Object.keys(eventsMap).length > 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{monthLabel}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-1.5 text-sm font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToPrev}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-xs font-medium text-muted-foreground text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-2">
        {grid.map(({ day, currentMonth: isCurrent, date }, idx) => (
          <CalendarDay
            key={idx}
            day={day}
            isCurrentMonth={isCurrent}
            isToday={isSameDay(date, today)}
            events={getEventsForDate(date)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          Has events
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-primary inline-block" />
          Today
        </div>
      </div>
    </div>
  );
}
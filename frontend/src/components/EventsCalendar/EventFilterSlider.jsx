import React from "react";

const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function EventFilterSlider({
  activeFilter,
  onFilterChange,
  upcomingCount = 0,
  pastCount = 0,
}) {
  const getLabel = (filter) => {
    if (filter.key === "upcoming" && upcomingCount > 0)
      return `Upcoming (${upcomingCount})`;
    if (filter.key === "past" && pastCount > 0)
      return `Past (${pastCount})`;
    return filter.label;
  };

  return (
    <div className="relative flex items-center bg-secondary/30 border rounded-xl p-1 gap-0">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            activeFilter === filter.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {getLabel(filter)}
        </button>
      ))}
    </div>
  );
}

export default EventFilterSlider;

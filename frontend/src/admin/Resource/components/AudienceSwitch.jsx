import { RESOURCE_AUDIENCES, AUDIENCE_STYLES, AUDIENCE_ICONS } from '../resourceOptions';

// Segmented control for choosing between public and society resources.
// counts is optional: { public: 20, society: 3 } shows a number next to each label.
export default function AudienceSwitch({ value, onChange, counts, label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex w-full sm:w-auto p-1 bg-secondary rounded-xl"
    >
      {RESOURCE_AUDIENCES.map(audience => {
        const isSelected = audience.value === value;
        const styles = AUDIENCE_STYLES[audience.value];
        const Icon = AUDIENCE_ICONS[audience.value];

        return (
          <button
            key={audience.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(audience.value)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              isSelected
                ? styles.tab
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {audience.label}
            {counts && (
              <span className={`px-2 py-0.5 rounded-md text-xs ${
                isSelected ? styles.count : 'bg-background text-muted-foreground'
              }`}>
                {counts[audience.value] ?? 0}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import { INSTITUTION_SECTION_ICONS } from '../institutionOptions';

// Tab bar under the profile header that switches between the profile's sections.
// sections is a list of { value, label, count }. A count is hidden while it is null.
export default function SectionTabs({ sections, value, onChange, label }) {
  return (
    <div className="container mx-auto px-6 pt-12 text-left">
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1"
      >
        {sections.map(section => {
          const Icon = INSTITUTION_SECTION_ICONS[section.value];
          const isSelected = section.value === value;

          return (
            <button
              key={section.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(section.value)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-foreground/50 ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {section.label}
              {section.count !== null && section.count !== undefined && (
                <span className={`text-xs ${isSelected ? 'opacity-80' : 'opacity-70'}`}>{section.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

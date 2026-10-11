// Two-option toggle with a highlight that slides to the selected option.
// options is a list of exactly two { value, label }.
export default function ToggleSwitch({ options, value, onChange, label }) {
  const isSecondSelected = options[1].value === value;

  return (
    <div
      role="tablist"
      aria-label={label}
      className="relative grid w-full grid-cols-2 rounded-xl border border-border bg-card p-1 sm:w-56"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-primary transition-transform duration-200 ${
          isSecondSelected ? 'translate-x-full' : ''
        }`}
      />
      {options.map(option => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={`relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-foreground/50 ${
              isSelected ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

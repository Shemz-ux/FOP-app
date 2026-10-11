import { MEMBER_STAGES, ALL_MEMBER_STAGES } from '../institutionOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.members;

// Stage filter: one chip per stage that members are actually in, each with its
// colour and how many members it holds. options is a list of { value, count }.
export default function MemberStageFilter({ options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={copy.filterLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1"
    >
      {options.map(option => {
        const stage = MEMBER_STAGES.find(item => item.value === option.value);
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              isSelected
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {stage && <span className={`h-2 w-2 rounded-full ${stage.dot}`} aria-hidden="true" />}
            <span className="whitespace-nowrap">{stage ? stage.label : copy.allStages}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${
                isSelected ? 'bg-background text-foreground' : 'bg-secondary/60 text-muted-foreground'
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../../components/Ui/LoadingSpinner';
import PaginatedGrid from './PaginatedGrid';
import ToggleSwitch from './ToggleSwitch';

// A titled section whose content is one of two lists, chosen with a toggle.
// Used for both profiles' saved items and the jobseeker's applications.
//
// options is a list of exactly two:
//   { value, label, items, renderItem, itemsPerPage, empty: { message, link, to } }
// itemsPerPage is optional and falls back to the shared default.
export default function TogglePanel({ title, toggleLabel, options, loading = false }) {
  const [value, setValue] = useState(options[0].value);

  const active = options.find(option => option.value === value) || options[0];

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl text-foreground text-left">{title}</h2>
        <ToggleSwitch
          options={options.map(({ value: optionValue, label }) => ({ value: optionValue, label }))}
          value={active.value}
          onChange={setValue}
          label={toggleLabel}
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="py-16" />
      ) : active.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-muted-foreground mb-3">{active.empty.message}</p>
          <Link to={active.empty.to} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            {active.empty.link}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        // The key resets the grid to page 1 when switching between the two lists
        <PaginatedGrid
          key={active.value}
          items={active.items}
          renderItem={active.renderItem}
          itemsPerPage={active.itemsPerPage}
        />
      )}
    </section>
  );
}

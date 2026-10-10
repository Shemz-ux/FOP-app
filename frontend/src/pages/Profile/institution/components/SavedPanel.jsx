import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../../../components/Ui/LoadingSpinner';
import PaginatedGrid from '../../components/PaginatedGrid';
import ProfileJobCard from '../../components/ProfileJobCard';
import ProfileEventCard from '../../components/ProfileEventCard';
import SavedToggle from './SavedToggle';
import { SAVED_TYPES } from '../institutionOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.saved;

const TOGGLE_OPTIONS = [
  { value: SAVED_TYPES.jobs, label: copy.jobs },
  { value: SAVED_TYPES.events, label: copy.events },
];

const BROWSE_PATHS = {
  [SAVED_TYPES.jobs]: '/jobs',
  [SAVED_TYPES.events]: '/events',
};

// The society's saved jobs or events as a paginated card grid.
// saved is the value returned by useSavedItems.
export default function SavedPanel({ saved }) {
  const [type, setType] = useState(SAVED_TYPES.jobs);

  const isJobs = type === SAVED_TYPES.jobs;
  const items = isJobs ? saved.savedJobs : saved.savedEvents;

  const renderJob = (job) => (
    <ProfileJobCard
      key={job.job_id}
      job={job}
      isFavorite={saved.savedJobIds.has(job.job_id)}
      onFavoriteClick={saved.toggleSavedJob}
      compact
    />
  );

  const renderEvent = (event) => (
    <ProfileEventCard
      key={event.event_id}
      event={event}
      isFavorite={saved.savedEventIds.has(event.event_id)}
      onFavoriteClick={saved.toggleSavedEvent}
    />
  );

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl text-foreground text-left">{copy.title}</h2>
        <SavedToggle options={TOGGLE_OPTIONS} value={type} onChange={setType} label={copy.toggleLabel} />
      </div>

      {saved.loading ? (
        <LoadingSpinner size="lg" className="py-16" />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-muted-foreground mb-3">{copy.empty[type].message}</p>
          <Link to={BROWSE_PATHS[type]} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            {copy.empty[type].link}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        // The key resets the grid to page 1 when switching between jobs and events
        <PaginatedGrid key={type} items={items} renderItem={isJobs ? renderJob : renderEvent} />
      )}
    </section>
  );
}

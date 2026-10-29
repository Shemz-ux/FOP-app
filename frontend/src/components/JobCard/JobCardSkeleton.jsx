/**
 * Placeholder shown while the first page of jobs is loading.
 *
 * Deliberately mirrors JobCard's outer classes and block sizes, so the real
 * cards drop straight into the same footprint when the data arrives rather than
 * the grid resizing underneath the reader.
 */
export default function JobCardSkeleton() {
  return (
    <div
      className="bg-card rounded-2xl p-6 border border-border flex flex-col shadow-sm min-h-[300px] animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      {/* Header: logo tile, deadline pill, save button */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex-shrink-0" />
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="h-7 w-24 rounded-full bg-secondary" />
          <div className="h-7 w-7 rounded-xl bg-secondary" />
        </div>
      </div>

      {/* Title and company */}
      <div className="mb-4 space-y-2">
        <div className="h-5 w-4/5 rounded bg-secondary" />
        <div className="h-4 w-1/2 rounded bg-secondary" />
      </div>

      {/* Tags: same classes as a real card, so the pills wrap the same way */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-[30px] w-24 rounded-full bg-secondary" />
        <div className="h-[30px] w-20 rounded-full bg-secondary" />
        <div className="h-[30px] w-32 rounded-full bg-secondary" />
      </div>

      {/* Description */}
      <div className="flex-grow space-y-2 mb-4">
        <div className="h-3.5 w-full rounded bg-secondary" />
        <div className="h-3.5 w-3/4 rounded bg-secondary" />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/50 mt-auto">
        <div className="h-3 w-28 rounded bg-secondary" />
      </div>
    </div>
  );
}

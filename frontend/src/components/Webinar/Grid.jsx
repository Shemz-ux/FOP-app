import { Play, Filter } from "lucide-react";
import Card from "./Card";

export default function Grid({ webinars, activeCategory, searchQuery, copy }) {
  const showingFiltered = activeCategory !== 'All' || searchQuery;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-left">
          {showingFiltered ? `${copy.resultsTitle} (${webinars.length})` : copy.allWebinarsTitle}
        </h2>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Filter className="w-3.5 h-3.5" />
          {webinars.length} {webinars.length !== 1 ? copy.filterLabelPlural : copy.filterLabel}
        </div>
      </div>

      {/* Empty state */}
      {webinars.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">{copy.emptyState.title}</p>
          <p className="text-sm mt-1">{copy.emptyState.message}</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((webinar) => (
            <Card key={webinar.webinar_id} webinar={webinar} />
          ))}
        </div>
      )}
    </>
  );
}

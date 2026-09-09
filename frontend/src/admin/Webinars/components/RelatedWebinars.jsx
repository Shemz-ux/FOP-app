import { Link } from "react-router-dom";
import { Play, Eye, Clock } from "lucide-react";
import { formatDuration, formatViewCount } from "../../../utils/webinarHelpers";

export default function RelatedWebinars({ webinars, currentWebinarId, copy }) {
  // Filter out current webinar and unpublished ones
  const filteredWebinars = webinars.filter(
    w => w.webinar_id !== currentWebinarId && w.is_published
  );

  // Don't render anything if no related webinars
  if (filteredWebinars.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-foreground mb-4 text-left">{copy}</h3>
      <div className="space-y-4">
        {filteredWebinars.map((related) => (
          <Link
            key={related.webinar_id}
            to={`/admin/webinars/${related.webinar_id}`}
            className="group flex gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={related.thumbnail_url}
                alt={related.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1 text-left">
                {related.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDuration(related.duration)}
                <span className="ml-1 flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  {formatViewCount(related.view_count)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Play, Eye, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDuration, formatViewCount } from "../../utils/webinarHelpers";

export default function FeaturedCard({ webinar }) {
  return (
    <Link
      to={`/webinars/${webinar.webinar_id}`}
      className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 bg-card"
    >
      <div className="relative aspect-video">
        <img
          src={webinar.thumbnail_url}
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-16 h-16 rounded-full border-2 border-white/90 flex items-center justify-center backdrop-blur-sm bg-white/20">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono">
          {formatDuration(webinar.duration)}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
          {webinar.category}
        </div>
        
        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-foreground transition-colors text-left">
            {webinar.title}
          </h3>
          {/* <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{formatViewCount(webinar.view_count)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" />
              <span>{formatViewCount(webinar.like_count)}</span>
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

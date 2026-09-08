import { Play, Eye, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDuration, formatViewCount, formatDate } from "../../utils/webinarHelpers";

export default function Card({ webinar }) {
  return (
    <Link
      to={`/webinars/${webinar.webinar_id}`}
      className="group relative rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 bg-card hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={webinar.thumbnail_url}
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(webinar.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <div className="mb-2 text-left">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {webinar.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-left">
          {webinar.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 text-left">
          {webinar.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground text-left">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatViewCount(webinar.view_count)} views</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <span>•</span>
            <span>{formatDate(webinar.created_at)}</span>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

import React from "react";
import { Bookmark, Clock, Calendar, MapPin, Users } from "lucide-react";
import JobBadge from "../Ui/JobBadge";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../utils/timeFormatter";

export default function EventCard({
  title,
  organiser,
  date,
  time,
  location,
  attendees,
  description,
  tags,
  image,
  isFavorite = false,
  onFavoriteClick,
  eventId,
  createdAt,
}) {
  // Generate event ID from title if not provided
  const generatedEventId =
    eventId || title.toLowerCase().replace(/\s+/g, "-");

  const cardContent = (
    <div className="bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group hover:-translate-y-1 flex flex-col min-h-[300px] max-h-[600px] shadow-sm overflow-hidden">
      {/* Event Image or Default Background */}
      <div className="relative h-48">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] group-hover:from-[#1e293b] group-hover:to-[#475569] transition-all duration-300" />
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteClick?.();
          }}
          className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-lg transition-colors"
          aria-label={isFavorite ? "Remove from saved" : "Save event"}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? "fill-primary stroke-primary"
                : "stroke-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4 text-left">
          <h3 className="text-lg font-medium text-foreground mb-2 text-left line-clamp-2 overflow-hidden">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm text-left truncate overflow-hidden">
            <span className="font-medium">{organiser}</span>
          </p>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <JobBadge key={index} variant={tag?.variant || 'gray'}>
                {tag?.label || 'Tag'}
              </JobBadge>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-left overflow-hidden">
          {description?.split('\n').filter(line => {
            const trimmed = line.trim();
            const lower = trimmed.toLowerCase();
            return trimmed && !lower.startsWith('about the event') && !trimmed.endsWith(':');
          }).slice(0, 2).join(' ') || description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4 text-left">
          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left overflow-hidden">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate overflow-hidden text-ellipsis">{date}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left overflow-hidden">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate overflow-hidden text-ellipsis">{time}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left overflow-hidden">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate overflow-hidden text-ellipsis">{location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            {createdAt && (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Posted {formatTimeAgo(createdAt)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{attendees || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link to={`/events/${generatedEventId}`} className="block">
      {cardContent}
    </Link>
  );
}

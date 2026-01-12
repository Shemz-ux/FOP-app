import React from "react";
import { Heart, Clock, Calendar, MapPin, Users } from "lucide-react";
import JobBadge from "../Ui/JobBadge";
import { Link } from "react-router-dom";

export default function EventCard({
  title,
  organizer,
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
}) {
  // Generate event ID from title if not provided
  const generatedEventId =
    eventId || title.toLowerCase().replace(/\s+/g, "-");

  const cardContent = (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
      {/* Event Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteClick?.();
            }}
            className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-lg transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? "fill-pink-500 stroke-pink-500"
                  : "stroke-muted-foreground"
              }`}
            />
          </button>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-4 text-left">
          <h3 className="text-card-foreground mb-2 text-left">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm text-left">
            {organizer}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <JobBadge key={index} variant={tag.variant}>
              {tag.label}
            </JobBadge>
          ))}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-left">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4 text-left">
          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm text-left">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            {/* <Users className="w-4 h-4" /> */}
            {/* <span>{attendees} attending</span> */}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle registration
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Register
          </button>
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

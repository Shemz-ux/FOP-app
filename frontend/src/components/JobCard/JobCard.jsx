import React from 'react';
import { Clock, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobBadge from '../Ui/JobBadge';
import CompanyLogo from '../Ui/CompanyLogo';
import { formatTimeAgo } from '../../utils/timeFormatter';
import DeadlineRibbon from './DeadlineRibbon';
import { buildJobSummary, getDeadlineStatus } from './deadline.utils';
import { MAX_VISIBLE_TAGS } from './jobCard.config';

export default function JobCard({
  company,
  companyLogo,
  companyColor,
  jobTitle,
  location,
  description,
  tags,
  postedTime,
  deadline,
  isFavorite = false,
  onFavoriteClick,
  jobId,
  showSaveButton = true,
  compact = false,
}) {
  // Generate job ID from company and title if not provided
  const generatedJobId =
    jobId ||
    `${(company || 'company').toLowerCase().replace(/\s+/g, '-')}-${(jobTitle || 'job')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')}`;

  // Recomputed on every render, so a card moves calm -> soon -> urgent -> closed by itself
  const deadlineStatus = getDeadlineStatus(deadline);
  const isClosed = Boolean(deadlineStatus?.isClosed);

  const visibleTags = tags?.slice(0, MAX_VISIBLE_TAGS) || [];
  const hiddenTagCount = (tags?.length || 0) - visibleTags.length;

  const cardContent = (
    <div
      className={`bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group hover:-translate-y-1 flex flex-col shadow-sm ${
        compact ? 'h-full' : 'min-h-[300px]'
      } ${isClosed ? 'opacity-60 hover:opacity-100' : ''}`}
    >
      {/* Header: company logo on the left, deadline and save button on the right */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <CompanyLogo logo={companyLogo} color={companyColor} companyName={company} />

        <div className="flex items-center gap-1 flex-shrink-0">
          <DeadlineRibbon status={deadlineStatus} />

          {showSaveButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFavoriteClick) onFavoriteClick();
              }}
              className="p-1.5 hover:bg-secondary/50 rounded-xl transition-colors duration-200"
              aria-label={isFavorite ? 'Remove from saved' : 'Save job'}
              aria-pressed={isFavorite}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  isFavorite
                    ? 'fill-primary stroke-primary scale-110'
                    : 'stroke-muted-foreground hover:stroke-foreground/70'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Title and company */}
      <div className="mb-4 min-w-0">
        <h3 className="text-lg font-medium text-foreground mb-1 text-left line-clamp-2 tracking-tight">
          {jobTitle}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm text-left min-w-0">
          <span className="truncate">{company}</span>
          {location && (
            <>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {visibleTags.map((tag, index) => (
            <div key={index} className="max-w-[180px]">
              <JobBadge variant={tag?.variant || 'gray'}>
                <span className="truncate block">{tag?.label || 'Tag'}</span>
              </JobBadge>
            </div>
          ))}
          {hiddenTagCount > 0 && (
            <span className="inline-flex items-center justify-center text-xs font-medium px-3 py-2 rounded-full text-muted-foreground">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="flex-grow">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed text-left">
          {buildJobSummary(description)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>Posted {formatTimeAgo(postedTime)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Link to={`/jobs/${generatedJobId}`} className={compact ? 'block h-full' : 'block'}>
      {cardContent}
    </Link>
  );
}

import React from 'react';
import { Bookmark, Clock } from 'lucide-react';
import JobBadge from '../Ui/JobBadge';
import CompanyLogo from '../Ui/CompanyLogo';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/timeFormatter';

export default function JobCard({
  company,
  companyLogo,
  companyColor = '#0D7DFF',
  jobTitle,
  applicants,
  description,
  tags,
  salary,
  postedTime,
  isFavorite = false,
  onFavoriteClick,
  jobId,
}) {
  // Generate job ID from company and title if not provided
  const generatedJobId =
    jobId ||
    `${(company || 'company').toLowerCase().replace(/\s+/g, '-')}-${(jobTitle || 'job')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')}`;

  const cardContent = (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group hover:-translate-y-1 flex flex-col min-h-[300px] shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <CompanyLogo logo={companyLogo} color={companyColor} companyName={company} />
          <div className="pt-0.5 flex-1 min-w-0">
            <h3 className="text-lg font-medium text-foreground mb-0.5 text-left line-clamp-2">{jobTitle}</h3>
            <p className="text-muted-foreground text-sm text-left truncate">
              <span className="font-medium">{company}</span> 
            {/* • {applicants} Applicants */}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onFavoriteClick) onFavoriteClick();
          }}
          className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors duration-200"
          aria-label={isFavorite ? 'Remove from saved' : 'Save job'}
        >
          <Bookmark
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite
                ? 'fill-primary stroke-primary scale-110'
                : 'stroke-muted-foreground hover:stroke-foreground/70'
            }`}
          />
        </button>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-hidden">
          {tags.slice(0, 3).map((tag, index) => (
            <JobBadge key={index} variant={tag?.variant || 'gray'}>
              {tag?.label || 'Tag'}
            </JobBadge>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center justify-center text-xs font-medium px-3 py-2 rounded-full text-muted-foreground">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="flex-grow">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed text-left">
          {description?.split('\n').filter(line => {
            const trimmed = line.trim();
            const lower = trimmed.toLowerCase();
            return trimmed && !lower.startsWith('about the role') && !trimmed.endsWith(':');
          }).slice(0, 2).join(' ') || description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
        <div>
          {/* <span className="text-foreground font-medium">{salary}</span> */}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>Posted {formatTimeAgo(postedTime)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Link to={`/jobs/${generatedJobId}`} className="block">
      {cardContent}
    </Link>
  );
}

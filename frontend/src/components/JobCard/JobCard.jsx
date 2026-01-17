import React from 'react';
import { Heart, Clock } from 'lucide-react';
import JobBadge from '../Ui/JobBadge';
import CompanyLogo from '../Ui/CompanyLogo';
import { Link } from 'react-router-dom';

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
    `${company.toLowerCase().replace(/\s+/g, '-')}-${jobTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')}`;

  const cardContent = (
    <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md group hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <CompanyLogo logo={companyLogo} color={companyColor} />
          <div className="pt-0.5">
            <h3 className="text-lg font-medium text-foreground mb-0.5 text-left">{jobTitle}</h3>
            <p className="text-muted-foreground text-sm text-left">
              <span className="font-medium text-foreground/90">{company}</span> 
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
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite
                ? 'fill-pink-500 stroke-pink-500 scale-110'
                : 'stroke-muted-foreground hover:stroke-foreground/70'
            }`}
          />
        </button>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-hidden">
          {tags.slice(0, 3).map((tag, index) => (
            <JobBadge key={index} variant={tag.variant}>
              {tag.label}
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
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed text-left">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div>
          {/* <span className="text-foreground font-medium">{salary}</span> */}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">Posted {postedTime}</span>
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

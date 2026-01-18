import React from "react";
import { Download, FileText, Eye, BookOpen, File, Clock } from "lucide-react";
import JobBadge from "../Ui/JobBadge";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../utils/timeFormatter";

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function ResourceCard({
  resourceId,
  title,
  description,
  category,
  categoryVariant,
  fileSize,
  fileType,
  downloads,
  iconType = 'FileText',
  onDownload,
  onPreview,
  createdAt,
}) {
  const IconComponent = iconMap[iconType] || FileText;

  const cardContent = (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group hover:-translate-y-1 flex flex-col min-h-[240px] max-h-[320px] shadow-sm">
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-card-foreground mb-1 truncate text-left overflow-hidden text-ellipsis">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-left">
            <JobBadge variant={categoryVariant}>
              {category}
            </JobBadge>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-left overflow-hidden text-ellipsis">
        {description?.split('\n').filter(line => {
          const trimmed = line.trim();
          return trimmed && !trimmed.match(/^About|^What's Included$/i);
        }).slice(0, 2).join(' ') || description}
      </p>

      {/* File Details */}
      <div className="flex items-center gap-4 mb-4 text-muted-foreground text-sm text-left">
        <span className="flex items-center gap-1">
          <IconComponent className="w-4 h-4" />
          {fileType}
        </span>
        <span>{fileSize}</span>
        {downloads !== undefined && downloads > 0 && (
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {downloads}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs text-left">
          {createdAt && (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{formatTimeAgo(createdAt)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload?.();
            }}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 text-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Link to={`/resources/${resourceId}`} className="block h-full">
      {cardContent}
    </Link>
  );
}

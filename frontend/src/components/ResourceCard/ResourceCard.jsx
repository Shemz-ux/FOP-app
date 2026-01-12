import React from "react";
import { Download, FileText, Eye, BookOpen, File } from "lucide-react";
import JobBadge from "../Ui/JobBadge";

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function ResourceCard({
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
}) {
  const IconComponent = iconMap[iconType] || FileText;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-card-foreground mb-1 truncate text-left">
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
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-left">
        {description}
      </p>

      {/* File Details */}
      <div className="flex items-center gap-4 mb-4 text-muted-foreground text-sm">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          {fileType}
        </span>
        <span>{fileSize}</span>
        {/* <span className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          {downloads} downloads
        </span> */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={onDownload}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={onPreview}
          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
          aria-label="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

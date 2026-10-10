import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, Briefcase, DollarSign, Download, Eye, FileText, Home, Linkedin, Map,
  MessageSquare, Rocket, TrendingUp, User, Users, Video,
} from 'lucide-react';
import JobBadge from '../../../../components/Ui/JobBadge';
import { formatFileType } from '../../../../utils/fileTypeFormatter';
import { getResourceCategory, isVideoResource } from '../../../../admin/Resource/resourceOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.resources.card;

// Icons named by the categories in resourceOptions.js
const CATEGORY_ICONS = {
  Award, BookOpen, Briefcase, DollarSign, FileText, Home, Linkedin, Map,
  MessageSquare, Rocket, TrendingUp, User, Users,
};

// A resource with a download (or watch) button and a link to its detail page.
// onDownload receives the resource and may return a promise; the button is disabled until it settles.
export default function SocietyResourceCard({ resource, onDownload }) {
  const [downloading, setDownloading] = useState(false);

  const category = getResourceCategory(resource.category);
  const isVideo = isVideoResource(resource);
  const Icon = isVideo ? Video : (CATEGORY_ICONS[category?.icon] || FileText);
  const ActionIcon = isVideo ? Eye : Download;

  const handleAction = async () => {
    if (isVideo) {
      window.open(resource.storage_url, '_blank', 'noopener');
      return;
    }

    setDownloading(true);
    try {
      await onDownload(resource);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors duration-300 flex flex-col h-full shadow-sm text-left">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-card-foreground mb-1 truncate" title={resource.title}>
            {resource.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <JobBadge variant={category?.variant || 'gray'}>
              {category?.label || resource.category}
            </JobBadge>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{resource.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-muted-foreground text-sm">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          {isVideo ? copy.video : formatFileType(resource.file_type)}
        </span>
        {!isVideo && resource.file_size && <span>{resource.file_size}</span>}
        <span className="flex items-center gap-1">
          <ActionIcon className="w-4 h-4" />
          {copy.downloads(resource.download_count || 0, isVideo)}
        </span>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
        <button
          type="button"
          onClick={handleAction}
          disabled={downloading}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-60"
        >
          <ActionIcon className="w-4 h-4" />
          {isVideo ? copy.watch : downloading ? copy.downloading : copy.download}
        </button>
        <Link
          to={`/resources/${resource.resource_id}`}
          aria-label={copy.viewDetails(resource.title)}
          title={copy.viewDetailsShort}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

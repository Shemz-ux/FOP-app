import { Video, Globe, FileEdit, Eye } from "lucide-react";
import { formatTotalViews } from "../../../utils/webinarHelpers";

export default function WebinarStats({ webinars, copy }) {
  const stats = [
    { 
      label: copy.total, 
      value: webinars.length, 
      color: 'text-foreground',
      icon: Video,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    { 
      label: copy.published, 
      value: webinars.filter(w => w.is_published).length, 
      color: 'text-green-500',
      icon: Globe,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    { 
      label: copy.drafts, 
      value: webinars.filter(w => !w.is_published).length, 
      color: 'text-yellow-400',
      icon: FileEdit,
      iconBg: 'bg-yellow-400/10',
      iconColor: 'text-yellow-400'
    },
    { 
      label: copy.totalViews, 
      value: formatTotalViews(webinars),
      color: 'text-violet-400',
      icon: Eye,
      iconBg: 'bg-violet-400/10',
      iconColor: 'text-violet-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, color, icon: Icon, iconBg, iconColor }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 text-left">{label}</p>
              <p className={`text-2xl sm:text-3xl mb-1 ${color} text-left`}>{value}</p>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl ${iconBg}`}>
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

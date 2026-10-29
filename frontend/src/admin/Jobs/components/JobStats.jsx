import { Briefcase, CheckCircle, Star } from 'lucide-react';
import { isFeaturedLive, isFeaturedExpired } from '../../../utils/jobHelpers';

export default function JobStats({ jobs, onClearExpired, clearingExpired, copy }) {
  const featuredLive = jobs.filter(isFeaturedLive).length;
  const featuredExpired = jobs.filter(isFeaturedExpired).length;

  const stats = [
    {
      label: copy.total,
      value: jobs.length,
      color: 'text-foreground',
      icon: Briefcase,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      label: copy.active,
      value: jobs.filter((job) => job.is_active).length,
      color: 'text-green-500',
      icon: CheckCircle,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    {
      label: copy.featured,
      // The headline number is what members can actually see. A single is_featured count
      // would read higher, because the API leaves the flag set on expired jobs.
      value: featuredLive,
      suffix: copy.featuredLive,
      secondary: featuredExpired > 0
        ? `${featuredExpired} ${copy.featuredExpired}`
        : null,
      color: 'text-amber-600 dark:text-amber-400',
      icon: Star,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 text-left">{stat.label}</p>
                <p className={`text-2xl sm:text-3xl mb-1 ${stat.color} text-left`}>
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm text-muted-foreground ml-1.5">{stat.suffix}</span>
                  )}
                </p>
                {stat.secondary && (
                  <p className="text-xs text-muted-foreground text-left">{stat.secondary}</p>
                )}
              </div>
              <div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Only surfaces when there is a backlog to clear. Clearing is the admin's call:
          nothing unfeatures a job automatically, so intent survives a deadline extension. */}
      {featuredExpired > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-100/60 dark:bg-amber-400/10 border border-amber-500/20 rounded-xl">
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 text-left">
            {featuredExpired} {featuredExpired === 1 ? 'featured job is' : 'featured jobs are'} {copy.expiredHint}.
          </p>
          <button
            type="button"
            onClick={onClearExpired}
            disabled={clearingExpired}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-amber-500/30 bg-card text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            {copy.clearExpired} ({featuredExpired})
          </button>
        </div>
      )}
    </div>
  );
}

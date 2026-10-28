import { Briefcase, CheckCircle } from 'lucide-react';

export default function JobStats({ jobs, copy }) {
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
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 text-left">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl mb-1 ${stat.color} text-left`}>{stat.value}</p>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

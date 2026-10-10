import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { profileSharedCopy as copy } from '../profile.copy';

const STAT_GRID_COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

// Banner at the top of a profile: name, subtitle, settings link and a row of stats.
// stats is a list of { label, value, loading }. A stat shows a dash while it is loading.
export default function ProfileHeader({ name, subtitle, stats = [] }) {
  return (
    <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 text-left">
            <h1 className="text-3xl mb-2 text-foreground">
              {name || copy.header.nameFallback}
            </h1>
            {/* The space keeps the layout steady while the subtitle loads */}
            <p className="text-muted-foreground mb-4">{subtitle || '\u00A0'}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/settings"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {copy.header.settings}
              </Link>
            </div>
          </div>

          <div className={`grid ${STAT_GRID_COLUMNS[stats.length] || STAT_GRID_COLUMNS[3]} gap-8 text-center`}>
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="text-2xl mb-1 text-foreground">
                  {stat.loading ? copy.header.statLoading : stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

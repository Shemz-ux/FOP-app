import { Link } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../components/Ui/Avatar';
import { getGreetingKey, getTerm } from '../utils/profileOptions';
import { profileSharedCopy as copy } from '../profile.copy';

// One stat in the snapshot grid
const SnapshotCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      {Icon && (
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="text-3xl text-foreground tabular-nums">
        {stat.loading ? copy.header.statLoading : stat.value}
      </div>
      <div className="text-foreground text-sm mt-1">{stat.label}</div>
      {stat.note && <div className="text-muted-foreground text-xs mt-1">{stat.note}</div>}
    </div>
  );
};

/**
 * The banner at the top of a profile.
 *
 * Both profiles use this, each supplying its own wording and stats, so a
 * society and a jobseeker get the same layout with content that suits them.
 *
 * - identity: { initials, name, subtitle }
 * - heading / description: the welcome message
 * - highlight: optional { text, to } pill, for something worth acting on now
 * - action: optional { label, to, icon } button shown before Account settings
 * - stats: up to four { icon, value, label, note, loading } for the snapshot
 */
export default function ProfileHeader({ identity = {}, heading, description, highlight, action, stats = [] }) {
  const greeting = copy.header.greeting[getGreetingKey()];
  const term = getTerm();
  const ActionIcon = action?.icon;

  return (
    <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Who they are, and what they can do next */}
          <div className="text-left">
            <div className="mb-6 flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {identity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-foreground truncate">{identity.name || copy.header.nameFallback}</div>
                {/* The space keeps the layout steady while the subtitle loads */}
                <div className="text-muted-foreground text-sm truncate">{identity.subtitle || ' '}</div>
              </div>
            </div>

            <p className="text-primary text-sm mb-2">{greeting}</p>
            <h1 className="text-3xl sm:text-4xl text-foreground mb-4">{heading}</h1>
            <p className="text-muted-foreground mb-6 max-w-xl">{description}</p>

            {highlight && (
              <Link
                to={highlight.to}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {highlight.text}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            )}

            <div className="flex flex-wrap gap-3">
              {action && (
                <Link
                  to={action.to}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {ActionIcon && <ActionIcon className="h-4 w-4" />}
                  {action.label}
                </Link>
              )}
              <Link
                to="/settings"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-secondary"
              >
                <Settings className="h-4 w-4" />
                {copy.header.settings}
              </Link>
            </div>
          </div>

          {/* How they are doing */}
          {stats.length > 0 && (
            <div className="text-left">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <span className="text-muted-foreground text-sm">{copy.header.snapshot}</span>
                <span className="text-muted-foreground text-sm">{copy.header.term[term.key](term.year)}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map(stat => (
                  <SnapshotCard key={stat.label} stat={stat} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  CalendarClock,
} from 'lucide-react';
import JobBadge from '../Ui/JobBadge';
import CompanyLogo from '../Ui/CompanyLogo';
import { formatTimeAgo } from '../../utils/timeFormatter';
import { buildJobSummary } from './deadline.utils';
import { DEADLINE_LOCALE } from './jobCard.config';

// Matches the design's "Closes 20 Nov 2026"
const DEADLINE_FORMAT = { day: 'numeric', month: 'short', year: 'numeric' };

// Deadlines arrive as plain "YYYY-MM-DD" calendar dates (see the DATE type parser
// in api/src/db/db.js), so they are read at local midnight rather than as UTC
// instants, which would show the previous day for anyone west of UTC.
const formatDeadline = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(DEADLINE_LOCALE, DEADLINE_FORMAT);
};

const DEFAULT_ACCENT = '#0D7DFF';

/**
 * The admin-curated Featured Jobs carousel at the top of the public jobs page.
 *
 * One job per slide, shown as a full-width spotlight panel rather than a row of
 * job cards.
 *
 * Renders nothing when there is nothing featured, so the page is unchanged from
 * its pre-feature self until an admin stars something. Only ever shows jobs the
 * API returned as featured - it is never padded out with ordinary jobs.
 */
export default function FeaturedJobsSection({ jobs, copy, interval = 6000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // The API already filters to active, in-deadline, featured jobs. Re-asserting
  // the hard rule here means a change to the endpoint can never quietly turn this
  // into a general "jobs you might like" rail.
  const featured = useMemo(
    () => (Array.isArray(jobs) ? jobs.filter((job) => job.is_featured === true) : []),
    [jobs]
  );

  const count = featured.length;

  // Derived rather than corrected in an effect: unfeaturing the job currently on
  // screen shrinks the list, and a stale index would render an empty panel for a
  // frame before an effect could correct it.
  const activeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  useEffect(() => {
    if (!interval || paused || count < 2) return undefined;
    // Honour the OS "reduce motion" setting: no automatic movement at all.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setTimeout(() => setIndex((prev) => (prev + 1) % count), interval);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, count, interval]);

  if (count === 0) return null;

  const go = (next) => setIndex(((next % count) + count) % count);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(activeIndex + 1);
    }
  };

  const arrowClasses =
    'w-10 h-10 rounded-full border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="featured-jobs-heading"
      className="container mx-auto px-6 pt-12"
    >
      <div className="flex items-end justify-between gap-4 mb-5">
        <div className="text-left">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h2 id="featured-jobs-heading" className="text-foreground">
            {copy.title}
          </h2>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-muted-foreground tabular-nums mr-1" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => go(activeIndex - 1)}
              aria-label="Previous featured job"
              aria-controls="featured-jobs-track"
              className={arrowClasses}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(activeIndex + 1)}
              aria-label="Next featured job"
              aria-controls="featured-jobs-track"
              className={arrowClasses}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Hovering or tabbing in stops the auto-advance, so the panel never slides
          out from under someone who is reading or using it (WCAG 2.2.2). */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onKeyDown={handleKeyDown}
      >
        <div
          id="featured-jobs-track"
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live={paused ? 'polite' : 'off'}
        >
          {featured.map((job, slideIndex) => {
            const accent = job.company_color || DEFAULT_ACCENT;
            const isActive = slideIndex === activeIndex;
            const deadlineLabel = formatDeadline(job.deadline);
            const tags = job.tags || [];

            return (
              <div
                key={job.job_id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}: ${job.title} at ${job.company}`}
                aria-hidden={!isActive}
                // Keeps keyboard focus out of the slides scrolled off screen.
                // React 19 treats inert as a real boolean attribute, so false omits
                // it rather than emitting inert="false", which a browser would
                // wrongly honour.
                inert={!isActive}
                className="relative w-full shrink-0"
              >
                {/* Brand-coloured glow, purely decorative */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-25"
                  style={{ background: accent }}
                />

                <div className="relative grid md:grid-cols-[1fr_auto] gap-8 p-6 md:p-10 items-center">
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-4 mb-5">
                      <CompanyLogo
                        logo={job.company_logo}
                        color={accent}
                        companyName={job.company}
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                        <p className="text-xs text-muted-foreground">
                          Posted {formatTimeAgo(job.created_at)}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 tracking-tight">
                      {job.title}
                    </h3>

                    <p className="text-muted-foreground max-w-2xl mb-5 line-clamp-2">
                      {buildJobSummary(job.description)}
                    </p>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, tagIndex) => (
                          <JobBadge key={tag?.label || tagIndex} variant={tag?.variant || 'gray'}>
                            {tag?.label || 'Tag'}
                          </JobBadge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-3 md:items-stretch md:min-w-[220px] flex-wrap">
                    {job.location && (
                      <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-foreground">
                        <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        {job.location}
                      </div>
                    )}

                    {deadlineLabel && (
                      <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-foreground">
                        <CalendarClock
                          className="w-4 h-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        Closes {deadlineLabel}
                      </div>
                    )}

                    <Link
                      to={`/jobs/${job.job_id}`}
                      tabIndex={isActive ? 0 : -1}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      View role
                      <ArrowRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div
          className="flex justify-center gap-2 mt-5"
          role="group"
          aria-label="Choose featured job"
        >
          {featured.map((job, dotIndex) => (
            <button
              key={job.job_id}
              type="button"
              onClick={() => go(dotIndex)}
              aria-label={`Show featured job ${dotIndex + 1}: ${job.title} at ${job.company}`}
              aria-current={dotIndex === activeIndex ? 'true' : undefined}
              className="p-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  dotIndex === activeIndex
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

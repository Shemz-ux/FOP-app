import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, CalendarDays, Clock, FileText, Mail, Printer, ShieldCheck } from 'lucide-react';

/** Shared shell for long-form legal documents (Privacy Policy, Terms of Use). */
export default function LegalPage({ copy }) {
  const {
    eyebrow,
    title,
    intro,
    icon: Icon,
    lastUpdated,
    effectiveDate,
    contactNote,
    sections,
    related,
  } = copy;

  const [activeId, setActiveId] = useState(sections[0]?.id);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const readMinutes = Math.max(3, Math.round(sections.length * 0.9));

  return (
    <div className="min-h-screen text-left">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-primary/15 blur-3xl"
        />
        <div className="container mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16 relative">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Icon className="w-4 h-4" aria-hidden="true" /> {eyebrow}
            </p>
            <h1 className="text-4xl lg:text-5xl text-foreground mb-5 tracking-tight">{title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{intro}</p>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4" aria-hidden="true" />
                <dt>Last updated</dt>
                <dd className="text-foreground">{lastUpdated}</dd>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <dt>Effective</dt>
                <dd className="text-foreground">{effectiveDate}</dd>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <dt className="sr-only">Reading time</dt>
                <dd>{readMinutes} min read</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 xl:gap-16">
          {/* Table of contents */}
          <aside className="lg:block print:hidden">
            <nav aria-label="On this page" className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
                On this page
              </p>
              <ol className="space-y-1 border-l border-border">
                {sections.map((s, i) => {
                  const active = s.id === activeId;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        aria-current={active ? 'location' : undefined}
                        className={`-ml-px flex gap-3 border-l-2 pl-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:text-foreground focus-visible:underline ${
                          active
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                      >
                        <span className="tabular-nums text-muted-foreground/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {s.navTitle ?? s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-6 hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
              >
                <Printer className="w-4 h-4" aria-hidden="true" /> Print this page
              </button>
            </nav>
          </aside>

          {/* Document */}
          <article className="min-w-0 max-w-3xl">
            <div className="space-y-14">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-heading`}
                  className="scroll-mt-28"
                >
                  <h2
                    id={`${s.id}-heading`}
                    className="flex items-baseline gap-4 text-2xl text-foreground mb-5 tracking-tight"
                  >
                    <span className="text-sm tabular-nums text-primary font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </h2>
                  <div className="legal-prose space-y-4 text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_strong]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-80 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-primary/70 [&_h3]:text-foreground [&_h3]:font-medium [&_h3]:pt-2">
                    {s.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Contact + related */}
            <div className="mt-16 grid sm:grid-cols-2 gap-4 print:hidden">
              <Link
                to="/contact"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Mail className="w-5 h-5 text-primary mb-4" aria-hidden="true" />
                <p className="text-foreground font-medium mb-1">Questions about this document? →</p>
                <p className="text-sm text-muted-foreground">{contactNote}</p>
              </Link>
              <Link
                to={related.to}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FileText className="w-5 h-5 text-primary mb-4" aria-hidden="true" />
                <p className="text-foreground font-medium mb-1">Read our {related.label} →</p>
                <p className="text-sm text-muted-foreground">{related.description}</p>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md print:hidden"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" /> Back to top
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

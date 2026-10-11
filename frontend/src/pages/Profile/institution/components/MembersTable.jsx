import { Fragment, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../../components/Ui/Avatar';
import { formatUniYear } from '../../../../utils/uniYearFormatter';
import {
  formatMemberSince,
  getMemberInitials,
  getMemberName,
  getMemberStageOption,
} from '../institutionOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.members;

const StageBadge = ({ member }) => {
  const stage = getMemberStageOption(member);
  if (!stage) return <span className="text-muted-foreground">{copy.notGiven}</span>;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 ${stage.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} aria-hidden="true" />
      {stage.label}
    </span>
  );
};

const MemberName = ({ member }) => (
  <div className="flex items-center gap-3">
    <Avatar className="w-9 h-9 flex-shrink-0">
      <AvatarFallback className="bg-primary/10 text-primary text-xs">
        {getMemberInitials(member)}
      </AvatarFallback>
    </Avatar>
    <span className="text-foreground truncate">{getMemberName(member)}</span>
  </div>
);

const interestsOf = (member) => {
  return [member.role_interest_option_one, member.role_interest_option_two].filter(Boolean);
};

// The panel revealed when a row is expanded
const MemberDetail = ({ member }) => {
  const interests = interestsOf(member);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="text-muted-foreground text-xs mb-1.5">{copy.detail.email}</div>
        <a href={`mailto:${member.email}`} className="text-foreground hover:text-primary transition-colors break-all">
          {member.email}
        </a>
      </div>

      <div>
        <div className="text-muted-foreground text-xs mb-1.5">{copy.detail.jobsApplied}</div>
        <div className="text-foreground tabular-nums">{copy.detail.jobsAppliedvalue(member.application_count)}</div>
      </div>

      <div>
        <div className="text-muted-foreground text-xs mb-1.5">{copy.detail.eventsRegistered}</div>
        <div className="text-foreground tabular-nums">
          {copy.detail.eventsRegisteredValue(member.event_registration_count)}
        </div>
      </div>

      <div>
        <div className="text-muted-foreground text-xs mb-1.5">{copy.detail.interests}</div>
        {interests.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {interests.map(interest => (
              <span
                key={interest}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{copy.notGiven}</span>
        )}
      </div>
    </div>
  );
};

const ExpandButton = ({ expanded, member }) => (
  <span
    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-foreground"
    aria-hidden="true"
  >
    <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
    <span className="sr-only">{copy.detail.toggle(getMemberName(member))}</span>
  </span>
);

// A table on desktop, stacked cards on narrow screens. Each member can be
// expanded for their contact details, engagement and career interests.
export default function MembersTable({ members }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(current => (current === id ? null : id));

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              {[copy.columns.student, copy.columns.course, copy.columns.stage, copy.columns.year].map(heading => (
                <th key={heading} className="px-5 py-3.5 text-left font-medium text-muted-foreground">{heading}</th>
              ))}
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">{copy.columns.applications}</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">{copy.columns.since}</th>
              <th className="w-12 px-2 py-3.5">
                <span className="sr-only">{copy.columns.expand}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              const expanded = expandedId === member.jobseeker_id;

              return (
                // Fragment carries the key: it is the item in this list,
                // so keys on the rows inside would not satisfy React
                <Fragment key={member.jobseeker_id}>
                  <tr
                    onClick={() => toggle(member.jobseeker_id)}
                    aria-expanded={expanded}
                    className={`group cursor-pointer border-b border-border transition-colors hover:bg-secondary/40 ${
                      expanded ? 'bg-secondary/30' : ''
                    } ${expanded ? '' : 'last:border-0'}`}
                  >
                    <td className="px-5 py-4"><MemberName member={member} /></td>
                    <td className="px-5 py-4 text-foreground">{member.area_of_study || copy.notGiven}</td>
                    <td className="px-5 py-4"><StageBadge member={member} /></td>
                    <td className="px-5 py-4 text-foreground">
                      {member.uni_year ? formatUniYear(member.uni_year) : copy.notGiven}
                    </td>
                    <td className="px-5 py-4 text-right text-foreground tabular-nums">{member.application_count}</td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {formatMemberSince(member.created_at)}
                    </td>
                    <td className="px-2 py-4 text-center">
                      <ExpandButton expanded={expanded} member={member} />
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="border-b border-border last:border-0 bg-secondary/20">
                      <td colSpan={7} className="px-5 py-5">
                        <MemberDetail member={member} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {members.map(member => {
          const expanded = expandedId === member.jobseeker_id;

          return (
            <div key={member.jobseeker_id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(member.jobseeker_id)}
                aria-expanded={expanded}
                className="group w-full p-4 text-left"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <MemberName member={member} />
                  <ExpandButton expanded={expanded} member={member} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StageBadge member={member} />
                  {member.uni_year && (
                    <span className="text-muted-foreground text-xs">{formatUniYear(member.uni_year)}</span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs">{copy.columns.course}</dt>
                    <dd className="text-foreground">{member.area_of_study || copy.notGiven}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">{copy.columns.since}</dt>
                    <dd className="text-foreground">{formatMemberSince(member.created_at)}</dd>
                  </div>
                </dl>
              </button>
              {expanded && (
                <div className="border-t border-border bg-secondary/20 p-4">
                  <MemberDetail member={member} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

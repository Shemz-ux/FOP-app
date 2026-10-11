import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import EmptyState from '../../../../components/Ui/EmptyState';
import LoadingSpinner from '../../../../components/Ui/LoadingSpinner';
import Pagination from '../../../../components/Pagination/Pagination';
import MemberStageFilter from './MemberStageFilter';
import MembersTable from './MembersTable';
import { PROFILE_ITEMS_PER_PAGE } from '../../utils/profileOptions';
import {
  ALL_MEMBER_STAGES,
  MEMBER_STAGES,
  getMemberName,
  getMemberStage,
} from '../institutionOptions';
import { institutionProfileCopy } from '../institutionProfile.copy';

const copy = institutionProfileCopy.members;

// "All", then one option per stage that members are actually in, each with
// how many members it holds
const getStageOptions = (members) => {
  const counts = members.reduce((tally, member) => {
    const stage = getMemberStage(member);
    if (stage) tally[stage] = (tally[stage] || 0) + 1;
    return tally;
  }, {});

  return [
    { value: ALL_MEMBER_STAGES, count: members.length },
    ...MEMBER_STAGES
      .filter(stage => counts[stage.value])
      .map(stage => ({ value: stage.value, count: counts[stage.value] })),
  ];
};

// The society's own students, filtered by stage and a name/course search.
// societyMembers is the value returned by useSocietyMembers.
export default function MembersPanel({ societyMembers }) {
  const { members, loading } = societyMembers;
  const [stage, setStage] = useState(ALL_MEMBER_STAGES);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const stageOptions = getStageOptions(members);
  // Fall back when the chosen stage no longer matches anything after a refresh
  const activeStage = stageOptions.some(option => option.value === stage) ? stage : ALL_MEMBER_STAGES;

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter(member => {
      if (activeStage !== ALL_MEMBER_STAGES && getMemberStage(member) !== activeStage) return false;
      if (!query) return true;

      return `${getMemberName(member)} ${member.area_of_study || ''}`.toLowerCase().includes(query);
    });
  }, [members, activeStage, search]);

  const totalPages = Math.max(1, Math.ceil(visibleMembers.length / PROFILE_ITEMS_PER_PAGE));
  // Step back when a filter leaves fewer pages than the one being viewed
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PROFILE_ITEMS_PER_PAGE;
  const pageOfMembers = visibleMembers.slice(startIndex, startIndex + PROFILE_ITEMS_PER_PAGE);

  // Any filter change starts again from the first page
  const onFilterChange = (apply) => (value) => {
    apply(value);
    setPage(1);
  };

  return (
    <section className="text-left">
      <h2 className="text-xl text-foreground mb-2">{copy.title}</h2>
      <p className="text-muted-foreground mb-1">{copy.description}</p>
      {!loading && <p className="text-muted-foreground text-sm">{copy.count(members.length)}</p>}

      {loading ? (
        <LoadingSpinner size="lg" className="py-16" />
      ) : members.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Users} title={copy.empty.title} message={copy.empty.message} />
        </div>
      ) : (
        <>
          <div className="my-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {stageOptions.length > 1 && (
              <MemberStageFilter
                options={stageOptions}
                value={activeStage}
                onChange={onFilterChange(setStage)}
              />
            )}

            <div className="relative xl:ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => onFilterChange(setSearch)(e.target.value)}
                aria-label={copy.searchLabel}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-lg border border-input bg-input-background py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-72"
              />
            </div>
          </div>

          {visibleMembers.length === 0 ? (
            <EmptyState icon={Search} title={copy.noMatches.title} message={copy.noMatches.message} />
          ) : (
            <>
              <MembersTable members={pageOfMembers} />
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

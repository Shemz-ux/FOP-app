import { Link } from 'react-router-dom';
import { Eye, BarChart, Trash2, Edit, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import Pagination from '../../../components/Ui/Pagination';

/**
 * Presentational jobs table. Renders a desktop table and a mobile card list over the same
 * data, so any new column or row action must be added in both blocks.
 */
export default function JobsTable({
  jobs,
  currentJobs,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onDelete,
  isFiltered,
  copy
}) {
  const emptyState = (
    <>
      <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">{copy.emptyTitle}</h3>
      <p className="text-sm text-muted-foreground text-center">
        {isFiltered ? copy.emptyFiltered : copy.emptyUnfiltered}
      </p>
    </>
  );

  const statusPill = (job, iconSize) => (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
        job.is_active
          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
          : 'bg-red-500/10 text-red-500 border border-red-500/20'
      }`}
    >
      {job.is_active ? (
        <>
          <CheckCircle className={iconSize} />
          {copy.statusActive}
        </>
      ) : (
        <>
          <XCircle className={iconSize} />
          {copy.statusInactive}
        </>
      )}
    </span>
  );

  const pagination = jobs.length > 0 && (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      itemsPerPage={itemsPerPage}
      totalItems={jobs.length}
    />
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">{emptyState}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.title}</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.company}</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.location}</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.applicants}</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.status}</th>
                  <th className="text-left px-6 py-4 text-sm text-foreground">{copy.headers.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentJobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-foreground">{job.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                    <td className="px-6 py-4 text-muted-foreground">{job.location || copy.notAvailable}</td>
                    <td className="px-6 py-4 text-muted-foreground">{job.applicant_count || 0}</td>
                    <td className="px-6 py-4">{statusPill(job, 'w-3.5 h-3.5')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/jobs/${job.job_id}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={copy.tooltips.view}
                        >
                          <BarChart className="w-4 h-4 text-foreground" />
                        </Link>
                        <Link
                          to={`/admin/jobs/${job.job_id}/edit`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={copy.tooltips.edit}
                        >
                          <Edit className="w-4 h-4 text-foreground" />
                        </Link>
                        <button
                          onClick={() => onDelete(job)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title={copy.tooltips.delete}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">{emptyState}</div>
          </div>
        ) : (
          currentJobs.map((job) => (
            <div key={job.job_id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-foreground mb-1 truncate">{job.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                </div>
                {statusPill(job, 'w-3 h-3')}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{job.location || copy.notAvailable}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{job.applicant_count || 0} {copy.applicantsSuffix}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Link
                  to={`/admin/jobs/${job.job_id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                >
                  <BarChart className="w-4 h-4" />
                  {copy.mobileActions.view}
                </Link>
                <Link
                  to={`/admin/jobs/${job.job_id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  {copy.mobileActions.edit}
                </Link>
                <button
                  onClick={() => onDelete(job)}
                  className="px-3 py-2 border border-red-500/20 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}

        {pagination}
      </div>
    </>
  );
}

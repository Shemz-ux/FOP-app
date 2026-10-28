import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home } from 'lucide-react';
import { jobsDashboardCopy } from './jobsDashboard.copy';
import JobStats from './components/JobStats';
import JobSearchFilter from './components/JobSearchFilter';
import JobsTable from './components/JobsTable';
import ConfirmModal from '../../components/Ui/ConfirmModal';
import Toast from '../../components/Ui/Toast';
import { deriveJobStatus } from '../../utils/jobHelpers';
import { apiGet, apiDelete } from '../../services/api';

const ITEMS_PER_PAGE = 10;

export default function JobsDashboard() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, job: null });
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/jobs');
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setConfirmModal({ isOpen: true, job });
  };

  const handleDeleteConfirm = async () => {
    const job = confirmModal.job;
    if (!job) return;

    try {
      await apiDelete(`/jobs/${job.job_id}`);
      setJobs((prev) => prev.filter((j) => j.job_id !== job.job_id));
      setToast({
        message: `"${job.title}" has been deleted successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      setToast({
        message: jobsDashboardCopy.toast.deleteFailed,
        type: 'error'
      });
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query ||
        (job.title || '').toLowerCase().includes(query) ||
        (job.company || '').toLowerCase().includes(query) ||
        (job.location || '').toLowerCase().includes(query);

      const matchesFilter = filterStatus === 'all' || deriveJobStatus(job) === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfLastJob - ITEMS_PER_PAGE, indexOfLastJob);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{jobsDashboardCopy.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 text-left">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              {jobsDashboardCopy.breadcrumb.dashboard}
            </Link>
            <span>/</span>
            <span className="text-foreground">{jobsDashboardCopy.breadcrumb.current}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-2 text-foreground">
                {jobsDashboardCopy.header.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {jobsDashboardCopy.header.subtitle}
              </p>
            </div>
            <Link
              to="/admin/jobs/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="sm:inline">{jobsDashboardCopy.header.createButton}</span>
            </Link>
          </div>

          {/* Summary stats */}
          <JobStats jobs={jobs} copy={jobsDashboardCopy.stats} />

          {/* Search + filter */}
          <JobSearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            statusValue={filterStatus}
            onStatusChange={setFilterStatus}
            copy={jobsDashboardCopy.search}
          />

          {/* Table */}
          <JobsTable
            jobs={filteredJobs}
            currentJobs={currentJobs}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onDelete={handleDeleteClick}
            isFiltered={Boolean(searchTerm) || filterStatus !== 'all'}
            copy={jobsDashboardCopy.table}
          />
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, job: null })}
        onConfirm={handleDeleteConfirm}
        title={jobsDashboardCopy.deleteConfirm.title}
        message={confirmModal.job
          ? `Are you sure you want to delete "${confirmModal.job.title}"? This action cannot be undone.`
          : ''}
        confirmText={jobsDashboardCopy.deleteConfirm.confirmButton}
        cancelText={jobsDashboardCopy.deleteConfirm.cancelButton}
        confirmVariant="danger"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

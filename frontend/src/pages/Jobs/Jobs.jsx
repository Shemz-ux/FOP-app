import { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero";
import FilterSidebar from "../../components/FilterSideBar/FilterSideBar";
import FilterButton from "../../components/Ui/FilterButton";
import JobCard from "../../components/JobCard/JobCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import Pagination from "../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import { jobsService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import * as jobActionsService from "../../services/Jobs/jobActions";

export default function Jobs() {
  const { user, isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({ query: '', location: '' });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 9;

  const [jobTypes, setJobTypes] = useState([
    { label: "Insight Day", value: "Insight Day", checked: false },
    { label: 'Internship',  value: 'Internship', checked: false },
    { label: "Spring Week", value: "Spring Week", checked: false },
    // { value: 'Work Experience', label: 'Work Experience', variant: 'amber' },
    { label: "Graduate Scheme", value: "Graduate Scheme", checked: false },
    { label: "Placement", value: "Placement", checked: false },
    { value: 'Apprenticeship', label: 'Apprenticeship', checked: false},
    { label: "Degree Apprentice", value: "Degree Apprentice", checked: false },
    { label: "Full-time", value: "Full-time", checked: false },
    { label: "Part-time", value: "Part-time", checked: false },
    { label: "Contract", value: "Contract", checked: false },
    // { label: "Other", value: "Other", checked: false },
    // { label: "Vac Scheme", value: "Vac Scheme", checked: false },
  ]);

  const [experienceLevels, setExperienceLevels] = useState([
    { label: "School Leaver", value: "School Leaver", checked: false },
    { label: "Student", value: "Student", checked: false },
    { label: "Graduate", value: "Graduate", checked: false },
    { label: "Entry Level", value: "Entry Level", checked: false },
    { label: "Mid Level", value: "Mid Level", checked: false },
    { label: "Senior", value: "Senior", checked: false },
    // { label: "Other", value: "Other", checked: false },
  ]);

  const [workTypes, setWorkTypes] = useState([
    { label: "Remote", value: "Remote", checked: false },
    { label: "Hybrid", value: "Hybrid", checked: false },
    { label: "On site", value: "On-site", checked: false },
  ]);

  const [industries, setIndustries] = useState([
    { label: "Technology & IT", value: "Technology", checked: false },
    { label: "Finance", value: "Finance", checked: false },
    { label: "Consulting", value: "Consulting", checked: false },
    { label: "Engineering, Energy & Infrastructure", value: "Engineering", checked: false },
    { label: "Marketing", value: "Marketing", checked: false },
    { label: "Media", value: "Media", checked: false },
    { label: "Healthcare", value: "Healthcare", checked: false },
    { label: "Management & Operations", value: "Management ", checked: false },
    { label: "Pharmaceuticals", value: "Pharmaceuticals", checked: false },
    { label: "Insurance", value: "Insurance", checked: false },
    { label: "Education", value: "Education", checked: false },
    { label: "Law", value: "Law", checked: false },
    // { label: "Other", value: "Other", checked: false },
  ]);

  const toggleFavorite = async (jobId) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    try {
      const isSaved = favorites.has(jobId);
      
      if (isSaved) {
        await jobActionsService.unsaveJob(jobId, user.userId, user.userType);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await jobActionsService.saveJob(jobId, user.userId, user.userType);
        setFavorites((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Error toggling job save:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleJobTypeChange = (index, checked) => {
    setJobTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked } : item
      )
    );
  };

  const handleExperienceLevelChange = (index, checked) => {
    setExperienceLevels((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked } : item
      )
    );
  };

  const handleWorkTypeChange = (index, checked) => {
    setWorkTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked } : item
      )
    );
  };

  const handleIndustryChange = (index, checked) => {
    setIndustries((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked } : item
      )
    );
  };

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, [currentPage, sortBy, searchFilters, jobTypes, industries, experienceLevels, workTypes]);

  // Load saved jobs on mount
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (isLoggedIn() && user) {
        try {
          const { getSavedJobIds } = await import('../../services/Dashboard/dashboardService');
          const savedJobIds = await getSavedJobIds(user.userId, user.userType);
          setFavorites(new Set(savedJobIds));
        } catch (err) {
          console.error('Error loading saved jobs:', err);
        }
      }
    };
    loadSavedJobs();
  }, [isLoggedIn, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filter params
      const filters = {};
      
      if (searchFilters.query) filters.search = searchFilters.query;
      if (searchFilters.location) filters.location = searchFilters.location;
      
      const checkedRoleTypes = jobTypes.filter(t => t.checked).map(t => t.value);
      if (checkedRoleTypes.length > 0) filters.role_type = checkedRoleTypes.join(',');
      
      const checkedExpLevels = experienceLevels.filter(l => l.checked).map(l => l.value);
      if (checkedExpLevels.length > 0) filters.experience_level = checkedExpLevels.join(',');
      
      const checkedWorkTypes = workTypes.filter(w => w.checked).map(w => w.value);
      if (checkedWorkTypes.length > 0) filters.work_type = checkedWorkTypes.join(',');
      
      const checkedIndustries = industries.filter(i => i.checked).map(i => i.value);
      if (checkedIndustries.length > 0) filters.industry = checkedIndustries.join(',');

      // Map sort options
      const sortMap = {
        'recent': 'created_at',
        'relevant': 'applicant_count',
        'title': 'title',
        'company': 'company'
      };
      filters.sort_by = sortMap[sortBy] || 'created_at';
      filters.sort_order = 'desc';

      const response = await jobsService.getJobsAdvanced({
        ...filters,
        page: currentPage,
        limit: jobsPerPage,
        is_active: true
      });

      setJobs(response.jobs || []);
      setTotalJobs(response.pagination?.totalCount || 0);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setJobTypes((prev) => prev.map((item) => ({ ...item, checked: false })));
    setIndustries((prev) => prev.map((item) => ({ ...item, checked: false })));
    setExperienceLevels((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
    setWorkTypes((prev) => prev.map((item) => ({ ...item, checked: false })));
    setCurrentPage(1);
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const getActiveFilterCount = () => {
    const checkedJobTypes = jobTypes.filter(type => type.checked).length;
    const checkedExpLevels = experienceLevels.filter(level => level.checked).length;
    const checkedWorkTypes = workTypes.filter(type => type.checked).length;
    return checkedJobTypes + checkedExpLevels + checkedWorkTypes;
  };

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        // backgroundImage="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                jobTypes={jobTypes}
                industries={industries}
                experienceLevels={experienceLevels}
                workTypes={workTypes}
                onJobTypeChange={handleJobTypeChange}
                onIndustryChange={handleIndustryChange}
                onExperienceLevelChange={handleExperienceLevelChange}
                onWorkTypeChange={handleWorkTypeChange}
                onClearAll={handleClearAll}
              />
            </div>
          </aside>

          {/* Mobile Filter Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden ${
              isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-end mb-2">
                {/* <h2 className="text-lg font-semibold text-foreground">Filters</h2> */}
                <button
                  onClick={toggleMobileFilter}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterSidebar
                jobTypes={jobTypes}
                industries={industries}
                experienceLevels={experienceLevels}
                workTypes={workTypes}
                onJobTypeChange={handleJobTypeChange}
                onIndustryChange={handleIndustryChange}
                onExperienceLevelChange={handleExperienceLevelChange}
                onWorkTypeChange={handleWorkTypeChange}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileFilter}
            />
          )}

          {/* Job Listings */}
          <div>
            {/* Header */}
            <div className="mb-6">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-foreground">
                    {getActiveFilterCount() > 0 ? 'Filtered jobs' : 'Recommended jobs'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
                    {getActiveFilterCount() > 0 && (
                      <span className="ml-2 text-primary">
                        ({getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active)
                      </span>
                    )}
                  </p>
                </div>
                <SortDropdown
                  value={sortBy}
                  onValueChange={setSortBy}
                />
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="text-left mb-4">
                  <h2 className="text-foreground">
                    Recommended jobs
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FilterButton
                    onClick={toggleMobileFilter}
                    filterCount={getActiveFilterCount()}
                  />
                  <SortDropdown
                    value={sortBy}
                    onValueChange={setSortBy}
                  />
                </div>
              </div>
            </div>

            {/* Job Grid */}
            {loading ? (
              <div className="py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchJobs} />
            ) : jobs.length === 0 ? (
              <EmptyState 
                title="No jobs found"
                message="Try adjusting your filters or search terms to find more opportunities"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.job_id}
                    jobId={job.job_id}
                    jobTitle={job.title}
                    company={job.company}
                    location={job.location}
                    companyColor={job.company_color}
                    description={job.description}
                    postedTime={job.created_at}
                    tags={job.tags || []}
                    isFavorite={favorites.has(job.job_id)}
                    onFavoriteClick={() => toggleFavorite(job.job_id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && jobs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
import { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import FilterButton from "../../components/Ui/FilterButton";
import JobCard from "../../components/JobCard/JobCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import Pagination from "../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import { jobsService } from "../../services";

export default function Jobs() {
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
    { label: "Summer Intern", value: "Summer Internship", checked: false },
    { label: "Grad Scheme", value: "Graduate Scheme", checked: false },
    { label: "Year Placement", value: "Year Placement", checked: false },
    { label: "Full-time", value: "Full-time", checked: false },
    { label: "Part-time", value: "Part-time", checked: false },
    { label: "Apprenticeship", value: "Apprenticeship", checked: false },
  ]);

  const [experienceLevels, setExperienceLevels] = useState([
    { label: "No Experience", value: "No experience required", checked: false },
    { label: "Student", value: "Student", checked: false },
    { label: "Graduate", value: "Recent graduate", checked: false },
    { label: "Entry Level", value: "Entry level", checked: false },
    { label: "Mid Level", value: "Mid level", checked: false },
    { label: "Senior", value: "Senior", checked: false },
  ]);

  const [workTypes, setWorkTypes] = useState([
    { label: "Remote", value: "Remote", checked: false },
    { label: "Hybrid", value: "Hybrid", checked: false },
    { label: "On-site", value: "On-site", checked: false },
  ]);

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, [currentPage, sortBy, searchFilters, jobTypes, experienceLevels, workTypes]);

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

      // Map sort options
      const sortMap = {
        'recent': 'created_at',
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
      setTotalJobs(response.total || 0);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setJobTypes((prev) => prev.map((item) => ({ ...item, checked: false })));
    setExperienceLevels((prev) => prev.map((item) => ({ ...item, checked: false })));
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
        backgroundImage="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
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
                experienceLevels={experienceLevels}
                workTypes={workTypes}
                onJobTypeChange={handleJobTypeChange}
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
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
                experienceLevels={experienceLevels}
                workTypes={workTypes}
                onJobTypeChange={handleJobTypeChange}
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
                    Recommended jobs
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {totalJobs} jobs found
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
                    {totalJobs} jobs found
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
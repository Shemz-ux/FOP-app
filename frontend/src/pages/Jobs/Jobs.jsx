import { useState } from "react";
import Hero from "../../components/Hero/Hero";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import FilterButton from "../../components/Ui/FilterButton";
import JobCard from "../../components/JobCard/JobCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import Pagination from "../../components/Pagination/Pagination";
import { mockJobs } from "../../services/Jobs/jobs";

export default function Jobs() {
  const [favorites, setFavorites] =  useState(new Set());
  const [sortBy, setSortBy] =  useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({ query: '', location: '' });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const jobsPerPage = 9;

  const [jobTypes, setJobTypes] =  useState([
    { label: "Full time", checked: true },
    { label: "Part time", checked: true },
    { label: "Internship", checked: false },
    { label: "Project work", checked: true },
    { label: "Volunteering", checked: false },
  ]);

  const [experienceLevels, setExperienceLevels] =  useState([
    { label: "Entry level", count: 392, checked: false },
    { label: "Intermediate", count: 124, checked: true },
    { label: "Expert", count: 3021, checked: true },
  ]);

  const [workTypes, setWorkTypes] = useState([
    { label: "Remote", checked: true },
    { label: "Hybrid", checked: true },
    { label: "On-site", checked: true },
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
    return checkedJobTypes + checkedExpLevels;
  };

  // Filter jobs based on search criteria
  const filteredJobs = mockJobs.filter((job) => {
    const matchesQuery = !searchFilters.query || 
      job.jobTitle.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      job.company.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      job.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      job.tags.some(tag => tag.label.toLowerCase().includes(searchFilters.query.toLowerCase()));
    
    const matchesLocation = !searchFilters.location || 
      job.location?.toLowerCase().includes(searchFilters.location.toLowerCase());
    
    return matchesQuery && matchesLocation;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

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
                    {filteredJobs.length} jobs found
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
                    {filteredJobs.length} jobs found
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentJobs.map((job, index) => {
                const actualIndex = startIndex + index;
                return (
                  <JobCard
                    key={actualIndex}
                    {...job}
                    isFavorite={favorites.has(actualIndex)}
                    onFavoriteClick={() => toggleFavorite(actualIndex)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
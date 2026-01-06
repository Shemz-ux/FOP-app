import { useState } from "react";
// import HeroSection from "../../components/HeroSection/HeroSection";
// import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import JobCard from "../../components/JobCard/JobCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import { mockJobs } from "../../services/Jobs/jobs";

export default function Jobs() {
  const [favorites, setFavorites] =  useState(new Set());
  const [sortBy, setSortBy] =  useState("recent");
  const [salaryRange, setSalaryRange] =  useState([50, 120]);

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

  const handleClearAll = () => {
    setJobTypes((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <HeroSection backgroundImage="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080" /> */}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {/* <FilterSidebar
                jobTypes={jobTypes}
                experienceLevels={experienceLevels}
                salaryRange={salaryRange}
                onJobTypeChange={handleJobTypeChange}
                onExperienceLevelChange={handleExperienceLevelChange}
                onSalaryRangeChange={setSalaryRange}
                onClearAll={handleClearAll}
              /> */}
            </div>
          </aside>

          {/* Job Listings */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-foreground">
                    Recommended jobs
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {mockJobs.length} jobs found
                  </p>
                </div>
                <SortDropdown
                  value={sortBy}
                  onValueChange={setSortBy}
                />
              </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockJobs.map((job, index) => (
                <JobCard
                  key={index}
                  {...job}
                  isFavorite={favorites.has(index)}
                  onFavoriteClick={() => toggleFavorite(index)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
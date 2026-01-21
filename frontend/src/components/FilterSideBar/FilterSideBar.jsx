import React, { useState } from 'react';
import { Checkbox } from '../Ui/Checkbox.jsx';
import { ChevronDown } from 'lucide-react';

export default function FilterSidebar({
  jobTypes,
  industries,
  experienceLevels,
  workTypes,
  onJobTypeChange,
  onIndustryChange,
  onExperienceLevelChange,
  onWorkTypeChange,
  onClearAll,
}) {
  const [openSections, setOpenSections] = useState({
    jobType: true,
    industry: true,
    workType: true,
    experienceLevel: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = 
    jobTypes.some(t => t.checked) || 
    industries.some(i => i.checked) || 
    experienceLevels.some(l => l.checked) || 
    workTypes.some(w => w.checked);

  return (
    <div className="space-y-6 px-4">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-foreground font-semibold text-left">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Job Type Filter */}
      <div>
        <button
          onClick={() => toggleSection('jobType')}
          className="w-full flex items-center justify-between mb-3 hover:text-foreground transition-colors"
        >
          <h3 className="text-card-foreground font-medium text-left">Job Type</h3>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              openSections.jobType ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.jobType && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {jobTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <Checkbox
                  id={`job-type-${index}`}
                  checked={type.checked}
                  onCheckedChange={(checked) => {
                    if (onJobTypeChange) {
                      onJobTypeChange(index, Boolean(checked));
                    }
                  }}
                />
                <label
                  htmlFor={`job-type-${index}`}
                  className={`flex-1 cursor-pointer text-left text-sm transition-colors ${
                    type.checked 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Industry Filter */}
      <div>
        <button
          onClick={() => toggleSection('industry')}
          className="w-full flex items-center justify-between mb-3 hover:text-foreground transition-colors"
        >
          <h3 className="text-card-foreground font-medium text-left">Industry</h3>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              openSections.industry ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.industry && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {industries.map((industry, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <Checkbox
                  id={`industry-${index}`}
                  checked={industry.checked}
                  onCheckedChange={(checked) => {
                    if (onIndustryChange) {
                      onIndustryChange(index, Boolean(checked));
                    }
                  }}
                />
                <label
                  htmlFor={`industry-${index}`}
                  className={`flex-1 cursor-pointer text-left text-sm transition-colors ${
                    industry.checked 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {industry.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Type Filter */}
      <div>
        <button
          onClick={() => toggleSection('workType')}
          className="w-full flex items-center justify-between mb-3 hover:text-foreground transition-colors"
        >
          <h3 className="text-card-foreground font-medium text-left">Work Type</h3>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              openSections.workType ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.workType && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {workTypes && workTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <Checkbox
                  id={`work-type-${index}`}
                  checked={type.checked}
                  onCheckedChange={(checked) => {
                    if (onWorkTypeChange) {
                      onWorkTypeChange(index, Boolean(checked));
                    }
                  }}
                />
                <label
                  htmlFor={`work-type-${index}`}
                  className={`flex-1 cursor-pointer text-left text-sm transition-colors ${
                    type.checked 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level Filter */}
      <div>
        <button
          onClick={() => toggleSection('experienceLevel')}
          className="w-full flex items-center justify-between mb-3 hover:text-foreground transition-colors"
        >
          <h3 className="text-card-foreground font-medium text-left">Experience Level</h3>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              openSections.experienceLevel ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.experienceLevel && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {experienceLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <Checkbox
                  id={`exp-level-${index}`}
                  checked={level.checked}
                  onCheckedChange={(checked) => {
                    if (onExperienceLevelChange) {
                      onExperienceLevelChange(index, Boolean(checked));
                    }
                  }}
                />
                <label
                  htmlFor={`exp-level-${index}`}
                  className={`flex-1 cursor-pointer text-left text-sm transition-colors ${
                    level.checked 
                      ? 'text-foreground font-medium' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {level.label}
                </label>
                {level.count !== undefined && (
                  <span className="text-muted-foreground text-xs">
                    ({level.count})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

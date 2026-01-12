import React from 'react';
import { Checkbox } from '../Ui/Checkbox.jsx';
import { Slider } from '../Ui/Slider.jsx';

export default function FilterSidebar({
  jobTypes,
  experienceLevels,
  salaryRange,
  onJobTypeChange,
  onExperienceLevelChange,
  onSalaryRangeChange,
  onClearAll,
}) {
  return (
    <div className="space-y-8 px-4">
      {/* Job Type Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-card-foreground text-left">Job Type</h3>
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-3">
          {jobTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-3">
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
                className="flex-1 text-muted-foreground cursor-pointer text-left"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Filter */}
      <div>
        <h3 className="text-card-foreground text-left mb-4">Salary Range</h3>
        <div className="px-2">
          <Slider
            value={salaryRange}
            onValueChange={(value) => {
              if (onSalaryRangeChange) {
                onSalaryRangeChange(value);
              }
            }}
            min={0}
            max={200}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              ${salaryRange[0]}k
            </span>
            <span className="text-muted-foreground">
              ${salaryRange[1]}k
            </span>
          </div>
        </div>
      </div>

      {/* Experience Level Filter */}
      <div>
        <h3 className="text-card-foreground text-left mb-4">Experience Level</h3>
        <div className="space-y-3">
          {experienceLevels.map((level, index) => (
            <div key={index} className="flex items-center gap-3">
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
                className="flex-1 text-muted-foreground cursor-pointer text-left"
              >
                {level.label}
              </label>
              {level.count !== undefined && (
                <span className="text-muted-foreground text-sm">
                  {level.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

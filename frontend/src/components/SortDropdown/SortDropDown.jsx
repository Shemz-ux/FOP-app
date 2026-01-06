import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Ui/Select';

export default function SortDropdown({ value = 'recent', onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] bg-card border-border">
        <div className="flex items-center gap-2">
          <SelectValue placeholder="Sort by" />
          <ArrowUpDown className="w-4 h-4 ml-auto" />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="recent">Most recent</SelectItem>
        <SelectItem value="relevant">Most relevant</SelectItem>
        <SelectItem value="salary-high">Salary: High to Low</SelectItem>
        <SelectItem value="salary-low">Salary: Low to High</SelectItem>
      </SelectContent>
    </Select>
  );
}

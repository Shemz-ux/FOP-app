import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';

export default function FilterButton({ onClick, filterCount }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span>Filters</span>
      {filterCount > 0 && (
        <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
          {filterCount}
        </span>
      )}
    </Button>
  );
}

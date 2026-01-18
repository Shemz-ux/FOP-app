import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Search, 
  title = 'No results found', 
  message = 'Try adjusting your filters or search terms',
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
      <Icon className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;

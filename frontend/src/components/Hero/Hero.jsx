import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { Briefcase, ChartBar, ZoomInIcon} from 'lucide-react';

export default function Hero({
  title = 'Find Your Dream Job',
  subtitle,
  backgroundImage,
  onSearch,
}) {
  return (
    <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border relative overflow-hidden">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <ZoomInIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl text-foreground">
              {title}
            </h1>
          </div>

          {subtitle && (
            <p className="text-muted-foreground text-lg mb-8">
              {subtitle}
            </p>
          )}

          {/* Search Bar */}
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
            <img
              src={backgroundImage}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

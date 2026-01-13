import React from 'react';
import SearchBar from '../SearchBar/SearchBar';

export default function Hero({
  title = 'Find Your Dream Job Here',
  subtitle,
  backgroundImage,
  onSearch,
}) {
  return (
    <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border relative overflow-hidden">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          {/* Title */}
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl text-foreground">{title}</h1>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-foreground"
            >
              <path
                d="M16 4L12 12H4L10 18L8 26L16 22L24 26L22 18L28 12H20L16 4Z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
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

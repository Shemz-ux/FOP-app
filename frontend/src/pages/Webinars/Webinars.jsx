import { useState, useEffect, useMemo } from "react";
import Hero from "../../components/Webinar/Hero";
import FeaturedSection from "../../components/Webinar/FeaturedSection";
import SearchBar from "../../components/Webinar/SearchBar";
import CategoryFilter from "../../components/Webinar/CategoryFilter";
import Grid from "../../components/Webinar/Grid";
import { testWebinars, testCategories, webinarsCopy } from "./webinars.copy";

export default function Webinars() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Replace with actual API call to webinarsService.listWebinars()
  const webinars = testWebinars;
  const categories = testCategories;

  // Filter featured webinars (published and featured)
  const featuredWebinars = useMemo(() => {
    return webinars.filter((w) => w.is_published && w.is_featured);
  }, [webinars]);

  // Filter webinars based on search and category
  const filteredWebinars = useMemo(() => {
    return webinars.filter((w) => {
      // Only show published webinars
      if (!w.is_published) return false;

      // Category filter
      const matchCategory = activeCategory === 'All' || w.category === activeCategory;
      
      // Search filter
      const query = search.toLowerCase();
      const matchSearch =
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.category.toLowerCase().includes(query);
      
      return matchCategory && matchSearch;
    });
  }, [webinars, activeCategory, search]);

  // Calculate stats for hero
  const totalWebinars = webinars.filter(w => w.is_published).length;
  const totalViews = webinars.reduce((sum, w) => sum + (w.view_count || 0), 0);
  const formattedTotalViews = totalViews >= 1000 ? `${Math.floor(totalViews / 1000)}k` : totalViews;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero 
        totalWebinars={totalWebinars}
        totalViews={formattedTotalViews}
        featuredWebinar={featuredWebinars[0]}
        copy={webinarsCopy.hero}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Featured Section */}
        {activeCategory === 'All' && !search && (
          <FeaturedSection 
            webinars={featuredWebinars}
            copy={webinarsCopy.featured}
          />
        )}

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar 
            value={search}
            onChange={setSearch}
            placeholder={webinarsCopy.search.placeholder}
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Grid */}
        <Grid 
          webinars={filteredWebinars}
          activeCategory={activeCategory}
          searchQuery={search}
          copy={webinarsCopy.grid}
        />
      </div>
    </div>
  );
}

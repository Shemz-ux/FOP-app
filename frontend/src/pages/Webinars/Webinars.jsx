import { useState, useEffect, useMemo } from "react";
import Hero from "../../components/Webinar/Hero";
import FeaturedSection from "../../components/Webinar/FeaturedSection";
import SearchBar from "../../components/Webinar/SearchBar";
import CategoryFilter from "../../components/Webinar/CategoryFilter";
import Grid from "../../components/Webinar/Grid";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import { webinarsCopy } from "./webinars.copy";
import { 
  listWebinars, 
  getFeaturedWebinars,
  getWebinarCategories 
} from "../../services/Webinars/webinarsService";

export default function Webinars() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [webinars, setWebinars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWebinars();
    fetchCategories();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const data = await listWebinars({ limit: 100 });
      setWebinars(data.webinars || []);
    } catch (err) {
      console.error('Error fetching webinars:', err);
      setError('Failed to load webinars');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getWebinarCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchWebinars}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero copy={webinarsCopy.hero} />

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

import { useState, useEffect, useMemo } from "react";
import Hero from "./components/Hero";
import FeaturedSection from "./components/FeaturedSection";
import CategoryFilter from "./components/CategoryFilter";
import Grid from "./components/Grid";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import Pagination from "../../components/Pagination/Pagination";
import { webinarsCopy } from "./webinars.copy";
import { 
  listWebinars, 
  getWebinarCategories 
} from "../../services/Webinars/webinarsService";

export default function Webinars() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [webinars, setWebinars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const webinarsPerPage = 9;

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
      // description is nullable in the schema, so guard every field: an
      // unguarded null throws on each keystroke once the title stops matching.
      const matchSearch =
        !query ||
        w.title?.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query) ||
        w.category?.toLowerCase().includes(query);
      
      return matchCategory && matchSearch;
    });
  }, [webinars, activeCategory, search]);

  const totalPages = Math.ceil(filteredWebinars.length / webinarsPerPage);

  const paginatedWebinars = useMemo(() => {
    const start = (currentPage - 1) * webinarsPerPage;
    return filteredWebinars.slice(start, start + webinarsPerPage);
  }, [filteredWebinars, currentPage]);

  // Searching or switching category shortens the list, so go back to page 1
  // rather than stranding the reader on a page that no longer exists.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Hero
        copy={webinarsCopy.hero}
        searchPlaceholder={webinarsCopy.search.placeholder}
        onSearch={({ query }) => setSearch(query)}
        onQueryChange={setSearch}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Featured Section */}
        {activeCategory === 'All' && !search && (
          <FeaturedSection 
            webinars={featuredWebinars}
            copy={webinarsCopy.featured}
          />
        )}

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Grid */}
        <Grid 
          webinars={paginatedWebinars}
          totalCount={filteredWebinars.length}
          activeCategory={activeCategory}
          searchQuery={search}
          copy={webinarsCopy.grid}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

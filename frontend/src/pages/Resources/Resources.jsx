import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, File } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import ResourceCard from "../../components/ResourceCard/ResourceCard";
import Pagination from "../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorMessage from "../../components/Ui/ErrorMessage";
import EmptyState from "../../components/Ui/EmptyState";
import { resourcesService } from "../../services";

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  File: File,
};

export default function Resources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [categories, setCategories] = useState([]);
  const [popularResources, setPopularResources] = useState([]);
  const resourcesPerPage = 12;

  const handleSearch = (filters) => {
    setSearchQuery(filters.query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Fetch resources from API
  useEffect(() => {
    fetchResources();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit: resourcesPerPage
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      const response = await resourcesService.getResources(filters);
      setResources(response.resources || []);
      setTotalResources(response.total || 0);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const stats = await resourcesService.getResourceStats();
        const cats = [
          { id: 'all', label: 'All Resources', count: stats.total_resources || 0 }
        ];
        
        if (stats.by_category) {
          Object.entries(stats.by_category).forEach(([category, count]) => {
            cats.push({ id: category, label: category, count });
          });
        }
        
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([{ id: 'all', label: 'All Resources', count: 0 }]);
      }
    };
    loadCategories();
  }, []);

  // Fetch popular resources
  useEffect(() => {
    const loadPopular = async () => {
      try {
        const response = await resourcesService.getResources({ 
          limit: 3, 
          sort_by: 'download_count',
          sort_order: 'desc'
        });
        setPopularResources(response.resources || []);
      } catch (err) {
        console.error('Error loading popular resources:', err);
      }
    };
    loadPopular();
  }, []);

  const totalPages = Math.ceil(totalResources / resourcesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async (resourceId) => {
    try {
      const downloadUrl = await resourcesService.downloadResource(resourceId);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="text-4xl text-foreground text-left">
                Career Resources
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 text-left">
              Download free templates, guides, and tools to supercharge your job search
            </p>

            <SearchBar 
              queryPlaceholder="Resource name or topic" 
              showLocation={false}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Resources Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-xl border transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {category.label}
              <span className="ml-2 opacity-70">
                ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchResources} />
        ) : resources.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No resources found"
            message="Try adjusting your search or category filter"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resource_id}
                  id={resource.resource_id}
                  title={resource.title}
                  description={resource.description}
                  category={resource.category}
                  fileType={resource.file_type}
                  fileSize={resource.file_size}
                  downloads={resource.download_count || 0}
                  iconType={resource.icon_type}
                  categoryVariant={resource.category_variant}
                  tags={resource.tags || []}
                  onDownload={() => handleDownload(resource.resource_id)}
                  onPreview={() => navigate(`/resources/${resource.resource_id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Popular Downloads */}
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border mt-8">
          <h3 className="text-foreground mb-6">
            Most Popular Downloads
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularResources.map((resource) => {
              const IconComponent = iconMap[resource.icon_type] || FileText;
              return (
                <div
                  key={resource.resource_id}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => navigate(`/resources/${resource.resource_id}`)}
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground mb-1 text-sm truncate text-left">
                      {resource.title}
                    </h4>
                    <p className="text-muted-foreground text-xs text-left">
                      {(resource.download_count || 0).toLocaleString()} downloads
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
